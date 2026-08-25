import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdClose, MdMilitaryTech } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

export default function QLHangThanhVien() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentRank, setCurrentRank] = useState({
    tenHang: '',
    diemToiThieu: 0,
    phanTramUuDai: 0
  });

  // Fetch all membership ranks
  const fetchRanks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/HangKhachHang');
      setRanks(res.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách hạng:', error);
      toast.error('Không thể tải danh sách hạng thành viên!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, []);

  // Open Modal
  const openModal = (rank = null) => {
    if (rank) {
      setIsEdit(true);
      setCurrentRank({ ...rank });
    } else {
      setIsEdit(false);
      setCurrentRank({
        tenHang: '',
        diemToiThieu: 0,
        phanTramUuDai: 0
      });
    }
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setIsEdit(false);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentRank.tenHang.trim()) {
      toast.error('Vui lòng nhập tên hạng!');
      return;
    }
    if (currentRank.diemToiThieu < 0) {
      toast.error('Điểm tối thiểu không được âm!');
      return;
    }
    if (currentRank.phanTramUuDai < 0 || currentRank.phanTramUuDai > 100) {
      toast.error('Phần trăm ưu đãi phải từ 0% đến 100%!');
      return;
    }

    setSubmitLoading(true);
    try {
      if (isEdit) {
        // Cập nhật hạng thành viên
        await API.put(`/HangKhachHang/${currentRank.maHang}`, {
          tenHang: currentRank.tenHang,
          diemToiThieu: Number(currentRank.diemToiThieu),
          phanTramUuDai: Number(currentRank.phanTramUuDai)
        });
        toast.success('Cập nhật hạng thành viên thành công!');
      } else {
        // Thêm mới hạng thành viên
        await API.post('/HangKhachHang', {
          tenHang: currentRank.tenHang,
          diemToiThieu: Number(currentRank.diemToiThieu),
          phanTramUuDai: Number(currentRank.phanTramUuDai)
        });
        toast.success('Thêm mới hạng thành viên thành công!');
      }
      fetchRanks();
      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu hạng thành viên:', error);
      toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Rank
  const handleDelete = async (maHang) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hạng thành viên này không?')) {
      try {
        await API.delete(`/HangKhachHang/${maHang}`);
        toast.success('Xóa hạng thành viên thành công!');
        fetchRanks();
      } catch (error) {
        console.error('Lỗi khi xóa hạng thành viên:', error);
        toast.error('Không thể xóa: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Hàm hiển thị badge màu sắc đặc biệt theo yêu cầu của user
  const getRankBadgeClass = (rankName) => {
    const r = (rankName || '').toLowerCase();
    if (r.includes('đồng') || r.includes('dong')) {
      return 'bg-[#B87333]/15 text-[#8B4513] border-[#B87333]/30';
    }
    if (r.includes('bạc') || r.includes('bac')) {
      return 'bg-[#C0C0C0]/20 text-[#6B7280] border-[#C0C0C0]/40';
    }
    if (r.includes('vàng') || r.includes('vang')) {
      return 'bg-[#FFD700]/20 text-[#B45309] border-[#FFD700]/40';
    }
    if (r.includes('kim cương') || r.includes('kim cuong')) {
      return 'bg-[#0ea5e9]/10 text-[#0284c7] border-[#0ea5e9]/20';
    }
    return 'bg-primary-container text-primary border-primary/10';
  };

  return (
    <AdminLayout requiredRole="Admin">
      <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 bg-primary-container/20 border border-primary/10 rounded-2xl p-4 flex-1">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
              <MdMilitaryTech className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-on-background">Tổng số hạng thành viên</h3>
              <p className="text-2xl font-extrabold text-primary">{ranks.length} hạng cấu hình</p>
            </div>
          </div>
          
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover px-5 h-12 rounded-full text-sm font-bold shadow-md shadow-primary/10 transition-all cursor-pointer select-none grow-0 shrink-0"
          >
            <MdAdd className="w-5 h-5" />
            Thêm hạng mới
          </button>
        </div>

        {/* Ranks Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : ranks.length === 0 ? (
          <div className="text-center py-16 text-on-secondary-container">
            <MdMilitaryTech className="w-16 h-16 mx-auto mb-3 text-outline-variant" />
            <p className="font-semibold">Chưa có hạng thành viên nào được định nghĩa.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse rounded-2xl overflow-hidden border border-outline-variant/30">
              <thead>
                <tr className="bg-secondary text-white font-bold">
                  <th className="p-4 w-20 text-center">Mã hạng</th>
                  <th className="p-4">Tên hạng</th>
                  <th className="p-4 text-center">Điểm tối thiểu</th>
                  <th className="p-4 text-center">Phần trăm ưu đãi</th>
                  <th className="p-4 w-32 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((rank, index) => (
                  <tr
                    key={rank.maHang || index}
                    className={`border-b border-outline-variant/20 hover:bg-background/40 transition-colors ${index % 2 === 1 ? 'bg-background/20' : ''}`}
                  >
                    <td className="p-4 text-center text-on-secondary-container font-semibold">{rank.maHang}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${getRankBadgeClass(rank.tenHang)}`}>
                        {rank.tenHang}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-on-background">{rank.diemToiThieu.toLocaleString()} đ</td>
                    <td className="p-4 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-bold">
                        Giảm {rank.phanTramUuDai}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(rank)}
                          className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rank.maHang)}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Xóa hạng"
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
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-outline-variant/30 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-background">
              <h3 className="font-bold text-lg text-on-background">
                {isEdit ? 'Cập nhật hạng thành viên' : 'Thêm hạng thành viên mới'}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-on-secondary-container hover:bg-outline-variant/30 transition-colors cursor-pointer"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                
                {/* Ten Hang */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Tên hạng thành viên</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đồng, Bạc, Vàng, Kim Cương..."
                    value={currentRank.tenHang}
                    onChange={(e) => setCurrentRank({ ...currentRank, tenHang: e.target.value })}
                    className="w-full bg-background border border-outline-variant/30 rounded-xl h-11 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                  />
                </div>

                {/* Diem Toi Thieu */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Mốc điểm tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="Mốc điểm chi tiêu tối thiểu"
                    value={currentRank.diemToiThieu}
                    onChange={(e) => setCurrentRank({ ...currentRank, diemToiThieu: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background border border-outline-variant/30 rounded-xl h-11 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                  />
                  <p className="text-[10px] text-on-secondary-container">Tổng mức tiền tích lũy từ các đơn hàng hoàn thành để đạt hạng này.</p>
                </div>

                {/* Phan Tram Uu Dai */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-background uppercase tracking-wider block">Tỷ lệ ưu đãi giảm giá (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="Ví dụ: 5, 10, 15..."
                    value={currentRank.phanTramUuDai}
                    onChange={(e) => setCurrentRank({ ...currentRank, phanTramUuDai: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background border border-outline-variant/30 rounded-xl h-11 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-on-background"
                  />
                  <p className="text-[10px] text-on-secondary-container">Giảm trừ phần trăm trực tiếp trên hóa đơn cho khách hàng thuộc hạng này.</p>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-background border-t border-outline-variant/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 bg-white border border-outline-variant/30 text-on-background hover:bg-slate-50 text-sm font-bold rounded-full transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-primary text-white hover:bg-primary-hover disabled:bg-primary/50 text-sm font-bold rounded-full shadow-md shadow-primary/10 transition-all cursor-pointer flex items-center justify-center min-w-[90px]"
                >
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    'Lưu lại'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}