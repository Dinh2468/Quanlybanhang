import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdViewModule, MdViewList, MdAddShoppingCart, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import API from '../../services/api';
import { addToCart } from '../../utils/cart';

/**
 * Component hiển thị danh sách sản phẩm dành cho Client (Khách hàng).
 * Hỗ trợ tìm kiếm, lọc theo danh mục, thương hiệu, khoảng giá và sắp xếp sản phẩm.
 */
export default function KhuyenMai() {
  // Lấy thông tin URL hiện tại để trích xuất query parameters (nếu có)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Từ khóa tìm kiếm từ ô tìm kiếm (ví dụ: ?search=but)
  const searchQuery = searchParams.get('search') || '';
  
  // Mã danh mục sản phẩm được truyền qua URL (ví dụ: ?loai=1)
  const loaiParam = searchParams.get('loai');

  // --- QUẢN LÝ STATES ---
  const [products, setProducts] = useState([]);             // Danh sách tất cả sản phẩm tải từ API
  const [categories, setCategories] = useState([]);         // Danh sách danh mục sản phẩm
  const [brands, setBrands] = useState([]);                 // Danh sách thương hiệu
  const [loading, setLoading] = useState(true);             // Trạng thái chờ tải dữ liệu từ API
  const [favIds, setFavIds] = useState([]);                 // Danh sách ID sản phẩm yêu thích

  // --- STATES PHỤC VỤ BỘ LỌC (FILTERS) ---
  const [currentPage, setCurrentPage] = useState(1);        // Trang hiện tại
  const [selectedBrands, setSelectedBrands] = useState([]); // Mảng lưu các mã thương hiệu được tick chọn
  const [selectedCategory, setSelectedCategory] = useState(loaiParam ? Number(loaiParam) : null); // Danh mục đang chọn
  const [minPrice, setMinPrice] = useState(1);              // Giá tối thiểu để lọc
  const [maxPrice, setMaxPrice] = useState(500000);         // Giá tối đa để lọc (giá trị chạy của slider)
  const [maxAllowedPrice, setMaxAllowedPrice] = useState(500000); // Giá cao nhất của sản phẩm trong hệ thống (dùng làm mốc giới hạn cho slider)
  const [selectedColors, setSelectedColors] = useState([]); // Màu sắc chọn lọc (tạm ẩn)
  const [viewMode, setViewMode] = useState('grid');         // Chế độ xem: 'grid' (lưới) hoặc 'list' (danh sách)
  const [sortBy, setSortBy] = useState('Nổi bật');          // Tiêu chí sắp xếp: 'Nổi bật', 'Giá thấp đến cao',...

  // Đồng bộ trạng thái danh mục được chọn khi tham số danh mục trên URL thay đổi (ví dụ khi nhấn danh mục ở Header)
  useEffect(() => {
    setSelectedCategory(loaiParam ? Number(loaiParam) : null);
  }, [loaiParam]);

  // --- LẤY DỮ LIỆU TỪ BACKEND API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Thực hiện gọi đồng thời 4 API để tăng tốc độ tải trang
        const token = localStorage.getItem('token');
        const fetchFavs = token ? API.get('/YeuThich/ids').catch(() => ({ data: [] })) : Promise.resolve({ data: [] });

        const [prodRes, catRes, brandRes, favRes] = await Promise.all([
          API.get('/SanPham?pageSize=1000').catch(() => ({ data: [] })),
          API.get('/LoaiSP').catch(() => ({ data: [] })),
          API.get('/ThuongHieu').catch(() => ({ data: [] })),
          fetchFavs
        ]);
        
        setProducts(prodRes.data.items || prodRes.data || []);
        setCategories(catRes.data || []);
        setBrands(brandRes.data || []);
        setFavIds(favRes.data || []);
        
        // Thiết lập giới hạn giá lớn nhất dựa trên sản phẩm thực tế có giá cao nhất
        const items = prodRes.data.items || prodRes.data || [];
        if (items.length > 0) {
          const prices = items.map(p => Number(p.gia || 0));
          const highestPrice = prices.length > 0 ? Math.max(...prices) : 500000;
          setMaxAllowedPrice(highestPrice);
          setMaxPrice(highestPrice);
          setMinPrice(1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý khi chọn/bỏ chọn checkbox của thương hiệu
  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId) // Đã chọn rồi thì bỏ ra khỏi danh sách chọn
        : [...prev, brandId]                // Chưa chọn thì thêm vào danh sách
    );
  };

  const handleToggleFav = async (e, product) => {
    e.preventDefault(); // Ngăn chặn sự kiện click lan truyền lên Link (chuyển trang)
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để lưu sản phẩm yêu thích!');
      return;
    }

    try {
      const res = await API.post(`/YeuThich/${product.maSP}`);
      if (res.data.isYeuThich) {
        setFavIds(prev => [...prev, product.maSP]);
        toast.success(res.data.message);
      } else {
        setFavIds(prev => prev.filter(id => id !== product.maSP));
        toast.success(res.data.message);
      }
      window.dispatchEvent(new Event('favUpdated'));
    } catch (error) {
      console.error('Lỗi toggle yêu thích:', error);
      toast.error('Có lỗi xảy ra!');
    }
  };

  // --- BỘ LỌC SẢN PHẨM TRÊN FRONTEND ---
  const filteredProducts = products.filter(product => {
    // 0. CHỈ LẤY SẢN PHẨM KHUYẾN MÃI
    if (!product.phanTramGiam || product.phanTramGiam <= 0) return false;

    // 1. Lọc theo từ khóa tìm kiếm (so khớp không phân biệt hoa thường)
    if (searchQuery && !product.tenSP.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // 2. Lọc theo thương hiệu (nếu có chọn thương hiệu thì sản phẩm phải thuộc thương hiệu đó)
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.maTH)) return false;
    
    // 3. Lọc theo danh mục (nếu có chọn danh mục cụ thể)
    if (selectedCategory && product.maLoaiSP !== selectedCategory) return false;
    
    // 4. Lọc theo khoảng giá tối thiểu và tối đa
    const min = minPrice === '' ? 0 : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    if (product.gia < min) return false;
    if (product.gia > max) return false;

    return true;
  });

  // --- SẮP XẾP SẢN PHẨM & TÍNH TOÁN ĐÁNH GIÁ ---
  const getSortedProducts = () => {
    // Chèn dữ liệu đánh giá (rating/reviewCount) thực tế từ API, sử dụng công thức giả lập dự phòng nếu trường trống
    const productsWithMockData = filteredProducts.map(p => {
      // Ưu tiên đọc rating từ API, nếu chưa có (undefined) thì tự sinh ngẫu nhiên từ mã sản phẩm
      const rating = p.rating !== undefined ? p.rating : (4.0 + ((p.maSP * 7) % 11) / 10);
      // Ưu tiên đọc số nhận xét từ API, nếu chưa có thì tự sinh ngẫu nhiên
      const reviewCount = p.reviewCount !== undefined ? p.reviewCount : ((p.maSP * 13) % 150 + 5);
      return { ...p, rating, reviewCount };
    });

    // Sắp xếp tăng dần theo giá
    if (sortBy === 'Giá thấp đến cao') {
      return productsWithMockData.sort((a, b) => (a.gia || 0) - (b.gia || 0));
    }
    // Sắp xếp giảm dần theo giá
    if (sortBy === 'Giá cao đến thấp') {
      return productsWithMockData.sort((a, b) => (b.gia || 0) - (a.gia || 0));
    }
    // Sắp xếp theo sản phẩm mới nhất (dựa trên Mã sản phẩm giảm dần)
    if (sortBy === 'Mới nhất') {
      return productsWithMockData.sort((a, b) => b.maSP - a.maSP);
    }
    // Tiêu chuẩn mặc định: 'Nổi bật' (Sắp xếp theo số sao cao nhất, rồi tới số lượt bình luận nhiều nhất)
    return productsWithMockData.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.reviewCount - a.reviewCount;
    });
  };

  // Danh sách sản phẩm sau lọc và sắp xếp hoàn chỉnh
  const sortedProducts = getSortedProducts();
  const itemsPerPage = 15;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset trang về 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrands, minPrice, maxPrice, sortBy]);
  
  // Tên của danh mục đang chọn để hiển thị trên Breadcrumb
  const activeCategoryName = categories.find(c => c.maLoai === selectedCategory)?.tenLoai;

  // Lọc màu sắc (tạm ẩn)
  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  return (
    <div className="bg-surface-bright selection:bg-primary-container selection:text-primary min-h-screen flex flex-col font-body-md">
      {/* Thanh Header đầu trang */}
      <Header />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8">
        
        {/* Đường dẫn Breadcrumb chỉ dẫn vị trí trang */}
        <div className="text-sm text-on-surface/60 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <MdKeyboardArrowRight className="w-4 h-4" />
          <span className="text-on-background font-semibold">Khuyến mãi</span>
        </div>

        {/* Tiêu đề trang và hiển thị số lượng sản phẩm lọc được */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display-lg font-bold text-red-600 mb-2">🔥 Ưu đãi siêu sốc</h1>
          <p className="text-on-surface/60 text-sm">({filteredProducts.length} sản phẩm đang giảm giá)</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* --- CỘT BÊN TRÁI: SIDEBAR CHỨA BỘ LỌC --- */}
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            
            {/* Hộp lọc theo Danh mục */}
            <div className="bg-[#f4f7fb] rounded-2xl p-5 border border-[#e5ecf5]">
              <h3 className="font-headline-md text-lg text-on-background mb-4">Danh mục</h3>
              <ul className="space-y-3">
                <li 
                  onClick={() => setSelectedCategory(null)}
                  className={`cursor-pointer transition-colors ${selectedCategory === null ? 'text-on-background font-bold' : 'text-on-surface/60 font-medium hover:text-on-background'}`}
                >
                  Tất cả sản phẩm
                </li>
                {categories.length > 0 ? categories.map(cat => (
                  <li key={cat.maLoai} 
                      onClick={() => setSelectedCategory(cat.maLoai)}
                      className={`cursor-pointer transition-colors ${selectedCategory === cat.maLoai ? 'text-on-background font-bold' : 'text-on-surface/60 font-medium hover:text-on-background'}`}
                  >
                    {cat.tenLoai}
                  </li>
                )) : (
                  <li className="text-on-surface/60 italic text-sm">Đang tải danh mục...</li>
                )}
              </ul>
            </div>

            {/* Hộp lọc theo Thương hiệu */}
            <div className="bg-[#f4f7fb] rounded-2xl p-5 border border-[#e5ecf5]">
              <h3 className="font-headline-md text-lg text-on-background mb-4">Thương hiệu</h3>
              <ul className="space-y-3">
                {brands.length > 0 ? brands.map(brand => (
                  <li key={brand.maTH} className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id={`brand-${brand.maTH}`}
                      name="brand"
                      checked={selectedBrands.includes(brand.maTH)}
                      onChange={() => handleBrandChange(brand.maTH)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary cursor-pointer accent-primary"
                    />
                    <label htmlFor={`brand-${brand.maTH}`} className="text-on-surface text-sm cursor-pointer flex-1">
                      {brand.tenTH}
                    </label>
                  </li>
                )) : (
                  // Dữ liệu dự phòng tĩnh nếu API gặp sự cố
                  <>
                    <li className="flex items-center gap-3">
                      <input type="checkbox" id="brand-deli" className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary cursor-pointer accent-primary" />
                      <label htmlFor="brand-deli" className="text-on-surface text-sm cursor-pointer">Deli</label>
                    </li>
                    <li className="flex items-center gap-3">
                      <input type="checkbox" id="brand-thienlong" className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary cursor-pointer accent-primary" />
                      <label htmlFor="brand-thienlong" className="text-on-surface text-sm cursor-pointer">Thiên Long</label>
                    </li>
                    <li className="flex items-center gap-3">
                      <input type="checkbox" id="brand-campus" className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary cursor-pointer accent-primary" />
                      <label htmlFor="brand-campus" className="text-on-surface text-sm cursor-pointer">Campus</label>
                    </li>
                    <li className="flex items-center gap-3">
                      <input type="checkbox" id="brand-klong" className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary cursor-pointer accent-primary" />
                      <label htmlFor="brand-klong" className="text-on-surface text-sm cursor-pointer">Klong</label>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Hộp lọc theo Khoảng giá */}
            <div className="bg-[#f4f7fb] rounded-2xl p-5 border border-[#e5ecf5]">
              <h3 className="font-headline-md text-lg text-on-background mb-4">Khoảng giá</h3>
              
              {/* CSS inline tùy chỉnh cho thanh kéo range-slider */}
              <style>{`
                .range-slider {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  background: transparent;
                  pointer-events: none;
                  appearance: none;
                  -webkit-appearance: none;
                  outline: none;
                }
                .range-slider::-webkit-slider-thumb {
                  pointer-events: auto;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  -webkit-appearance: none;
                  background: #2563EB;
                  border: 2px solid white;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                  cursor: pointer;
                  margin-top: -5px;
                }
                .range-slider::-moz-range-thumb {
                  pointer-events: auto;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #2563EB;
                  border: 2px solid white;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                  cursor: pointer;
                  border: none;
                }
                .range-slider::-webkit-slider-runnable-track {
                  width: 100%;
                  height: 100%;
                  background: transparent;
                  border: none;
                }
                .range-slider::-moz-range-track {
                  width: 100%;
                  height: 100%;
                  background: transparent;
                  border: none;
                }
              `}</style>
              
              {/* Vùng thanh kéo chọn khoảng giá kép (Min-Max) */}
              <div className="w-full h-1.5 bg-[#dbe4ee] rounded-full mb-6 relative">
                <div 
                  className="absolute h-full bg-[#2563EB] rounded-full pointer-events-none" 
                  style={{ 
                    left: `${((Number(minPrice) || 0) / maxAllowedPrice) * 100}%`, 
                    right: `${100 - ((Number(maxPrice) || maxAllowedPrice) / maxAllowedPrice) * 100}%` 
                  }}
                ></div>
                
                {/* Đầu kéo chọn Giá Min */}
                <input 
                  type="range" 
                  min="1" 
                  max={maxAllowedPrice} 
                  value={minPrice === '' ? 1 : minPrice} 
                  onChange={(e) => {
                    const value = Math.min(Number(e.target.value), Number(maxPrice === '' ? maxAllowedPrice : maxPrice) - 1);
                    setMinPrice(Math.max(1, value));
                  }}
                  className="range-slider"
                  style={{ zIndex: (Number(minPrice) > maxAllowedPrice - 100) ? '5' : '3' }}
                />
                {/* Đầu kéo chọn Giá Max */}
                <input 
                  type="range" 
                  min="1" 
                  max={maxAllowedPrice} 
                  value={maxPrice === '' ? maxAllowedPrice : maxPrice} 
                  onChange={(e) => {
                    const value = Math.max(Number(e.target.value), Number(minPrice === '' ? 1 : minPrice) + 1);
                    setMaxPrice(Math.min(maxAllowedPrice, value));
                  }}
                  className="range-slider"
                  style={{ zIndex: '4' }}
                />
              </div>

              {/* Hộp nhập số cụ thể cho khoảng giá */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[10px] text-on-surface/60 uppercase mb-1 block font-bold">Min</label>
                  <input 
                    type="number" 
                    min="1"
                    max={maxAllowedPrice}
                    placeholder="1"
                    value={minPrice} 
                    onChange={(e) => {
                      let val = e.target.value === '' ? '' : Number(e.target.value);
                      if (val !== '' && val < 1) val = 1;
                      setMinPrice(val);
                    }}
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-on-surface/60 uppercase mb-1 block font-bold">Max</label>
                  <input 
                    type="number" 
                    min="1"
                    max={maxAllowedPrice}
                    placeholder={String(maxAllowedPrice)}
                    value={maxPrice} 
                    onChange={(e) => {
                      let val = e.target.value === '' ? '' : Number(e.target.value);
                      if (val !== '' && val < 1) val = 1;
                      setMaxPrice(val);
                    }}
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>
            </div>

          </aside>

          {/* --- CỘT BÊN PHẢI: KHU VỰC HIỂN THỊ SẢN PHẨM --- */}
          <div className="flex-1 w-full">
            
            {/* Thanh tác vụ đầu danh sách: Chọn sắp xếp và Chuyển chế độ Grid/List */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface/60">Sắp xếp theo:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-outline-variant/30 rounded-full px-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px] cursor-pointer shadow-sm"
                >
                  <option value="Nổi bật">Nổi bật</option>
                  <option value="Giá thấp đến cao">Giá thấp đến cao</option>
                  <option value="Giá cao đến thấp">Giá cao đến thấp</option>
                  <option value="Mới nhất">Mới nhất</option>
                </select>
              </div>
              <div className="flex items-center bg-white border border-[#E5E7EB] rounded-full p-1 shadow-sm">
                <button 
                  className={`w-10 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'text-[#6B7280] hover:text-[#111827]'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <MdViewModule className="w-5 h-5" />
                </button>
                <button 
                  className={`w-10 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#2563EB] text-white' : 'text-[#6B7280] hover:text-[#111827]'}`}
                  onClick={() => setViewMode('list')}
                >
                  <MdViewList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Danh sách hiển thị sản phẩm chính */}
            {loading ? (
              // Vòng quay Loading khi chưa tải xong dữ liệu từ API
              <div className="flex justify-center items-center py-20">
                 <span className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></span>
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                {/* Lưới sản phẩm: đổi kiểu sắp xếp tùy thuộc viewMode (Grid 3 cột hoặc List dọc) */}
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                  {displayedProducts.map((product) => (
                    <div key={product.maSP} className={viewMode === 'list' ? 'w-full md:w-1/2 lg:w-1/3' : 'w-full'}>
                      <ProductCard 
                        product={product} 
                        isFavorite={favIds.includes(product.maSP)} 
                        onToggleFav={handleToggleFav} 
                      />
                    </div>
                  ))}
                </div>

                {/* Thanh phân trang danh sách sản phẩm (Pagination) */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface/40 hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      <MdKeyboardArrowLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === i + 1 ? 'bg-[#2563EB] text-white shadow-md' : 'border border-outline-variant/30 text-on-surface hover:bg-surface-container transition-colors'} font-bold text-sm cursor-pointer`}>
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface/40 hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      <MdKeyboardArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Trạng thái rỗng khi không có sản phẩm nào khớp bộ lọc
              <div className="text-center py-20 text-on-surface/60">
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Thanh Footer chân trang */}
      <Footer />
    </div>
  );
}
