import React, { useState, useEffect, useRef } from 'react';
import { MdShoppingCart, MdDelete, MdArrowBack } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';

const removeVietnameseTones = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD') // Tách các dấu (huyền, sắc, ngã,...) ra khỏi chữ cái gốc
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các ký tự dấu đó
    .replace(/đ/g, 'd') // Riêng chữ đ/Đ phải xử lý tay vì nó là một ký tự gốc trong Unicode
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

const CustomProductSelect = ({ products, value, onChange, onCreateNew }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredProducts = products.filter(p => {
    const pName = removeVietnameseTones(p.tenSP);
    const pId = String(p.maSP || p.id);
    const sTerm = removeVietnameseTones(searchTerm);
    return pName.includes(sTerm) || pId.includes(sTerm);
  });

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        required
        onChange={(e) => {
           setSearchTerm(e.target.value);
           setIsOpen(true);
           onChange('', e.target.value); // Xóa maSP, chỉ giữ text
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="-- Gõ Tên hoặc Mã sản phẩm --"
        className="w-full bg-background border border-outline-variant/20 rounded-xl h-11 px-3 text-sm focus:outline-none focus:border-primary transition-all text-on-background"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <li
                key={p.maSP || p.id}
                onClick={() => {
                  setSearchTerm(p.tenSP);
                  setIsOpen(false);
                  onChange(p.maSP || p.id, p.tenSP);
                }}
                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium border-b border-gray-50 last:border-0 flex items-center"
              >
                <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded mr-2">
                  #{p.maSP || p.id}
                </span>
                {p.tenSP}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500 italic flex flex-col items-center gap-2">
              <span>Không tìm thấy sản phẩm</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCreateNew) onCreateNew(searchTerm);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                + Tạo sản phẩm mới
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default function PhieuNhapHang() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingRealData, setLoadingRealData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newReceipt, setNewReceipt] = useState({
    maNCC: '',
    loaiPhieu: 'Nhập hàng',
    ngayNhap: new Date().toISOString().split('T')[0],
    items: [] // { maSP: '', soLuong: 1, donGiaNhap: 0 }
  });

  const fetchDropdownData = async () => {
    try {
      setLoadingRealData(true);
      const [suppRes, prodRes] = await Promise.all([
        API.get('/NhaCungCap').catch(() => ({ data: [] })),
        API.get('/SanPham?pageSize=1000&isAdminApp=true').catch(() => ({ data: [] }))
      ]);
      setSuppliers(suppRes.data.items || suppRes.data || []);
      setProducts(prodRes.data.items || prodRes.data || []);
      
      if (isEdit) {
        await fetchReceiptDetails();
      }
    } catch (err) {
      console.error('Không thể lấy dữ liệu nhà cung cấp / sản phẩm:', err);
    } finally {
      setLoadingRealData(false);
    }
  };
  
  const fetchReceiptDetails = async () => {
    try {
      const res = await API.get(`/NhapHang/${id}`);
      const data = res.data;
      if (data.trangThai !== 'Chờ Xác Nhận') {
        toast.error(`Không thể chỉnh sửa phiếu nhập đang ở trạng thái: ${data.trangThai}`);
        navigate('/admin/nhaphang');
        return;
      }
      
      const items = data.danhSachSanPham || data.chiTietNhapHangs || [];
      
      setNewReceipt({
        maNCC: data.maNCC || '',
        loaiPhieu: data.loaiPhieu || 'Nhập hàng',
        ngayNhap: data.ngayNhap ? data.ngayNhap.split('T')[0] : new Date().toISOString().split('T')[0],
        items: items.map(item => ({
          maSP: item.maSP || item.id,
          tenSP: item.tenSP || item.sanPham?.tenSP || '',
          soLuong: item.soLuong || 1,
          donGiaNhap: item.donGia || item.donGiaNhap || 0
        }))
      });
    } catch (error) {
      toast.error('Lỗi khi tải thông tin phiếu nhập');
      navigate('/admin/nhaphang');
    }
  };

  useEffect(() => {
    const savedState = sessionStorage.getItem('savedReceiptState');
    if (savedState) {
      try {
        setNewReceipt(JSON.parse(savedState));
      } catch (e) {
        console.error('Lỗi khi khôi phục trạng thái phiếu nhập:', e);
      }
      sessionStorage.removeItem('savedReceiptState');
    }
    fetchDropdownData();
  }, [id]);

  const handleAddItemRow = () => {
    setNewReceipt(prev => ({
      ...prev,
      items: [...prev.items, { maSP: '', tenSP: '', soLuong: 1, donGiaNhap: 0 }]
    }));
  };

  const handleRemoveItemRow = (index) => {
    setNewReceipt(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewReceipt(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, items: updatedItems };
    });
  };

  const calculateNewReceiptTotal = () => {
    return newReceipt.items.reduce((sum, item) => sum + ((item.soLuong || 0) * (item.donGiaNhap || 0)), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!newReceipt.maNCC && newReceipt.loaiPhieu === 'Nhập hàng') {
      toast.error('Vui lòng chọn nhà cung cấp khi Nhập hàng mới!');
      return;
    }
    if (newReceipt.items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm để nhập kho!');
      return;
    }
    
    // Check if any item has empty maSP
    if (newReceipt.items.some(item => !item.maSP)) {
      toast.error('Vui lòng chọn sản phẩm cho tất cả các dòng!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        maNCC: newReceipt.maNCC ? parseInt(newReceipt.maNCC) : null,
        loaiPhieu: newReceipt.loaiPhieu,
        chiTietNhapHangs: newReceipt.items.map(item => ({
          maSP: parseInt(item.maSP),
          soLuong: parseInt(item.soLuong),
          donGia: parseFloat(item.donGiaNhap)
        }))
      };

      if (isEdit) {
        await API.put(`/NhapHang/${id}`, payload);
        toast.success('Chỉnh sửa phiếu nhập kho thành công!');
        navigate(`/admin/nhaphang/${id}`);
      } else {
        await API.post('/NhapHang', payload);
        toast.success('Tạo phiếu nhập kho thành công!');
        navigate('/admin/nhaphang');
      }
    } catch (error) {
      toast.error(`Lỗi khi ${isEdit ? 'sửa' : 'lập'} phiếu nhập: ` + (error.response?.data?.message || error.message));
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/nhaphang')}
              className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              <MdArrowBack className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-on-background tracking-tight">
                {isEdit ? `Chỉnh sửa Phiếu nhập #${id}` : 'Tạo Phiếu nhập kho mới'}
              </h2>
              <p className="text-sm text-on-secondary-container mt-1">
                {isEdit ? 'Chỉnh sửa thông tin nhà cung cấp và danh sách mặt hàng' : 'Nhập thông tin nhà cung cấp và danh sách mặt hàng cần nhập'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <form onSubmit={handleCreateSubmit} className="space-y-8">
            
            {/* Supplier, Type & Import Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-outline-variant/10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-background uppercase tracking-wider block">
                  Chọn nhà cung cấp {newReceipt.loaiPhieu !== 'Nhập hàng' && '(Tùy chọn)'}
                </label>
                <select
                  required={newReceipt.loaiPhieu === 'Nhập hàng'}
                  value={newReceipt.maNCC}
                  onChange={(e) => setNewReceipt({ ...newReceipt, maNCC: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                >
                  <option value="">-- {newReceipt.loaiPhieu === 'Nhập hàng' ? 'Chọn Nhà cung cấp thực tế' : 'Không có / Nội bộ'} --</option>
                  {suppliers.map(s => (
                    <option key={s.maNCC || s.id} value={s.maNCC || s.id}>{s.tenNCC}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Loại phiếu</label>
                <select
                  required
                  value={newReceipt.loaiPhieu}
                  onChange={(e) => {
                    const newLoaiPhieu = e.target.value;
                    setNewReceipt(prev => {
                      let updatedItems = prev.items;
                      // Nếu đổi sang phiếu Giảm, tự động ép toàn bộ đơn giá về giá sản phẩm gốc
                      if (newLoaiPhieu === 'Điều chỉnh giảm') {
                        updatedItems = prev.items.map(item => {
                          const prod = products.find(p => (p.maSP || p.id) === item.maSP);
                          return { ...item, donGiaNhap: prod && prod.gia ? prod.gia : 0 };
                        });
                      }
                      return { ...prev, loaiPhieu: newLoaiPhieu, items: updatedItems };
                    });
                  }}
                  className="w-full bg-background border border-outline-variant/30 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                >
                  <option value="Nhập hàng">Nhập hàng</option>
                  <option value="Điều chỉnh tăng">Điều chỉnh tăng</option>
                  <option value="Điều chỉnh giảm">Điều chỉnh giảm</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Ngày nhập (Hệ thống ghi nhận)</label>
                <input
                  type="date"
                  required
                  disabled
                  value={newReceipt.ngayNhap}
                  className="w-full bg-slate-100 border border-outline-variant/20 rounded-xl h-12 px-4 text-sm text-on-secondary-container cursor-not-allowed"
                />
              </div>
            </div>

            {/* Items selection section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/20 pb-3 gap-3">
                <h4 className="text-base font-bold text-on-background flex items-center gap-2">
                  <MdShoppingCart className="w-5 h-5 text-primary" />
                  Các sản phẩm nhập kho
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toast.loading("Đang tải lại danh sách...", { id: "refresh" });
                      fetchDropdownData().then(() => toast.success("Đã cập nhật danh sách!", { id: "refresh" }));
                    }}
                    className="text-sm font-bold text-gray-600 hover:text-gray-900 border border-gray-200 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1"
                    title="Tải lại danh sách sản phẩm nếu bạn vừa thêm mới"
                  >
                    Tải lại danh sách
                  </button>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-sm font-bold text-primary hover:text-primary-hover border border-primary/20 bg-primary/5 hover:bg-primary/10 px-5 py-2 rounded-full transition-all cursor-pointer"
                  >
                    + Thêm mặt hàng
                  </button>
                </div>
              </div>

              {newReceipt.items.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-dashed border-outline-variant/30 rounded-2xl">
                  <p className="text-sm text-on-secondary-container mb-3">Chưa có sản phẩm nào được đưa vào phiếu nhập.</p>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-sm font-bold text-primary hover:underline cursor-pointer"
                  >
                    Thêm sản phẩm ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {newReceipt.items.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 border border-outline-variant/10 rounded-2xl p-5 relative transition-all hover:border-primary/20">
                      
                      {/* Custom Product Select for better search with Vietnamese accent */}
                      <div className="flex-1 space-y-1.5">
                        <label className="text-xs font-bold text-on-secondary-container uppercase tracking-wider block">Chọn sản phẩm (Gõ để tìm kiếm)</label>
                        <CustomProductSelect
                          products={products}
                          value={item.tenSP || products.find(p => p.maSP === item.maSP)?.tenSP || ''}
                          onChange={(maSP, tenSP) => {
                            const prod = products.find(p => (p.maSP || p.id) === maSP);
                            setNewReceipt(prev => {
                              const updatedItems = [...prev.items];
                              updatedItems[index] = {
                                ...updatedItems[index],
                                maSP,
                                tenSP,
                                donGiaNhap: prod && prod.gia ? prod.gia : 0
                              };
                              return { ...prev, items: updatedItems };
                            });
                          }}
                          onCreateNew={(searchTerm) => {
                            sessionStorage.setItem('savedReceiptState', JSON.stringify(newReceipt));
                            navigate('/admin/sanpham/add?name=' + encodeURIComponent(searchTerm) + '&returnUrl=/admin/nhaphang/add');
                          }}
                        />
                      </div>

                      {/* Quantity */}
                      <div className="w-full md:w-32 space-y-1.5">
                        <label className="text-xs font-bold text-on-secondary-container uppercase tracking-wider block">Số lượng</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.soLuong}
                          onChange={(e) => handleItemChange(index, 'soLuong', parseInt(e.target.value) || 0)}
                          className="w-full bg-background border border-outline-variant/20 rounded-xl h-11 px-3 text-sm focus:outline-none focus:border-primary transition-all text-on-background"
                        />
                      </div>

                      {/* Import Price */}
                      <div className="w-full md:w-48 space-y-1.5">
                        <label className="text-xs font-bold text-on-secondary-container uppercase tracking-wider block">Đơn giá nhập (đ)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          disabled={newReceipt.loaiPhieu === 'Điều chỉnh giảm'}
                          value={item.donGiaNhap}
                          onChange={(e) => handleItemChange(index, 'donGiaNhap', parseInt(e.target.value) || 0)}
                          className={`w-full border border-outline-variant/20 rounded-xl h-11 px-3 text-sm focus:outline-none focus:border-primary transition-all text-on-background ${newReceipt.loaiPhieu === 'Điều chỉnh giảm' ? 'bg-slate-100 cursor-not-allowed opacity-70' : 'bg-background'}`}
                        />
                      </div>

                      {/* Thanh tien */}
                      <div className="w-full md:w-48 space-y-1.5">
                        <span className="text-xs font-bold text-on-secondary-container uppercase tracking-wider block">Thành tiền</span>
                        <div className="h-11 flex items-center justify-end px-4 bg-slate-100 border border-transparent rounded-xl text-sm font-bold text-primary">
                          {formatPrice((item.soLuong || 0) * (item.donGiaNhap || 0))}
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(index)}
                        className="w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-200/50 flex items-center justify-center transition-colors md:mt-6 self-end md:self-auto cursor-pointer"
                        title="Xóa dòng"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total & Submit */}
            <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
                <p className="text-sm text-on-secondary-container font-semibold uppercase tracking-wider mb-1">TỔNG GIÁ TRỊ PHIẾU NHẬP</p>
                <p className="text-3xl font-black text-primary">{formatPrice(calculateNewReceiptTotal())}</p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/nhaphang')}
                  className="px-6 py-3 bg-surface border border-outline-variant/30 text-on-background hover:bg-slate-50 text-base font-bold rounded-full transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-primary text-white hover:bg-primary-hover text-base font-bold rounded-full shadow-lg shadow-primary/20 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Lưu thay đổi' : 'Lưu & Xác nhận tạo phiếu')}
                </button>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}