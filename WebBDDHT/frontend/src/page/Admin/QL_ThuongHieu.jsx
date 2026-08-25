import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';

export default function QLThuongHieu() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.vaiTro === 'Admin';
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState({ tenTH: '', quocGia: '', moTa: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch brands
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch })
      });
      const res = await API.get(`/ThuongHieu?${params.toString()}`);
      
      setBrands(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải thương hiệu:', error);
      toast.error('Không thể tải danh sách thương hiệu!');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Handle open modal
  const openModal = (brand = { tenTH: '', moTa: '' }, edit = false) => {
    setCurrentBrand(brand);
    setIsEdit(edit);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentBrand({ tenTH: '', quocGia: '', moTa: '' });
    setIsEdit(false);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentBrand.tenTH.trim()) {
      toast.error('Vui lòng nhập tên thương hiệu!');
      return;
    }

    setSubmitLoading(true);
    try {
      if (isEdit) {
        // Cập nhật thương hiệu
        await API.put(`/ThuongHieu/${currentBrand.maTH}`, { tenTH: currentBrand.tenTH, quocGia: currentBrand.quocGia || 'Việt Nam', moTa: currentBrand.moTa });
        toast.success('Cập nhật thương hiệu thành công!');
      } else {
        // Thêm thương hiệu mới
        await API.post('/ThuongHieu', { tenTH: currentBrand.tenTH, quocGia: currentBrand.quocGia || 'Việt Nam', moTa: currentBrand.moTa });
        toast.success('Thêm thương hiệu mới thành công!');
      }
      fetchBrands();
      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu thương hiệu:', error);
      toast.error('Lỗi lưu thương hiệu: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Brand
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) {
      try {
        await API.delete(`/ThuongHieu/${id}`);
        toast.success('Xóa thương hiệu thành công!');
        fetchBrands();
      } catch (error) {
        console.error('Lỗi khi xóa thương hiệu:', error);
        if (error.response?.status === 403) {
          toast.error('Bạn không có quyền thực hiện chức năng này!');
        } else {
          toast.error('Không thể xóa thương hiệu này vì có thể đã có sản phẩm thuộc thương hiệu này!');
        }
      }
    }
  };

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="w-full sm:w-80 relative group">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input 
              type="text" 
              placeholder="Tìm kiếm thương hiệu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-outline-variant/30 rounded-full h-11 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
          </div>

          {/* Add button */}
          <button 
            onClick={() => openModal()}
            className="w-full sm:w-auto px-5 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-[#1D4ED8] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <MdAdd className="w-5 h-5" />
            <span>Thêm thương hiệu</span>
          </button>
        </div>

          {/* Brands Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12 text-on-secondary-container">Không tìm thấy thương hiệu nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse border border-outline-variant/30 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-secondary text-white font-bold">
                    <th className="p-4 w-20">Mã</th>
                    <th className="p-4 w-1/4">Tên thương hiệu</th>
                    <th className="p-4 w-1/4">Quốc gia</th>
                    <th className="p-4">Mô tả</th>
                    <th className="p-4 w-32 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand, index) => (
                  <tr key={brand.maTH} className={`border-b border-outline-variant/20 hover:bg-background/40 transition-colors ${index % 2 === 1 ? 'bg-background/20' : ''}`}>
                    <td className="p-4 font-bold text-on-secondary-container">#{brand.maTH}</td>
                    <td className="p-4 font-bold text-on-background">{brand.tenTH}</td>
                    <td className="p-4 text-on-secondary-container">{brand.quocGia}</td>
                    <td className="p-4 text-on-secondary-container line-clamp-2 max-w-[400px] border-none">{brand.moTa || 'Chưa có mô tả'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2.5">
                        <button 
                          onClick={() => openModal(brand, true)}
                          className="w-8 h-8 rounded-full bg-orange-50 text-tertiary border border-orange-100 hover:bg-orange-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(brand.maTH)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-outline-variant/30">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-background">
              <h3 className="font-bold text-lg text-on-background">
                {isEdit ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
              </h3>
              <button 
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-on-secondary-container hover:bg-outline-variant/30 hover:text-on-background transition-colors cursor-pointer"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                  Tên thương hiệu
                </label>
                <input 
                  type="text" 
                  value={currentBrand.tenTH}
                  onChange={(e) => setCurrentBrand({ ...currentBrand, tenTH: e.target.value })}
                  placeholder="Ví dụ: Deli, Thiên Long..."
                  className="w-full bg-background border border-outline-variant/50 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                  Mô tả
                </label>
                <textarea 
                  value={currentBrand.moTa}
                  onChange={(e) => setCurrentBrand({ ...currentBrand, moTa: e.target.value })}
                  placeholder="Mô tả ngắn gọn về thương hiệu này..."
                  rows="3"
                  className="w-full bg-background border border-outline-variant/50 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                  Quốc gia <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={currentBrand.quocGia || ''}
                  onChange={(e) => setCurrentBrand({ ...currentBrand, quocGia: e.target.value })}
                  placeholder="Ví dụ: Việt Nam, Nhật Bản, Đức..."
                  className="w-full bg-background border border-outline-variant/50 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-background border border-outline-variant/30 text-on-background hover:bg-outline-variant/50 text-sm font-bold rounded-full transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-[#1D4ED8] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {submitLoading ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
