import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdLocalShipping, MdVerified, MdSupportAgent, MdArrowForward, MdAddShoppingCart, MdFavorite, MdFavoriteBorder, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdLocalOffer } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import API from '../../services/api';
import { addToCart } from '../../utils/cart';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState([]);
  
  const scrollRef = React.useRef(null);
  const trendingScrollRef = React.useRef(null);
  const promoScrollRef = React.useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollTrendingLeft = () => {
    if (trendingScrollRef.current) trendingScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollTrendingRight = () => {
    if (trendingScrollRef.current) trendingScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollPromoLeft = () => {
    if (promoScrollRef.current) promoScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollPromoRight = () => {
    if (promoScrollRef.current) promoScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const discountProducts = products.filter(p => p.phanTramGiam > 0).slice(0, 8);

  // Lấy dữ liệu sản phẩm và danh mục từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const fetchFavs = token ? API.get('/YeuThich/ids').catch(() => ({ data: [] })) : Promise.resolve({ data: [] });

        const [prodRes, catRes, favRes] = await Promise.all([
          API.get('/SanPham').catch(() => ({ data: [] })),
          API.get('/LoaiSP').catch(() => ({ data: [] })),
          fetchFavs
        ]);
        setProducts(prodRes.data.items || prodRes.data || []);
        setCategories(catRes.data || []);
        setFavIds(favRes.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  return (
    <div className="bg-surface-bright selection:bg-primary-container selection:text-primary min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="py-6 px-4">
          <div className="max-w-[1280px] mx-auto hero-gradient rounded-[40px] relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[500px]">
              
              {/* Text content */}
              <div className="px-8 md:px-16 py-12 md:py-20 z-10 flex flex-col justify-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white text-gray-700 font-label-md text-xs font-bold mb-8 shadow-sm tracking-wider w-max uppercase">
                  Ưu đãi có hạn
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display-lg text-white mb-2 font-bold leading-[1.1]">
                  Đại Tiệc Sale
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display-lg text-white mb-6 font-bold leading-[1.1]">
                  Tựu Trường!
                </h1>
                <p className="text-body-md text-[#DBEAFE] mb-8 text-base max-w-[400px] leading-relaxed">
                  Sẵn sàng cho một năm học rực rỡ nhất với ưu đãi 30% toàn bộ đồ dùng học tập. Từ sổ tay pastel đến bút công thái học.
                </p>
                <button className="h-12 px-8 rounded-full bg-[#F97316] text-white font-bold text-sm hover:bg-[#EA580C] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer w-max">
                  Mua Ngay 
                  <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Image content */}
              <div className="relative h-full flex items-center justify-end pr-0 md:pr-12 lg:pr-16 py-12 z-10">
                {/* Accent circle decorative */}
                <div className="absolute top-8 left-4 md:left-12 w-12 h-12 bg-[#F97316]/20 rounded-full z-0"></div>
                
                <img 
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800" 
                  alt="Đại Tiệc Sale Tựu Trường" 
                  className="relative z-10 w-full max-w-[450px] lg:max-w-[500px] h-[350px] md:h-[450px] object-cover rounded-[32px] shadow-2xl ml-auto"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-20 px-4 bg-surface-bright border-b border-outline-variant/10">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight">Khám phá danh mục</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">Tìm người bạn đồng hành hoàn hảo trong bộ sưu tập của chúng tôi</p>
            </div>

            <div className="relative px-4 md:px-12">
              {/* Vùng hover bên trái để hiện nút lùi */}
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-start z-10 group/left hidden md:flex">
                <button 
                  onClick={scrollLeft}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 opacity-0 group-hover/left:opacity-100 transition-opacity cursor-pointer ml-2"
                >
                  <MdKeyboardArrowLeft className="w-6 h-6" />
                </button>
              </div>

              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 md:gap-10 py-4 snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`
                  div::-webkit-scrollbar { display: none; }
                `}</style>
              {categories.length > 0 ? categories.map((cat, index) => {
                // Lấy sản phẩm đầu tiên của danh mục làm ảnh đại diện
                const catProduct = products.find(p => p.maLoaiSP === (cat.maLoaiSP || cat.maLoai));
                const catImage = catProduct?.hinhAnh;
                const catName = cat.tenLoaiSP || cat.tenLoai;
                const catId = cat.maLoaiSP || cat.maLoai;

                // Các bộ màu sắc phối viền tròn cho từng danh mục
                const borderColors = [
                  { border: 'border-[#BAE6FD] hover:border-sky-500', bg: 'bg-[#F0F9FF]', text: 'text-[#0284C7]' },     // Xanh dương
                  { border: 'border-[#FEF08A] hover:border-yellow-500', bg: 'bg-[#FEFCE8]', text: 'text-[#CA8A04]' },  // Vàng
                  { border: 'border-[#BBF7D0] hover:border-emerald-500', bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]' }, // Xanh lá
                  { border: 'border-[#C7D2FE] hover:border-indigo-500', bg: 'bg-[#EEF2FF]', text: 'text-[#4F46E5]' },  // Tím
                  { border: 'border-[#FED7AA] hover:border-orange-500', bg: 'bg-[#FFF7ED]', text: 'text-[#EA580C]' },  // Cam
                  { border: 'border-[#FBCFE8] hover:border-pink-500', bg: 'bg-[#FDF2F8]', text: 'text-[#DB2777]' },    // Hồng
                ];
                const color = borderColors[index % borderColors.length];

                return (
                  <Link 
                    to={`/sanpham?loai=${catId}`} 
                    key={catId} 
                    className="flex flex-col items-center gap-3 group cursor-pointer transition-transform duration-300 min-w-[112px] md:min-w-[128px] snap-center"
                  >
                    <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 ${color.border} ${color.bg} flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-sm hover:shadow-md shrink-0`}>
                      {catImage ? (
                        <img 
                          src={catImage} 
                          alt={catName} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(catName)}&background=EFF6FF&color=2563EB&size=128`; }}
                        />
                      ) : (
                        <span className="text-2xl text-[#2563EB]/50 font-bold">{catName?.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm md:text-base text-gray-800 group-hover:text-primary transition-colors text-center">{catName}</span>
                  </Link>
                );
              }) : (
                // Skeleton loading
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 animate-pulse min-w-[112px] md:min-w-[128px] snap-center">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-200 border-4 border-gray-150"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))
              )}
              </div>

              {/* Vùng hover bên phải để hiện nút tới */}
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-end z-10 group/right hidden md:flex">
                <button 
                  onClick={scrollRight}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 opacity-0 group-hover/right:opacity-100 transition-opacity cursor-pointer mr-2"
                >
                  <MdKeyboardArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-16 md:py-24 px-4 bg-surface-bright">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-headline-md font-headline-md text-[#111827] mb-1">Xu hướng hiện nay</h2>
                <p className="text-body-md text-on-surface/70 text-sm">Những món đồ mà mọi người đang yêu thích trong mùa này.</p>
              </div>
              <button className="hidden sm:flex items-center gap-1 text-primary font-label-md text-sm hover:text-[#111827] transition-colors group cursor-pointer">
                Xem tất cả <MdArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                 <span className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></span>
              </div>
            ) : (
              <div className="relative px-4 md:px-12">
                {/* Trending Left Button */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-start z-10 group/left hidden md:flex">
                  <button 
                    onClick={scrollTrendingLeft}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 opacity-0 group-hover/left:opacity-100 transition-opacity cursor-pointer ml-2"
                  >
                    <MdKeyboardArrowLeft className="w-6 h-6" />
                  </button>
                </div>

                {/* Trending Carousel */}
                <div 
                  ref={trendingScrollRef}
                  className="flex overflow-x-auto gap-6 py-4 snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <style>{`
                    div::-webkit-scrollbar { display: none; }
                  `}</style>
                  {products.slice(0, 8).map(product => (
                    <div key={product.maSP} className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-center shrink-0 h-full">
                      <ProductCard 
                        product={product} 
                        isFavorite={favIds.includes(product.maSP)} 
                        onToggleFav={handleToggleFav} 
                      />
                    </div>
                  ))}
                </div>

                {/* Trending Right Button */}
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-end z-10 group/right hidden md:flex">
                  <button 
                    onClick={scrollTrendingRight}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 opacity-0 group-hover/right:opacity-100 transition-opacity cursor-pointer mr-2"
                  >
                    <MdKeyboardArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Promotions Section */}
        {discountProducts.length > 0 && (
          <section className="py-16 md:py-24 px-4 bg-surface-bright">
            <div className="max-w-[1280px] mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-headline-md font-headline-md text-[#E11D48] mb-1 flex items-center gap-2">
                    <MdLocalOffer className="w-8 h-8" />
                    Khuyến mãi đặc biệt
                  </h2>
                  <p className="text-body-md text-[#BE123C]/80 text-sm">Các sản phẩm đang được giảm giá cực sốc.</p>
                </div>
                <Link to="/khuyenmai" className="hidden sm:flex items-center gap-1 text-[#E11D48] font-label-md text-sm hover:text-[#9F1239] transition-colors group cursor-pointer">
                  Xem tất cả <MdArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="relative px-0 md:px-12">
                {/* Promo Left Button */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-start z-10 group/left hidden md:flex">
                  <button 
                    onClick={scrollPromoLeft}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 opacity-0 group-hover/left:opacity-100 transition-opacity cursor-pointer ml-2"
                  >
                    <MdKeyboardArrowLeft className="w-6 h-6" />
                  </button>
                </div>

                {/* Promo Carousel */}
                <div 
                  ref={promoScrollRef}
                  className="flex overflow-x-auto gap-6 py-4 snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <style>{`
                    div::-webkit-scrollbar { display: none; }
                  `}</style>
                  {discountProducts.map(product => (
                    <div key={product.maSP} className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-center shrink-0 h-full">
                      <ProductCard 
                        product={product} 
                        isFavorite={favIds.includes(product.maSP)} 
                        onToggleFav={handleToggleFav} 
                      />
                    </div>
                  ))}
                </div>

                {/* Promo Right Button */}
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-end z-10 group/right hidden md:flex">
                  <button 
                    onClick={scrollPromoRight}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 opacity-0 group-hover/right:opacity-100 transition-opacity cursor-pointer mr-2"
                  >
                    <MdKeyboardArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Feature Highlights */}
        {/* <section className="py-16 bg-surface-container-high/50 border-t border-b border-outline-variant/30 px-4">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 glass-card rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0">
                <MdLocalShipping className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md text-on-background mb-1 text-xl">Freeship từ 200k</h3>
                <p className="text-body-md text-on-surface/80 text-sm">Giao hàng tận nơi, nhanh chóng trong 2h tại nội thành HCM.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 glass-card rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                <MdVerified className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md text-on-background mb-1 text-xl">100% Chính hãng</h3>
                <p className="text-body-md text-on-surface/80 text-sm">Cam kết hoàn tiền gấp đôi nếu phát hiện hàng giả, hàng nhái.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 glass-card rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-tertiary flex items-center justify-center shrink-0">
                <MdSupportAgent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md text-on-background mb-1 text-xl">Đổi trả miễn phí</h3>
                <p className="text-body-md text-on-surface/80 text-sm">Hỗ trợ đổi trả dễ dàng trong vòng 7 ngày nếu không ưng ý.</p>
              </div>
            </div>
          </div>
        </section> */}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
