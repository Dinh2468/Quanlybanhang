import React, { useState, useEffect, useRef } from 'react';
import { MdClose, MdCloudUpload, MdArrowBack, MdDelete } from 'react-icons/md';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';

export default function CTSanPham() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Lấy quyền user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userRole = user?.vaiTro || user?.role || 'NhanVien';
  const isAdmin = userRole === 'Admin';
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const nameFromQuery = searchParams.get('name') || '';
  const returnUrl = searchParams.get('returnUrl');

  const [currentProduct, setCurrentProduct] = useState({
    tenSP: nameFromQuery,
    gia: 0,
    moTa: '',
    hinhAnh: '',
    maLoaiSP: '',
    maTH: '',
    soLuongTon: 0,
    soLuong: 0
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [importHistory, setImportHistory] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [catRes, brandRes, suppRes] = await Promise.all([
          API.get('/LoaiSP').catch(() => ({ data: [] })),
          API.get('/ThuongHieu').catch(() => ({ data: [] })),
          API.get('/NhaCungCap').catch(() => ({ data: [] }))
        ]);
        
        setCategories(catRes.data || []);
        setBrands(brandRes.data || []);
        setSuppliers(suppRes.data || []);

        if (isEdit) {
          // Fetch product details
          const [prodRes, historyRes, reviewsRes] = await Promise.all([
            API.get(`/SanPham/${id}`),
            API.get(`/SanPham/${id}/lich-su-nhap`).catch(() => ({ data: [] })),
            API.get(`/DanhGia?maSP=${id}`).catch(() => ({ data: [] }))
          ]);
          
          const product = prodRes.data;
          if (product) {
            setCurrentProduct({
              ...product,
              maLoaiSP: product.maLoaiSP || product.maLoai || '',
              soLuongTon: product.soLuongTon ?? product.soLuong ?? 0,
              soLuong: product.soLuong ?? product.soLuongTon ?? 0,
              trangThaiHienThi: product.trangThaiHienThi ?? true
            });
            setOldImages(product.hinhAnh ? product.hinhAnh.split(',') : []);
            setImportHistory(historyRes.data || []);
            setReviews(reviewsRes.data || []);
          }
        } else {
          // Defaults for new product
          setCurrentProduct(prev => ({
            ...prev,
            maLoaiSP: catRes.data[0]?.maLoaiSP || catRes.data[0]?.maLoai || '',
            maTH: brandRes.data[0]?.maTH || '',
            soLuongTon: 0,
            soLuong: 0,
            trangThaiHienThi: true
          }));
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.error('Không thể tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id, isEdit]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} không phải là ảnh hợp lệ!`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Ảnh ${file.name} vượt quá 5MB!`);
        return false;
      }
      return true;
    });

    setNewImages(prev => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveOldImage = (index) => {
    setOldImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteReview = async (maDG) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      try {
        await API.delete(`/DanhGia/${maDG}`);
        toast.success("Đã xóa đánh giá thành công!");
        setReviews(prev => prev.filter(r => r.maDG !== maDG));
      } catch (error) {
        toast.error("Xóa đánh giá thất bại. Vui lòng kiểm tra quyền truy cập.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentProduct.tenSP.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm!');
      return;
    }
    if (Number(currentProduct.gia) <= 0) {
      toast.error('Giá bán phải lớn hơn 0!');
      return;
    }

    setSubmitLoading(true);
    
    const formData = new FormData();
    formData.append('TenSP', currentProduct.tenSP);
    formData.append('MoTa', currentProduct.moTa || '');
    formData.append('Gia', Number(currentProduct.gia));
    formData.append('SoLuongTon', Number(currentProduct.soLuongTon || currentProduct.soLuong || 0));
    formData.append('MaLoai', Number(currentProduct.maLoaiSP || currentProduct.maLoai || 0));
    formData.append('MaTH', Number(currentProduct.maTH || 0));
    formData.append('TrangThaiHienThi', currentProduct.trangThaiHienThi);

    formData.append('AnhCuConLai', oldImages.join(','));
    newImages.forEach(file => {
      formData.append('FileHinhAnhs', file);
    });

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) {
        await API.put(`/SanPham/${id}`, formData, config);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await API.post('/SanPham', formData, config);
        toast.success('Thêm sản phẩm mới thành công!');
      }
      navigate(returnUrl ? returnUrl : '/admin/sanpham');
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      // const errMsg = error.response?.data?.message || error.response?.data?.title || error.response?.data?.errors ? JSON.stringify(error.response?.data?.errors) : error.message;
      toast.error('Bạn không có quyền thêm sản phẩm!');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout requiredRole="Nhân viên">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(returnUrl ? returnUrl : '/admin/sanpham')}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm"
          >
            <MdArrowBack className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isEdit ? 'Chi tiết sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit ? 'Xem và chỉnh sửa thông tin sản phẩm.' : 'Điền thông tin để tạo sản phẩm mới.'}
            </p>
          </div>
        </div>

       

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cột trái: Thông tin cơ bản */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                    Tên sản phẩm
                  </label>
                  <input 
                    type="text" 
                    value={currentProduct.tenSP}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, tenSP: e.target.value })}
                    placeholder="Ví dụ: Bút Máy Cao Cấp Parker IM Black"
                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700`}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                      Giá bán (VND)
                    </label>
                    <input 
                      type="number" 
                      value={currentProduct.gia}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, gia: Number(e.target.value) })}
                      placeholder="Ví dụ: 150000"
                      min="0"
                      className={`w-full bg-gray-50 border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                      Số lượng tồn kho
                    </label>
                    <input 
                      type="number" 
                      value={currentProduct.soLuongTon ?? currentProduct.soLuong ?? 0}
                      onChange={(e) => setCurrentProduct({ 
                        ...currentProduct, 
                        soLuongTon: Number(e.target.value),
                        soLuong: Number(e.target.value)
                      })}
                      placeholder="0 (chỉ tăng khi có phiếu nhập)"
                      min="0"
                      disabled={true}
                      className={`w-full bg-gray-100 border border-gray-200 rounded-2xl h-12 px-4 text-sm font-medium text-gray-500 cursor-not-allowed opacity-70`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                      Loại sản phẩm
                    </label>
                    <select 
                      value={currentProduct.maLoaiSP}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, maLoaiSP: e.target.value })}
                      className={`w-full bg-gray-50 border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700`}
                      required
                    >
                      {categories.map(c => (
                        <option key={c.maLoaiSP || c.maLoai} value={c.maLoaiSP || c.maLoai}>
                          {c.tenLoaiSP || c.tenLoai}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                      Thương hiệu
                    </label>
                    <select 
                      value={currentProduct.maTH}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, maTH: e.target.value })}
                      className={`w-full bg-gray-50 border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700`}
                      required
                    >
                      {brands.map(b => (
                        <option key={b.maTH} value={b.maTH}>
                          {b.tenTH}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Cột phải: Hình ảnh & Mô tả */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                    Hình ảnh sản phẩm
                  </label>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Image Gallery */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Old Images */}
                    {oldImages.map((img, idx) => (
                      <div key={`old-${idx}`} className="relative group w-full aspect-square border-2 border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img 
                          src={img} 
                          alt="Old Preview" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                        />
                        <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveOldImage(idx)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                            title="Xóa ảnh cũ này"
                          >
                            <MdClose className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* New Images */}
                    {newImages.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative group w-full aspect-square border-2 border-dashed border-primary/50 rounded-2xl overflow-hidden bg-primary/5 flex items-center justify-center">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="New Preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(idx)}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                            title="Hủy chọn ảnh này"
                          >
                            <MdClose className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Image Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:border-primary/40 hover:bg-primary/[0.02] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <MdCloudUpload className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors text-center px-2">Thêm ảnh</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 ml-1">
                    Mô tả sản phẩm
                  </label>
                  <textarea 
                    value={currentProduct.moTa}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, moTa: e.target.value })}
                    placeholder="Nhập mô tả chi tiết cho sản phẩm..."
                    rows="4"
                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none font-medium text-gray-700`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              {isEdit && isAdmin && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await API.patch(`/SanPham/${id}/doi-trang-thai`);
                      toast.success(res.data.message);
                      setCurrentProduct({ ...currentProduct, trangThaiHienThi: res.data.trangThaiHienThi });
                    } catch (err) {
                      toast.error('Có lỗi xảy ra khi đổi trạng thái');
                    }
                  }}
                  className={`px-6 py-3 text-white text-sm font-bold rounded-full transition-all shadow-sm ${currentProduct.trangThaiHienThi ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                >
                  {currentProduct.trangThaiHienThi ? 'Ẩn khỏi Web' : 'Duyệt hiển thị lên Web'}
                </button>
              )}
              <button 
                type="button"
                onClick={() => {
                  const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
                  navigate(returnUrl ? returnUrl : '/admin/sanpham');
                }}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-full transition-all cursor-pointer shadow-sm"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                disabled={submitLoading}
                className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer shadow-md hover:shadow-lg"
              >
                {submitLoading ? 'Đang lưu...' : (isEdit ? 'Lưu lại' : 'Thêm sản phẩm')}
              </button>
            </div>
          </form>
        </div>

        {isEdit && (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Lịch sử nhập hàng (Các lô hàng)</h3>
            {importHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold rounded-l-2xl">Mã phiếu</th>
                      <th className="p-4 font-bold">Nhà cung cấp</th>
                      <th className="p-4 font-bold">Ngày nhập</th>
                      <th className="p-4 font-bold">SL nhập</th>
                      <th className="p-4 font-bold text-emerald-600">Còn lại</th>
                      <th className="p-4 font-bold">Giá nhập</th>
                      <th className="p-4 font-bold rounded-r-2xl">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {importHistory.filter(h => h.soLuongConLai > 0).map((history, idx) => {
                      const giaNhap = history.donGia || 0;
                      const thanhTien = history.soLuong * giaNhap;
                      
                      // Format date as yyyy/MM/dd
                      const dateObj = new Date(history.ngayNhap);
                      const formattedDate = dateObj.getFullYear() + '/' + 
                        String(dateObj.getMonth() + 1).padStart(2, '0') + '/' + 
                        String(dateObj.getDate()).padStart(2, '0');

                      return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">#{history.maNH}</td>
                        <td className="p-4 text-gray-700">
                          {history.tenNCC || (history.loaiPhieu === 'Nhập hàng' ? 'Không rõ' : 'Nội bộ')}
                          <div className="text-[10px] text-gray-400 mt-1">{history.loaiPhieu}</div>
                        </td>
                        <td className="p-4 text-gray-600">{formattedDate}</td>
                        <td className="p-4 text-gray-500 font-medium">{history.soLuong}</td>
                        <td className="p-4 text-emerald-600 font-bold">{history.soLuongConLai}</td>
                        <td className="p-4 text-gray-900 font-medium">{giaNhap.toLocaleString()} ₫</td>
                        <td className="p-4 text-primary font-bold">{thanhTien.toLocaleString()} ₫</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">Sản phẩm này chưa có lịch sử nhập hàng nào.</p>
            )}
          </div>
        )}

        {isEdit && (
          <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Danh Sách Đánh Giá</h3>
            {reviews.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold rounded-l-2xl">Khách Hàng</th>
                      <th className="p-4 font-bold">Số Sao</th>
                      <th className="p-4 font-bold">Nội Dung</th>
                      <th className="p-4 font-bold">Ngày Đánh Giá</th>
                      <th className="p-4 font-bold rounded-r-2xl text-center">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {reviews.map((review) => {
                      const dateObj = new Date(review.ngayDG);
                      const formattedDate = dateObj.getFullYear() + '/' + 
                        String(dateObj.getMonth() + 1).padStart(2, '0') + '/' + 
                        String(dateObj.getDate()).padStart(2, '0');

                      return (
                      <tr key={review.maDG} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{review.tenKhachHang || 'Khách hàng'}</td>
                        <td className="p-4 text-orange-500 font-bold">{review.soSao} ★</td>
                        <td className="p-4 text-gray-700 max-w-xs truncate" title={review.noiDung}>{review.noiDung}</td>
                        <td className="p-4 text-gray-500">{formattedDate}</td>
                        <td className="p-4 text-center">
                          {isAdmin ? (
                            <button 
                              type="button"
                              onClick={() => handleDeleteReview(review.maDG)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                              title="Xóa đánh giá"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          ) : (
                            <button 
                              type="button"
                              disabled
                              className="text-gray-300 p-2 rounded-full cursor-not-allowed"
                              title="Bạn không có quyền xóa"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">Sản phẩm này chưa có đánh giá nào.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
