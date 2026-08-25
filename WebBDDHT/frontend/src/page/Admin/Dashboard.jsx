import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdAttachMoney, 
  MdShoppingCart, 
  MdInventory, 
  MdPeople, 
  MdTrendingUp 
} from 'react-icons/md';
import API from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0,
    customersCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const roleLower = (user.vaiTro || user.role || 'Nhân viên').toLowerCase();
  const isAdmin = roleLower.includes('admin') || roleLower.includes('quản trị');

  // Load tổng quan và danh mục 1 lần khi mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tongQuanRes, danhMucRes] = await Promise.all([
          API.get('/ThongKe/tongquan').catch(() => ({ data: {} })),
          API.get('/ThongKe/danhmuc').catch(() => ({ data: [] }))
        ]);

        const tq = tongQuanRes.data;
        if (tq) {
          setStats({
            revenue: tq.revenue || 0,
            ordersCount: tq.ordersCount || 0,
            productsCount: tq.productsCount || 0,
            customersCount: tq.customersCount || 0
          });
          setRecentOrders(tq.recentOrders || []);
        }

        setCategoryData(danhMucRes.data || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Load biểu đồ mỗi khi đổi timeRange
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await API.get(`/ThongKe/doanhthu?range=${timeRange}`);
        const data = res.data || [];
        const maxVal = Math.max(...data.map(d => d.value), 0);
        
        const formattedData = data.map(d => ({
          label: d.label,
          value: d.value,
          height: `${maxVal > 0 ? (d.value / maxVal) * 80 + 10 : 10}%`
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error("Lỗi tải biểu đồ:", error);
      }
    };
    fetchChartData();
  }, [timeRange]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(dateString));
  };

  const getStatusColorClass = (status) => {
    if (!status) return 'text-[#2563EB] bg-[#EFF6FF]';
    const s = status.toLowerCase();
    if (s.includes('chờ') || s.includes('đang xử lý')) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (s.includes('hủy')) return 'text-red-700 bg-red-50 border-red-200';
    if (s.includes('thành công') || s.includes('đã giao')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  // Tạo chuỗi conic-gradient cho Doughnut chart
  let cumulativePercentage = 0;
  const conicParts = categoryData.map(item => {
    const start = cumulativePercentage;
    cumulativePercentage += item.percentage;
    return `${item.color} ${start}% ${cumulativePercentage}%`;
  });
  const conicGradientString = conicParts.length > 0 ? conicParts.join(', ') : '#e2e8f0 0% 100%';

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in pb-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-on-background tracking-tight">Tổng Quan</h1>
              <p className="text-on-secondary-container mt-1 font-medium">Phân tích hiệu suất kinh doanh trực tuyến.</p>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
            {isAdmin && (
              <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary flex items-center justify-center">
                    <MdAttachMoney className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-secondary-container uppercase tracking-wider">Tổng doanh thu</p>
                    <p className="text-2xl font-black text-on-background mt-1">{formatPrice(stats.revenue)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MdShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-secondary-container uppercase tracking-wider">Đơn hàng</p>
                  <p className="text-2xl font-black text-on-background mt-1">{stats.ordersCount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MdInventory className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-secondary-container uppercase tracking-wider">Sản phẩm</p>
                  <p className="text-2xl font-black text-on-background mt-1">{stats.productsCount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MdPeople className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-secondary-container uppercase tracking-wider">Khách hàng</p>
                  <p className="text-2xl font-black text-on-background mt-1">{stats.customersCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between px-6 border-b border-outline-variant/30 h-16">
                <div>
                  <h3 className="font-bold text-lg text-on-background">Xu hướng doanh thu</h3>
                  <p className="text-xs text-on-secondary-container mt-0.5 font-bold text-primary">
                    Tổng cộng: {formatPrice(chartData.reduce((sum, item) => sum + item.value, 0))}
                  </p>
                </div>
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)} 
                  className="bg-background border border-outline-variant/30 rounded-full h-9 px-4 text-xs font-semibold focus:outline-none cursor-pointer">
                  <option value="7days">7 ngày qua</option>
                  <option value="1month">Tháng này</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col justify-end mt-4">
                <div className="flex items-end justify-between h-44 px-4 gap-2">
                  {chartData.map((day, idx) => (
                    <div key={idx} className="h-full flex-1 flex flex-col justify-end items-center group relative">
                      <span className="absolute -top-10 scale-0 transition-all rounded bg-slate-800 p-2 text-xs text-white group-hover:scale-100 z-10 whitespace-nowrap font-semibold shadow-md">
                        {formatPrice(day.value)}
                      </span>
                      <div 
                        className="w-full bg-[#E0F2FE] hover:bg-sky-500 rounded-t-2xl transition-all duration-500 cursor-pointer"
                        style={{ height: day.height }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="border-b border-outline-variant/20 mx-4 my-2"></div>
                <div className="flex justify-between px-4 pb-2">
                  {chartData.map((day, idx) => (
                    <span key={idx} className="text-[9px] md:text-xs font-bold text-on-secondary-container flex-1 text-center truncate">{day.label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-on-background">Danh mục bán chạy</h3>
                <p className="text-xs text-on-secondary-container mt-0.5">Phân bổ doanh số</p>
              </div>

              <div className="my-6 flex items-center justify-center">
                <div 
                  className="w-36 h-36 rounded-full flex items-center justify-center relative shadow-sm"
                  style={{ background: `conic-gradient(${conicGradientString})` }}
                >
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="text-lg font-black text-on-background">100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-2 max-h-36 overflow-y-auto pr-1 no-scrollbar">
                {categoryData.length === 0 ? (
                  <p className="text-center text-xs text-slate-500">Chưa có dữ liệu</p>
                ) : (
                  categoryData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="font-medium text-on-secondary-container truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="font-bold text-on-background">{item.percentage}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
          
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-on-background">Đơn hàng mới nhận</h3>
                <Link to="/admin/donhang" className="text-sm font-bold text-primary hover:underline">Xem tất cả</Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12 text-on-secondary-container">Chưa có đơn hàng nào.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/30 text-on-secondary-container font-bold">
                        <th className="pb-3">MÃ ĐH</th>
                        <th className="pb-3">Khách hàng</th>
                        <th className="pb-3">Ngày đặt</th>
                        <th className="pb-3">Tổng tiền</th>
                        <th className="pb-3 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.maDH} className="border-b border-outline-variant/20 hover:bg-background/40 transition-colors">
                          <td className="py-4 font-bold text-primary">#DH-{order.maDH}</td>
                          <td className="py-4 font-medium">{order.hoTenNguoiNhan || 'Khách hàng'}</td>
                          <td className="py-4 text-on-secondary-container">{formatDate(order.ngayDat)}</td>
                          <td className="py-4 font-bold">{formatPrice(order.tongTien)}</td>
                          <td className="py-4 text-right">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColorClass(order.trangThai)}`}>
                              {order.trangThai || 'Chờ xử lý'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
