import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';

export default function QLLoaiSP() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  const [currentCategory, setCurrentCategory] = useState({ tenLoai: '', moTa: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch })
      });
      const res = await API.get(`/LoaiSP?${params.toString()}`);
      
      setCategories(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải loại sản phẩm:', error);
      toast.error('Không thể tải danh sách loại sản phẩm!');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle open modal
  const openModal = (category = null, edit = false) => {
    if (category) {
      setCurrentCategory({
        ...category,
        tenLoai: category.tenLoai || category.tenLoaiSP || '',
        moTa: category.moTa || ''
      });
    } else {
      setCurrentCategory({ tenLoai: '', moTa: '' });
    }
    setIsEdit(edit);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory({ tenLoai: '', moTa: '' });
    setIsEdit(false);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(currentCategory.tenLoai || '').trim()) {
      toast.error('Vui lòng nhập tên loại sản phẩm!');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        tenLoai: currentCategory.tenLoai,
        moTa: currentCategory.moTa
      };
      if (isEdit) {
        // Cập nhật loại sản phẩm
        const catId = currentCategory.maLoai || currentCategory.maLoaiSP;
        await API.put(`/LoaiSP/${catId}`, payload);
        toast.success('Cập nhật loại sản phẩm thành công!');
      } else {
        // Thêm loại sản phẩm mới
        await API.post('/LoaiSP', payload);
        toast.success('Thêm loại sản phẩm mới thành công!');
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu loại sản phẩm:', error);
      toast.error('Lỗi lưu loại sản phẩm: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại sản phẩm này không?')) {
      try {
        await API.delete(`/LoaiSP/${id}`);
        toast.success('Xóa loại sản phẩm thành công!');
        fetchCategories();
      } catch (error) {
        console.error('Lỗi khi xóa loại sản phẩm:', error);
        toast.error('Không thể xóa loại sản phẩm này vì có thể đã chứa sản phẩm!');
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
              placeholder="Tìm kiếm loại sản phẩm..." 
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
            <span>Thêm loại sản phẩm</span>
          </button>
        </div>

        {/* Categories Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-on-secondary-container">Không tìm thấy loại sản phẩm nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse border border-outline-variant/30 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-secondary text-white font-bold">
                  <th className="p-4 w-20">ID</th>
                  <th className="p-4 w-1/3">Tên Loại</th>
                  <th className="p-4">Mô Tả</th>
                  <th className="p-4 w-32 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat.maLoai || cat.maLoaiSP} className={`border-b border-outline-variant/20 hover:bg-background/40 transition-colors ${index % 2 === 1 ? 'bg-background/20' : ''}`}>
                    <td className="p-4 font-bold text-on-secondary-container">#{cat.maLoai || cat.maLoaiSP}</td>
                    <td className="p-4 font-bold text-on-background">{cat.tenLoai || cat.tenLoaiSP}</td>
                    <td className="p-4 text-on-secondary-container line-clamp-2 max-w-[400px] border-none">{cat.moTa || 'Chưa có mô tả'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2.5">
                        <button 
                          onClick={() => openModal(cat, true)}
                          className="w-8 h-8 rounded-full bg-orange-50 text-tertiary border border-orange-100 hover:bg-orange-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.maLoai || cat.maLoaiSP)}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
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
                {isEdit ? 'Chỉnh sửa loại sản phẩm' : 'Thêm loại sản phẩm mới'}
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
                  Tên loại sản phẩm
                </label>
                <input 
                  type="text" 
                  value={currentCategory.tenLoai || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, tenLoai: e.target.value })}
                  placeholder="Ví dụ: Bút máy cao cấp"
                  className="w-full bg-background border border-outline-variant/50 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                  Mô tả
                </label>
                <textarea 
                  value={currentCategory.moTa}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, moTa: e.target.value })}
                  placeholder="Mô tả ngắn gọn về loại sản phẩm này..."
                  rows="4"
                  className="w-full bg-background border border-outline-variant/50 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all resize-none"
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
