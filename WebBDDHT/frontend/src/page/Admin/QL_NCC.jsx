import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdBusiness } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Pagination from '../../components/Pagination';

export default function QLNCC() {
  const [suppliers, setSuppliers] = useState([]);
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
  const [isEdit, setIsEdit] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    tenNCC: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    moTa: ''
  });

  // API endpoint — thử /NhaCungCap, nếu lỗi fallback sang /NCC
  const SUPPLIER_API = '/NhaCungCap';

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch })
      });
      const res = await API.get(`${SUPPLIER_API}?${params.toString()}`);
      
      setSuppliers(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải nhà cung cấp:', error);
      toast.error(
        <div>
          <p className="font-bold">Không thể tải danh sách nhà cung cấp!</p>
          <p className="text-xs mt-1">Vui lòng thêm API backend:</p>
          <code className="text-[10px] block bg-slate-800 text-slate-200 p-1 rounded mt-1">
            GET /api/NhaCungCap
          </code>
        </div>,
        { duration: 6000 }
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Get Supplier ID helper
  const getSupplierId = (supplier) => {
    return supplier.maNCC || supplier.maNhaCungCap || supplier.id;
  };

  // Open Modal
  const openModal = (supplier = null) => {
    if (supplier) {
      setIsEdit(true);
      setCurrentSupplier({
        ...supplier,
        tenNCC: supplier.tenNCC || supplier.ten || '',
        soDienThoai: supplier.soDienThoai || supplier.sdt || '',
      });
    } else {
      setIsEdit(false);
      setCurrentSupplier({ tenNCC: '', soDienThoai: '', email: '', diaChi: '', moTa: '' });
    }
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setIsEdit(false);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentSupplier.tenNCC.trim()) {
      toast.error('Vui lòng nhập tên nhà cung cấp!');
      return;
    }

    setSubmitLoading(true);
    const supplierId = getSupplierId(currentSupplier);

    try {
      if (isEdit) {
        await API.put(`${SUPPLIER_API}/${supplierId}`, currentSupplier);
        toast.success('Cập nhật nhà cung cấp thành công!');
      } else {
        await API.post(SUPPLIER_API, currentSupplier);
        toast.success('Thêm nhà cung cấp mới thành công!');
      }
      fetchSuppliers();
      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu nhà cung cấp:', error);
      toast.error('Lỗi khi lưu nhà cung cấp: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Supplier
  const handleDelete = async (supplier) => {
    const supplierId = getSupplierId(supplier);
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.tenNCC}" không?`)) {
      try {
        await API.delete(`${SUPPLIER_API}/${supplierId}`);
        toast.success('Xóa nhà cung cấp thành công!');
        fetchSuppliers();
      } catch (error) {
        console.error('Lỗi khi xóa nhà cung cấp:', error);
        toast.error('Không thể xóa nhà cung cấp này vì có sản phẩm liên quan!');
      }
    }
  };

  return (
    <AdminLayout requiredRole="Admin">
      <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Tìm tên, email, SĐT, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-outline-variant/30 rounded-full h-11 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
          </div>

          <button
            onClick={() => openModal()}
            className="w-full sm:w-auto px-5 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-[#1D4ED8] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <MdAdd className="w-5 h-5" />
            <span>Thêm nhà cung cấp</span>
          </button>
        </div>

        {/* Suppliers Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-16 text-on-secondary-container">
            <MdBusiness className="w-16 h-16 mx-auto mb-3 text-outline-variant" />
            <p className="font-semibold">Chưa có nhà cung cấp nào.</p>
            <p className="text-sm mt-1">Nhấn "Thêm nhà cung cấp" để thêm mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse rounded-2xl overflow-hidden border border-outline-variant/30">
              <thead>
                <tr className="bg-secondary text-white font-bold">
                  <th className="p-4 w-16">Mã</th>
                  <th className="p-4 min-w-[200px]">Tên nhà cung cấp</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Địa chỉ</th>
                  <th className="p-4 w-32 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, index) => (
                  <tr
                    key={getSupplierId(supplier)}
                    className={`border-b border-outline-variant/20 hover:bg-background/40 transition-colors ${index % 2 === 1 ? 'bg-background/20' : ''}`}
                  >
                    <td className="p-4 font-bold text-on-secondary-container">#{getSupplierId(supplier)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-container border border-primary/10 flex items-center justify-center shrink-0">
                          <MdBusiness className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-on-background">{supplier.tenNCC || supplier.ten}</span>
                      </div>
                    </td>
                    <td className="p-4 text-on-secondary-container font-semibold">{supplier.soDienThoai || supplier.sdt || '—'}</td>
                    <td className="p-4 text-on-secondary-container">{supplier.email || '—'}</td>
                    <td className="p-4 text-on-secondary-container line-clamp-1 max-w-[200px]">{supplier.diaChi || '—'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2.5">
                        <button
                          onClick={() => openModal(supplier)}
                          className="w-8 h-8 rounded-full bg-orange-50 text-tertiary border border-orange-100 hover:bg-orange-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier)}
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
                {isEdit ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
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
                  Tên nhà cung cấp
                </label>
                <input
                  type="text"
                  value={currentSupplier.tenNCC}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, tenNCC: e.target.value })}
                  placeholder="Ví dụ: Công ty TNHH Deli Việt Nam"
                  className="w-full bg-background border border-outline-variant/50 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={currentSupplier.soDienThoai}
                    onChange={(e) => setCurrentSupplier({ ...currentSupplier, soDienThoai: e.target.value })}
                    placeholder="0987654321"
                    className="w-full bg-background border border-outline-variant/50 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={currentSupplier.email}
                    onChange={(e) => setCurrentSupplier({ ...currentSupplier, email: e.target.value })}
                    placeholder="supplier@example.com"
                    className="w-full bg-background border border-outline-variant/50 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={currentSupplier.diaChi}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, diaChi: e.target.value })}
                  placeholder="Địa chỉ trụ sở hoặc kho hàng"
                  className="w-full bg-background border border-outline-variant/50 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-2 ml-1">
                  Mô tả / Ghi chú
                </label>
                <textarea
                  value={currentSupplier.moTa}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, moTa: e.target.value })}
                  placeholder="Mô tả sản phẩm cung cấp, điều khoản hợp tác..."
                  rows="3"
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
