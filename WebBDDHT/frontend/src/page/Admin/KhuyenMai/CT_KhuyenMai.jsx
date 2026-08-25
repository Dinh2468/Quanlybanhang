import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdSave } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';

export default function CT_KhuyenMai() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [currentPromo, setCurrentPromo] = useState({
    tenKM: '',
    loaiKM: 'Phần trăm',
    giaTriKM: 10,
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dieuKienApDung: '',
    sanPhams: []
  });

  // Fetch real products
  const fetchProductsData = async () => {
    try {
      setProductsLoading(true);
      const prodRes = await API.get('/SanPham?pageSize=1000&isAdminApp=true');
      setProducts(prodRes.data.items || prodRes.data || []);
    } catch (err) {
      console.error('Không thể tải dữ liệu sản phẩm:', err);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  // Fetch promotion details if in Edit mode
  useEffect(() => {
    const fetchPromoDetails = async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        const res = await API.get(`/KhuyenMai/${id}`);
        const promo = res.data;
        
        // Format dates from ISO to yyyy-MM-dd
        const formatDate = (d) => {
          if (!d) return '';
          return d.split('T')[0];
        };

        setCurrentPromo({
          ...promo,
          giaTriKM: promo.phanTramGiam || promo.giaTriKM || 0,
          loaiKM: 'Phần trăm',
          ngayBatDau: formatDate(promo.ngayBatDau),
          ngayKetThuc: formatDate(promo.ngayKetThuc),
          sanPhams: promo.maSanPhams || promo.sanPhams || promo.danhSachMaSP || []
        });
      } catch (err) {
        console.error('Lỗi khi tải chi tiết khuyến mãi:', err);
        toast.error('Không tìm thấy khuyến mãi hoặc có lỗi xảy ra!');
        navigate('/admin/khuyenmai');
      } finally {
        setLoading(false);
      }
    };

    fetchPromoDetails();
  }, [id, isEdit, navigate]);

  const handleProductToggle = (productId) => {
    const selected = [...currentPromo.sanPhams];
    const index = selected.indexOf(productId);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(productId);
    }
    setCurrentPromo({ ...currentPromo, sanPhams: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPromo.tenKM.trim()) {
      toast.error('Vui lòng nhập tên chương trình khuyến mãi!');
      return;
    }

    if (currentPromo.ngayBatDau > currentPromo.ngayKetThuc) {
      toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return;
    }

    // Build payload matching LuuKhuyenMaiDto from backend
    const payload = {
      tenKM: currentPromo.tenKM,
      ngayBatDau: new Date(currentPromo.ngayBatDau).toISOString(),
      ngayKetThuc: new Date(currentPromo.ngayKetThuc).toISOString(),
      phanTramGiam: Number(currentPromo.giaTriKM || currentPromo.phanTramGiam || 10),
      dieuKienApDung: currentPromo.dieuKienApDung || null,
      maSanPhams: (currentPromo.sanPhams || []).map(Number)
    };

    setSubmitLoading(true);
    try {
      if (isEdit) {
        await API.put(`/KhuyenMai/${id}`, payload);
        toast.success('Cập nhật khuyến mãi thành công!');
      } else {
        await API.post('/KhuyenMai', payload);
        toast.success('Thêm khuyến mãi thành công!');
      }
      navigate('/admin/khuyenmai');
    } catch (err) {
      console.error('Lỗi khi lưu khuyến mãi:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.title || err.response?.data || err.message;
      toast.error('Lỗi khi lưu khuyến mãi: ' + (typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)));
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
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/khuyenmai')}
              className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-slate-50 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <MdArrowBack className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-on-background tracking-tight">
                {isEdit ? 'Chỉnh sửa Khuyến mãi' : 'Tạo Khuyến mãi mới'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-on-secondary-container">
                  {isEdit ? `Mã khuyến mãi: #${id}` : 'Thiết lập các ưu đãi cho khách hàng'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              type="button"
              onClick={() => navigate('/admin/khuyenmai')}
              className="px-5 py-2.5 bg-surface border border-outline-variant/30 text-on-background hover:bg-slate-50 text-sm font-bold rounded-full transition-all cursor-pointer shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-[#1D4ED8] px-6 h-11 rounded-full text-sm font-bold shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <MdSave className="w-5 h-5" />
              {submitLoading ? 'Đang lưu...' : 'Lưu Khuyến Mãi'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-on-background mb-1">Thông tin chung</h3>
                  <p className="text-sm text-on-secondary-container mb-4">Các thông tin cơ bản về chương trình khuyến mãi.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Tên chương trình khuyến mãi <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Giảm giá hè 2026, Black Friday..."
                    value={currentPromo.tenKM}
                    onChange={(e) => setCurrentPromo({ ...currentPromo, tenKM: e.target.value })}
                    className="w-full bg-background border border-outline-variant/30 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Giá trị giảm (%) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={currentPromo.giaTriKM}
                    onChange={(e) => setCurrentPromo({ ...currentPromo, giaTriKM: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background border border-outline-variant/30 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                  />
                  <p className="text-[10px] text-on-secondary-container mt-1">Hệ thống hiện tại áp dụng giảm theo phần trăm (Tối đa 100%).</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Ngày bắt đầu <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      required
                      value={currentPromo.ngayBatDau}
                      onChange={(e) => setCurrentPromo({ ...currentPromo, ngayBatDau: e.target.value })}
                      className="w-full bg-background border border-outline-variant/30 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Ngày kết thúc <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      required
                      value={currentPromo.ngayKetThuc}
                      onChange={(e) => setCurrentPromo({ ...currentPromo, ngayKetThuc: e.target.value })}
                      className="w-full bg-background border border-outline-variant/30 rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column - Products */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-on-background mb-1">Sản phẩm áp dụng</h3>
                  <p className="text-sm text-on-secondary-container mb-4">
                    Chọn các sản phẩm được áp dụng mức giảm giá này.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-background uppercase tracking-wider block">
                      Danh sách sản phẩm
                    </label>
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-lg">
                      Đã chọn: {currentPromo.sanPhams.length}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full bg-background border border-outline-variant/30 rounded-xl h-10 px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-background"
                    />
                  </div>
                  
                  {productsLoading ? (
                    <div className="flex items-center justify-center h-48 border border-outline-variant/30 rounded-2xl bg-background/50">
                      <p className="text-sm text-on-secondary-container animate-pulse">Đang tải sản phẩm từ hệ thống...</p>
                    </div>
                  ) : (
                    <div className="border border-outline-variant/30 rounded-2xl h-[420px] overflow-y-auto p-3 space-y-1 bg-background shadow-inner">
                      {products.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-center text-on-secondary-container">Không tìm thấy sản phẩm nào.</p>
                        </div>
                      ) : (
                        [...products]
                          .filter(p => 
                            p.tenSP?.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                            p.maSP?.toString().includes(searchKeyword)
                          )
                          .sort((a, b) => {
                            const aChecked = currentPromo.sanPhams.includes(a.maSP || a.id) ? 1 : 0;
                            const bChecked = currentPromo.sanPhams.includes(b.maSP || b.id) ? 1 : 0;
                            return bChecked - aChecked; // Checked items on top
                          })
                          .map((prod) => {
                          const isChecked = currentPromo.sanPhams.includes(prod.maSP || prod.id);
                          return (
                            <label
                              key={prod.maSP || prod.id}
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                                isChecked 
                                  ? 'bg-primary/5 border-primary/20' 
                                  : 'hover:bg-slate-50 border-transparent hover:border-outline-variant/20'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleProductToggle(prod.maSP || prod.id)}
                                className="w-5 h-5 text-primary focus:ring-primary/20 border-gray-300 rounded cursor-pointer"
                              />
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant/30 shrink-0 bg-white">
                                  <img
                                    src={prod.hinhAnh || `https://ui-avatars.com/api/?name=${encodeURIComponent(prod.tenSP || 'P')}&background=EFF6FF&color=2563EB`}
                                    alt={prod.tenSP}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://placehold.co/100'; }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-on-background line-clamp-1">{prod.tenSP}</p>
                                  <p className="text-xs text-on-secondary-container font-medium">{prod.gia?.toLocaleString('vi-VN')} đ</p>
                                </div>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                  <p className="text-[11px] text-on-secondary-container flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">i</span>
                    Nếu không tích chọn sản phẩm nào, hệ thống mặc định áp dụng cho tất cả sản phẩm.
                  </p>
                </div>

              </div>
            </div>
            
          </form>
        </div>

      </div>
    </AdminLayout>
  );
}
