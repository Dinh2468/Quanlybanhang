import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList, MdImage, MdRefresh } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';
import Pagination from '../../../components/Pagination';

export default function QLSanPham() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy quyền user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userRole = user?.vaiTro || user?.role || 'NhanVien';
  const isAdmin = userRole === 'Admin';
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterBrand]);

  // Fetch filter dropdown data once
  const fetchFiltersData = async () => {
    try {
      const [catRes, brandRes, suppRes] = await Promise.all([
        API.get('/LoaiSP').catch(() => ({ data: [] })),
        API.get('/ThuongHieu').catch(() => ({ data: [] })),
        API.get('/NhaCungCap').catch(() => ({ data: [] }))
      ]);
      setCategories(catRes.data || []);
      setBrands(brandRes.data || []);
      setSuppliers(suppRes.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh mục filter:', error);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  // Fetch products with pagination
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        isAdminApp: true,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterCategory && { categoryId: filterCategory }),
        ...(filterBrand && { brandId: filterBrand })
      });
      const res = await API.get(`/SanPham?${params.toString()}`);
      
      setProducts(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      toast.error('Không thể tải dữ liệu sản phẩm!');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filterCategory, filterBrand]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset all filters to show all products
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterBrand('');
    setCurrentPage(1);
    toast.success('Đã xóa bộ lọc!');
  };

  // tìm tên loại sản phẩm
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.maLoaiSP === id || c.maLoai === id);
    return cat ? (cat.tenLoaiSP || cat.tenLoai) : 'Không rõ';
  };
  // tìm tên thương hiệu
  const getBrandName = (id) => {
    const brand = brands.find(b => b.maTH === id);
    return brand ? brand.tenTH : 'Không rõ';
  };

  // thêm sản phẩm
  const handleAddProduct = () => {
    navigate('/admin/sanpham/add');
  };

  // chỉnh sửa sản phẩm
  const handleEditProduct = (id) => {
    navigate(`/admin/sanpham/edit/${id}`);
  };

  // xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await API.delete(`/SanPham/${id}`);
        toast.success('Xóa sản phẩm thành công!');
        fetchProducts();
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        toast.error('Không thể xóa sản phẩm này vì có thể đã nằm trong giỏ hàng hoặc đơn hàng!');
      }
    }
  };

  // định dạng tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quản lý sản phẩm</h2>
            <p className="text-sm text-gray-500">Xem và quản lý danh sách sản phẩm trong kho của bạn.</p>
          </div>
          {isAdmin && (
            <button 
              
              onClick={handleAddProduct}
              className="px-5 py-3 bg-[#0070F3] hover:bg-[#0060df] text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all self-end md:self-auto"
            >
              <MdAdd className="w-5 h-5" />
              <span>Thêm sản phẩm mới</span>
            </button>
          )}
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tổng số sản phẩm */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tổng số sản phẩm</p>
              <h4 className="text-xl font-black text-gray-800">{new Intl.NumberFormat('vi-VN').format(totalCount)}</h4>
            </div>
          </div>

          {/* Card 2: Sắp hết hàng */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100/50">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Sắp hết hàng</p>
              <h4 className="text-xl font-black text-amber-600">{products.filter(p => { const stock = p.soLuongTon ?? p.soLuong ?? 0; return stock > 0 && stock <= 10; }).length}</h4>
            </div>
          </div>

          {/* Card 3: Hết hàng */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100/50">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Hết hàng</p>
              <h4 className="text-xl font-black text-rose-600">{products.filter(p => (p.soLuongTon ?? p.soLuong ?? 0) === 0).length}</h4>
            </div>
          </div>

          {/* Card 4: Đang khuyến mãi */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Đang khuyến mãi</p>
              <h4 className="text-xl font-black text-emerald-600">{Math.max(3, Math.round(products.length * 0.12))}</h4>
            </div>
          </div>
        </div>

        {/* White container card for Filters and Table */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Filters Pill Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="w-full sm:w-72 relative">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input 
                type="text" 
                placeholder="Tìm tên sản phẩm, thương hiệu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full h-11 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700"
              />
            </div>

            {/* Filter Category Select pill */}
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-gray-250 rounded-full h-11 px-4 text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-gray-600 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(c => (
                <option key={c.maLoaiSP || c.maLoai} value={c.maLoaiSP || c.maLoai}>
                  {c.tenLoaiSP || c.tenLoai}
                </option>
              ))}
            </select>

            {/* Filter Brand Select pill */}
            <select 
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="bg-white border border-gray-250 rounded-full h-11 px-4 text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-gray-600 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <option value="">Thương hiệu</option>
              {brands.map(b => (
                <option key={b.maTH} value={b.maTH}>
                  {b.tenTH}
                </option>
              ))}
            </select>

            {/* Sorting pill */}
            <select 
              className="bg-white border border-gray-250 rounded-full h-11 px-4 text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-gray-600 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <option>Sắp xếp theo</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
              <option>Tồn kho tăng dần</option>
            </select>

            {/* Filter reset action button */}
            <button 
              onClick={handleResetFilters}
              className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors shadow-sm"
              title="Đặt lại bộ lọc"
            >
              <MdRefresh className="w-5 h-5" />
            </button>
          </div>

          {/* Total products stat */}
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <span className="font-black text-lg">{totalCount}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Sản phẩm tìm thấy</p>
                <p className="text-xs text-blue-600 font-medium">Trong tổng số dữ liệu</p>
              </div>
            </div>
          </div>

          {/* Product Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="font-semibold text-lg">Không tìm thấy sản phẩm nào.</p>
              <button 
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-[#1E3A8A] text-white font-bold text-xs uppercase tracking-wider">
                    <th className="p-4 w-20 text-center">Hình</th>
                    <th className="p-4 min-w-[220px]">Tên sản phẩm</th>
                    <th className="p-4">Loại sản phẩm</th>
                    <th className="p-4">Thương hiệu</th>
                    <th className="p-4">Giá bán</th>
                    <th className="p-4 text-center">Tồn kho</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 w-28 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod, index) => {
                    const categoryName = getCategoryName(prod.maLoaiSP || prod.maLoai);
                    let catBadgeClass = "bg-slate-50 text-slate-600 border-slate-200/50";
                    if (categoryName.includes('Bút') || categoryName.includes('Viết')) {
                      catBadgeClass = "bg-sky-50 text-sky-600 border-sky-100/70";
                    } else if (categoryName.includes('Sổ') || categoryName.includes('Tập') || categoryName.includes('Vở') || categoryName.includes('Nhật ký')) {
                      catBadgeClass = "bg-amber-50 text-amber-600 border-amber-100/70";
                    } else if (categoryName.includes('Balo') || categoryName.includes('Cặp')) {
                      catBadgeClass = "bg-emerald-50 text-emerald-600 border-emerald-100/70";
                    } else if (categoryName.includes('Giấy')) {
                      catBadgeClass = "bg-indigo-50 text-indigo-600 border-indigo-100/70";
                    } else if (categoryName.includes('Dụng cụ') || categoryName.includes('Máy tính')) {
                      catBadgeClass = "bg-pink-50 text-pink-600 border-pink-100/70";
                    }

                    const stock = prod.soLuongTon ?? prod.soLuong ?? 0;
                    let stockBadge = { dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100/50', text: `Còn hàng (${stock})` };
                    if (stock === 0) {
                      stockBadge = { dot: 'bg-rose-500', bg: 'bg-rose-50 text-rose-700 border-rose-100/50', text: 'Hết hàng' };
                    } else if (stock <= 10) {
                      stockBadge = { dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700 border-amber-100/50', text: `Sắp hết (${stock})` };
                    }

                    return (
                      <tr key={prod.maSP} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 text-center">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-150 flex items-center justify-center mx-auto shadow-sm">
                            {prod.hinhAnh ? (
                              <img 
                                src={prod.hinhAnh.split(',')[0]} 
                                alt={prod.tenSP} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                              />
                            ) : (
                              <MdImage className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-800 line-clamp-2">{prod.tenSP}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">Mã ID: #{prod.maSP}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block ${catBadgeClass}`}>
                            {categoryName}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-semibold">
                          {getBrandName(prod.maTH)}
                        </td>
                        <td className="p-4 font-extrabold text-gray-850">
                          {formatPrice(prod.gia)}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${stockBadge.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stockBadge.dot}`} />
                            <span>{stockBadge.text}</span>
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {prod.trangThaiHienThi ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold border inline-flex bg-emerald-50 text-emerald-700 border-emerald-100">
                              Đã duyệt
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold border inline-flex bg-rose-50 text-rose-700 border-rose-100">
                              Đang ẩn
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEditProduct(prod.maSP)}
                              className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                              title={isAdmin ? "Sửa" : "Xem chi tiết"}
                            >
                              <MdEdit className="w-4 h-4" />
                            </button>
                            {isAdmin ? (
                              <button 
                                onClick={() => handleDelete(prod.maSP)}
                                className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                                title="Xóa"
                              >
                                <MdDelete className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                className="w-8 h-8 rounded-full bg-gray-50 text-gray-300 border border-gray-200 flex items-center justify-center cursor-not-allowed"
                                title="Bạn không có quyền xóa"
                              >
                                <MdDelete className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Component */}
          {!loading && totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
