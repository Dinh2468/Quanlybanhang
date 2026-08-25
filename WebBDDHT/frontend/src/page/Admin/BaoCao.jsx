import React, { useState, useEffect, useCallback } from 'react';
import API from '../../services/api';
import * as XLSX from 'xlsx';
import AdminLayout from '../../components/AdminLayout';
import { MdGetApp, MdCalendarToday, MdInventory, MdTrendingUp, MdTrendingDown, MdAttachMoney, MdShoppingCart } from 'react-icons/md';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('vi', vi);

export default function BaoCao() {
  const [topProducts, setTopProducts] = useState([]);
  const [bottomProducts, setBottomProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState('by_month');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date());

  const getImageUrl = (hinhAnh) => {
    if (!hinhAnh) return null;
    const url = hinhAnh.split(',')[0].trim();
    return url.startsWith('http') ? url : `https://localhost:7224${url}`;
  };

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);

      if (timeFilter === 'custom' && (!startDate || !endDate)) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({ range: timeFilter });

      const formatYMD = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      if (timeFilter === 'custom') {
        params.append('startDate', formatYMD(startDate));
        params.append('endDate', formatYMD(endDate));
      } else if (timeFilter === 'by_month' && selectedMonth) {
        params.append('month', selectedMonth.getMonth() + 1);
        params.append('year', selectedMonth.getFullYear());
      } else if (timeFilter === 'by_year' && selectedYear) {
        params.append('year', selectedYear.getFullYear());
      }

      const queryString = params.toString();

      const [resDoanhThu, resTop, resBottom, resLow] = await Promise.all([
        API.get(`/ThongKe/doanhthu?${queryString}`),
        API.get(`/ThongKe/banchay?${queryString}`),
        API.get(`/ThongKe/bancham`), // bancham doesn't use date filter based on current API
        API.get('/ThongKe/saphet')
      ]);

      setRevenueData(resDoanhThu.data);
      setTopProducts(resTop.data);
      setBottomProducts(resBottom.data);
      setLowStock(resLow.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu báo cáo:', error);
    } finally {
      setLoading(false);
    }
  }, [timeFilter, startDate, endDate, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const exportToExcel = () => {
    const topProductsData = topProducts.map((item, index) => ({
      'STT': index + 1,
      'Mã SP': item.maSP,
      'Tên Sản Phẩm': item.tenSP,
      'Giá': item.gia,
      'Số Lượng Tồn': item.soLuongTon,
      'Số Lượng Đã Bán': item.soLuongBan
    }));
    const wsTop = XLSX.utils.json_to_sheet(topProductsData);

    const lowStockData = lowStock.map((item, index) => ({
      'STT': index + 1,
      'Mã SP': item.maSP,
      'Tên Sản Phẩm': item.tenSP,
      'Giá': item.gia,
      'Loại': item.tenLoai,
      'Số Lượng Tồn': item.soLuongTon
    }));
    const wsLow = XLSX.utils.json_to_sheet(lowStockData);

    const revenueExportData = revenueData.map((item, index) => ({
      'STT': index + 1,
      'Thời gian': item.label,
      'Doanh thu': item.value
    }));
    const wsRevenue = XLSX.utils.json_to_sheet(revenueExportData);

    const bottomProductsData = bottomProducts.map((item, index) => ({
      'STT': index + 1,
      'Mã SP': item.maSP,
      'Tên Sản Phẩm': item.tenSP,
      'Giá': item.gia,
      'Số Lượng Tồn': item.soLuongTon,
      'Số Lượng Đã Bán': item.soLuongBan
    }));
    const wsBottom = XLSX.utils.json_to_sheet(bottomProductsData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsRevenue, "Doanh Thu");
    XLSX.utils.book_append_sheet(wb, wsTop, "Top 5 Bán Chạy");
    XLSX.utils.book_append_sheet(wb, wsBottom, "Top 5 Bán Chậm");
    XLSX.utils.book_append_sheet(wb, wsLow, "Sắp Hết Hàng");

    XLSX.writeFile(wb, "BaoCao_ThongKe.xlsx");
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN') + ' đ';
  };

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
      className="flex items-center gap-2 bg-surface border border-outline-variant text-on-background rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:border-primary transition-colors h-[38px]"
      onClick={onClick}
      ref={ref}
    >
      <MdCalendarToday className="text-on-secondary-container w-4 h-4" />
      <span className={value ? "font-semibold" : "text-on-secondary-container"}>{value || placeholder}</span>
    </div>
  ));

  const totalDoanhThu = revenueData.reduce((sum, item) => sum + (item.doanhThu || 0), 0);
  const totalVon = revenueData.reduce((sum, item) => sum + (item.von || 0), 0);
  const totalLoiNhuan = revenueData.reduce((sum, item) => sum + (item.loiNhuan || 0), 0);
  const totalDonHang = revenueData.reduce((sum, item) => sum + (item.soDonHang || 0), 0);

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="space-y-6">

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-on-background w-full sm:w-auto">Báo Cáo Thống Kê</h1>
          <button
            onClick={exportToExcel}
            className="w-full sm:w-auto px-5 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-[#1D4ED8] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <MdGetApp className="w-5 h-5" />
            <span>Xuất Báo Cáo Excel</span>
          </button>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-background rounded-2xl p-4 border border-outline-variant flex flex-row flex-wrap items-center gap-3 relative z-10">
          <span className="font-bold text-on-background shrink-0">Thời gian:</span>
          <div className="flex items-center bg-surface border border-outline-variant rounded-lg p-1 gap-1 shrink-0">
            {[
              { value: 'by_month', label: 'Theo tháng' },
              { value: 'by_year', label: 'Theo năm' },
              { value: 'custom', label: 'Tùy chỉnh' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setTimeFilter(tab.value)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  timeFilter === tab.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-secondary-container hover:bg-background/80 hover:text-on-background'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date picker — nằm cùng hàng */}
          <div className="flex items-center gap-2">
            {timeFilter === 'by_month' && (
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                locale="vi"
                customInput={<CustomInput placeholder="Chọn tháng" />}
              />
            )}
            {timeFilter === 'by_year' && (
              <DatePicker
                selected={selectedYear}
                onChange={(date) => setSelectedYear(date)}
                showYearPicker
                dateFormat="yyyy"
                locale="vi"
                customInput={<CustomInput placeholder="Chọn năm" />}
              />
            )}
            {timeFilter === 'custom' && (
              <>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  locale="vi"
                  customInput={<CustomInput placeholder="Từ ngày" />}
                />
                <span className="text-on-secondary-container font-bold">-</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  locale="vi"
                  customInput={<CustomInput placeholder="Đến ngày" />}
                />
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background rounded-2xl p-6 border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <MdTrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-secondary-container">Tổng Doanh Thu</p>
                  <p className="text-xl font-black text-on-background">{formatCurrency(totalDoanhThu)}</p>
                </div>
              </div>

              <div className="bg-background rounded-2xl p-6 border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <MdTrendingDown className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-secondary-container">Tổng Vốn</p>
                  <p className="text-xl font-black text-on-background">{formatCurrency(totalVon)}</p>
                </div>
              </div>

              <div className="bg-background rounded-2xl p-6 border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <MdAttachMoney className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-secondary-container">Lợi Nhuận</p>
                  <p className="text-xl font-black text-emerald-600">{formatCurrency(totalLoiNhuan)}</p>
                </div>
              </div>

              <div className="bg-background rounded-2xl p-6 border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <MdShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-secondary-container">Đơn Hàng (Đã Bán)</p>
                  <p className="text-xl font-black text-on-background">{totalDonHang.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Biểu đồ Doanh Thu */}
            <div className="bg-background rounded-2xl p-6 border border-outline-variant">
              <h2 className="text-lg font-bold text-on-background mb-4">Biểu Đồ Doanh Thu</h2>
              <div style={{ width: '100%', height: 320 }}>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickMargin={10}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis
                        tickFormatter={(value) => {
                          if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                          if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
                          return value;
                        }}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        width={60}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === 'doanhThu') return [formatCurrency(value), 'Doanh thu'];
                          if (name === 'von') return [formatCurrency(value), 'Vốn'];
                          if (name === 'loiNhuan') return [formatCurrency(value), 'Lợi nhuận'];
                          return [formatCurrency(value), name];
                        }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend 
                        formatter={(value) => {
                          if (value === 'doanhThu') return 'Doanh thu';
                          if (value === 'von') return 'Vốn';
                          if (value === 'loiNhuan') return 'Lợi nhuận';
                          return value;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="doanhThu"
                        name="doanhThu"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="von"
                        name="von"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="loiNhuan"
                        name="loiNhuan"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-on-secondary-container bg-surface/50 rounded-xl text-sm">
                    {timeFilter === 'custom' && (!startDate || !endDate)
                      ? 'Vui lòng chọn ngày bắt đầu và kết thúc'
                      : 'Không có dữ liệu doanh thu cho khoảng thời gian này'}
                  </div>
                )}
              </div>
            </div>

            {/* ===== TOP 5 & CẢNH BÁO TỒN KHO ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* --- Top 5 sản phẩm bán chạy --- */}
              <div className="bg-background rounded-2xl p-6 border border-outline-variant">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-on-background">Top 5 Sản Phẩm Bán Chạy Nhất</h2>
                </div>

                {/* Header cột */}
                <div className="flex items-center pb-2 border-b border-outline-variant/20 mb-1">
                  <span className="flex-1 text-xs font-bold text-on-secondary-container uppercase tracking-wider">Sản phẩm</span>
                  <span className="w-14 text-xs font-bold text-on-secondary-container uppercase tracking-wider text-right shrink-0">Đã bán</span>
                  <span className="w-32 text-xs font-bold text-on-secondary-container uppercase tracking-wider text-right shrink-0">Doanh thu</span>
                </div>

                {topProducts.length === 0 ? (
                  <div className="text-center py-10 text-on-secondary-container text-sm">Không có dữ liệu cho khoảng thời gian này.</div>
                ) : (
                  <div className="divide-y divide-outline-variant/15">
                    {topProducts.map((item, idx) => (
                      <div key={item.maSP} className="flex items-center gap-2 py-3 hover:bg-surface/60 rounded-xl transition-colors px-1">
                        {/* Cột 1: Thông tin sản phẩm */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                            idx === 0 ? 'bg-amber-100 text-amber-600' :
                            idx === 1 ? 'bg-slate-100 text-slate-500' :
                            idx === 2 ? 'bg-orange-100 text-orange-500' :
                            'bg-surface text-on-secondary-container'
                          }`}>{idx + 1}</span>
                          <div className="relative w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/20">
                            <MdInventory className="w-5 h-5 text-primary" />
                            {item.hinhAnh && (
                              <img
                                src={getImageUrl(item.hinhAnh)}
                                alt={item.tenSP}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-on-background truncate">{item.tenSP}</p>
                            <p className="text-xs text-on-secondary-container">
                              {item.gia ? item.gia.toLocaleString('vi-VN') + ' đ' : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {/* Cột 2: Đã bán */}
                        <span className="w-14 text-sm font-black text-on-background text-right shrink-0">
                          {item.soLuongBan?.toLocaleString()}
                        </span>
                        {/* Cột 3: Doanh thu */}
                        <span className="w-32 text-sm font-bold text-primary text-right shrink-0 whitespace-nowrap">
                          {((item.gia || 0) * (item.soLuongBan || 0)).toLocaleString('vi-VN') + ' đ'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* --- Top 5 sản phẩm bán chậm nhất --- */}
              <div className="bg-background rounded-2xl p-6 border border-outline-variant">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-on-background">Top 5 Sản Phẩm Bán Chậm Nhất</h2>
                </div>

                {/* Header cột */}
                <div className="flex items-center pb-2 border-b border-outline-variant/20 mb-1">
                  <span className="flex-1 text-xs font-bold text-on-secondary-container uppercase tracking-wider">Sản phẩm</span>
                  <span className="w-14 text-xs font-bold text-on-secondary-container uppercase tracking-wider text-right shrink-0">Đã bán</span>
                  <span className="w-32 text-xs font-bold text-on-secondary-container uppercase tracking-wider text-right shrink-0">Doanh thu</span>
                </div>

                {bottomProducts.length === 0 ? (
                  <div className="text-center py-10 text-on-secondary-container text-sm">Không có dữ liệu cho khoảng thời gian này.</div>
                ) : (
                  <div className="divide-y divide-outline-variant/15">
                    {bottomProducts.map((item, idx) => (
                      <div key={item.maSP} className="flex items-center gap-2 py-3 hover:bg-surface/60 rounded-xl transition-colors px-1">
                        {/* Cột 1: Thông tin sản phẩm */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 bg-surface text-on-secondary-container`}>{idx + 1}</span>
                          <div className="relative w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/20">
                            <MdInventory className="w-5 h-5 text-primary" />
                            {item.hinhAnh && (
                              <img
                                src={getImageUrl(item.hinhAnh)}
                                alt={item.tenSP}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-on-background truncate">{item.tenSP}</p>
                            <p className="text-xs text-on-secondary-container">
                              {item.gia ? item.gia.toLocaleString('vi-VN') + ' đ' : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {/* Cột 2: Đã bán */}
                        <span className="w-14 text-sm font-black text-on-background text-right shrink-0">
                          {item.soLuongBan?.toLocaleString()}
                        </span>
                        {/* Cột 3: Doanh thu */}
                        <span className="w-32 text-sm font-bold text-primary text-right shrink-0 whitespace-nowrap">
                          {((item.gia || 0) * (item.soLuongBan || 0)).toLocaleString('vi-VN') + ' đ'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* --- Cảnh báo tồn kho --- */}
            <div className="bg-background rounded-2xl p-6 border border-outline-variant">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-on-background">Cảnh Báo Tồn Kho (Dưới 10)</h2>
                {lowStock.length > 0 && (
                  <span className="text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
                    {lowStock.length} cảnh báo
                  </span>
                )}
              </div>

              {lowStock.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                    <MdInventory className="w-7 h-7 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">Tồn kho ổn định</p>
                  <p className="text-xs text-on-secondary-container">Không có sản phẩm nào sắp hết hàng.</p>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/15">
                  {lowStock.map((item) => (
                    <div key={item.maSP} className="flex items-center gap-3 py-3 px-1 hover:bg-surface/60 rounded-xl transition-colors">
                      <div className="relative w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/20">
                        <MdInventory className="w-5 h-5 text-red-400" />
                        {item.hinhAnh && (
                          <img
                            src={getImageUrl(item.hinhAnh)}
                            alt={item.tenSP}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-background truncate">{item.tenSP}</p>
                        <p className="text-xs text-on-secondary-container">{item.tenLoai}</p>
                        {item.soLuongTon === 0 && (
                          <p className="text-xs font-bold text-red-500 mt-0.5">Cần nhập hàng ngay lập tức</p>
                        )}
                      </div>
                      <div className={`shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl border ${
                        item.soLuongTon === 0
                          ? 'bg-red-50 border-red-200'
                          : item.soLuongTon <= 3
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}>
                        <span className={`text-lg font-black leading-tight ${
                          item.soLuongTon === 0 ? 'text-red-600' :
                          item.soLuongTon <= 3 ? 'text-orange-600' : 'text-amber-600'
                        }`}>{item.soLuongTon}</span>
                        <span className={`text-[10px] font-bold uppercase ${
                          item.soLuongTon === 0 ? 'text-red-400' :
                          item.soLuongTon <= 3 ? 'text-orange-400' : 'text-amber-400'
                        }`}>Sản phẩm</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  );
}
