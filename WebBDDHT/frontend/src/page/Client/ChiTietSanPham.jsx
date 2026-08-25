import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MdKeyboardArrowRight, MdAdd, MdRemove, MdStar, MdStarHalf, MdStarBorder, MdSecurity, MdLocalShipping, MdCheckCircleOutline, MdFavoriteBorder } from 'react-icons/md';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API from '../../services/api';
import { addToCart } from '../../utils/cart';

export default function ChiTietSanPham() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // UI states
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('mint');
  const [selectedSize, setSelectedSize] = useState('A5');
  const [activeTab, setActiveTab] = useState('mota');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const prodRes = await API.get(`/SanPham/${id}`);
        setProduct(prodRes.data || null);

        const allRes = await API.get(`/SanPham`);
        setAllProducts(allRes.data.items || allRes.data || []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await API.get(`/DanhGia?maSP=${id}`);
        setReviews(res.data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const relatedProducts = allProducts
    .filter(p => product && p.maLoaiSP === product.maLoaiSP && p.maSP !== product.maSP)
    .slice(0, 4);

  // Dynamic rating and stars helpers
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.soSao || 0), 0) / reviews.length).toFixed(1)
    : (product && product.rating !== undefined ? product.rating.toFixed(1) : "5.0");

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<MdStar key={i} className="w-5 h-5 text-[#fbbc05]" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<MdStarHalf key={i} className="w-5 h-5 text-[#fbbc05]" />);
      } else {
        stars.push(<MdStarBorder key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const colors = [
    { id: 'mint', name: 'Xanh bạc hà', code: '#c8e6c9' },
    { id: 'pink', name: 'Hồng pastel', code: '#ffcdd2' },
    { id: 'yellow', name: 'Vàng nhạt', code: '#fff9c4' }
  ];

  const sizes = ['A5', 'B5'];

  return (
    <div className="bg-surface-bright selection:bg-primary-container selection:text-primary min-h-screen flex flex-col font-body-md">
      {/* Header */}
      <Header />

      {loading ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <span className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></span>
        </div>
      ) : !product ? (
        <div className="flex-1 flex justify-center items-center py-20 text-on-surface/60">
          Sản phẩm không tồn tại.
        </div>
      ) : (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8">
          
          {/* Breadcrumb */}
          <div className="text-sm text-on-surface/60 mb-8 flex items-center gap-2">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <MdKeyboardArrowRight className="w-4 h-4" />
            <Link to={`/sanpham`} className="hover:text-primary transition-colors">Sản phẩm</Link>
            <MdKeyboardArrowRight className="w-4 h-4" />
            <Link to={`/sanpham?loai=${product.maLoaiSP}`} className="hover:text-primary transition-colors">{product.tenLoaiSP || 'Danh mục'}</Link>
            <MdKeyboardArrowRight className="w-4 h-4" />
            <span className="text-on-background font-medium truncate max-w-[200px] md:max-w-none">{product.tenSP}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Left Column: Images */}
            <div className="flex gap-4">
              {/* Main Image */}
              <div className="flex-1 aspect-[4/5] bg-[#eef5ed] rounded-3xl overflow-hidden shadow-sm border border-outline-variant/20 flex items-center justify-center">
                <img 
                  src={(product.hinhAnh ? product.hinhAnh.split(',')[activeImageIndex] : null) || `https://via.placeholder.com/600x800?text=${encodeURIComponent(product.tenSP)}`} 
                  alt={product.tenSP}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=No+Image'; }}
                />
              </div>
              
              {/* Thumbnails (Right Side) */}
              <div className="w-20 lg:w-24 flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-hide">
                {(product.hinhAnh ? product.hinhAnh.split(',') : []).map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImageIndex(idx)}
                    className={`shrink-0 w-full aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${idx === activeImageIndex ? 'border-primary' : 'border-transparent hover:border-outline-variant/30'}`}
                  >
                    <div className="w-full h-full bg-[#f4ebf8] flex items-center justify-center">
                      <img src={img} alt={`thumbnail-${idx}`} className={`w-full h-full object-cover transition-all ${idx === activeImageIndex ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-display-md font-bold text-on-background mb-4 leading-tight">
                {product.tenSP}
              </h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center">
                  {renderStars(Number(averageRating))}
                  <span className="text-on-background font-semibold ml-2">
                    {averageRating}/5
                  </span>
                </div>
                <div className="w-px h-4 bg-outline-variant"></div>
                <span className="text-on-surface/60">{totalReviews} Đánh giá</span>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-6 mb-8 flex items-end gap-4 border border-outline-variant/20">
                <span className="text-4xl font-bold text-on-background">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.phanTramGiam ? product.giaGiam : product.gia)}
                </span>
                {product.phanTramGiam && (
                  <>
                    <span className="text-lg text-on-surface/40 line-through mb-1">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}
                    </span>
                    <span className="bg-[#F97316] text-white text-xs font-bold px-2 py-1 rounded-md mb-2">
                      -{product.phanTramGiam}%
                    </span>
                  </>
                )}
              </div>

              {/* <ul className="space-y-3 mb-8 text-on-surface">
                <li className="flex items-start gap-2">
                  <MdCheckCircleOutline className="w-5 h-5 text-[#9bbca7] shrink-0 mt-0.5" />
                  <span>Chống thấm mực, phù hợp nhiều loại bút</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdCheckCircleOutline className="w-5 h-5 text-[#9bbca7] shrink-0 mt-0.5" />
                  <span>Lò xo xoay 360 độ linh hoạt</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdCheckCircleOutline className="w-5 h-5 text-[#9bbca7] shrink-0 mt-0.5" />
                  <span>Lý tưởng cho bullet journal và ghi chép hàng ngày</span>
                </li>
              </ul> */}

              {/* Color Selection - Tạm ẩn vì chưa có dữ liệu trong DB */}
              {/* <div className="mb-6">
                <h3 className="text-sm font-medium text-on-background mb-3 flex gap-2">
                  Màu sắc: <span className="text-on-surface/60 font-normal">{colors.find(c => c.id === selectedColor)?.name}</span>
                </h3>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button 
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center ${selectedColor === color.id ? 'border-primary' : 'border-transparent shadow-sm'}`}
                      style={{ backgroundColor: color.code }}
                    >
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Size Selection - Tạm ẩn vì chưa có dữ liệu trong DB */}
              {/* <div className="mb-8">
                <h3 className="text-sm font-medium text-on-background mb-3">Kích thước</h3>
                <div className="flex gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 rounded-full border cursor-pointer font-medium text-sm transition-all ${selectedSize === size ? 'bg-[#EFF6FF] border-primary text-primary' : 'bg-white border-outline-variant/30 text-on-surface hover:border-outline-variant'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Add to Cart Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Ẩn bộ đếm số lượng vì quy định mỗi khách chỉ mua 1 SP */}
                <div className="flex items-center bg-[#f4f7fb] rounded-full border border-[#e5ecf5] h-14 px-6 opacity-70 cursor-not-allowed">
                  <span className="text-center font-bold text-on-background">SL: 1</span>
                </div>
                
                <button onClick={() => addToCart(product, quantity)} className="flex-1 min-w-[160px] h-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all cursor-pointer">
                  Thêm vào giỏ
                </button>
                <button onClick={() => { addToCart(product, quantity); navigate('/giohang'); }} className="flex-1 min-w-[120px] h-14 bg-[#F3F4F6] text-[#111827] hover:bg-gray-200 rounded-full font-bold shadow-sm transition-all cursor-pointer">
                  Mua ngay
                </button>
                <button className="w-14 h-14 flex items-center justify-center bg-white border border-outline-variant/30 rounded-full text-on-surface hover:text-red-500 hover:border-red-200 transition-all cursor-pointer">
                  <MdFavoriteBorder className="w-6 h-6" />
                </button>
              </div>

            

            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-16">
            <div className="flex items-center gap-8 border-b border-outline-variant/20 mb-8 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('mota')}
                className={`pb-4 text-lg font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'mota' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-on-surface/60 hover:text-on-surface'}`}
              >
                Mô tả sản phẩm
              </button>
             
              <button 
                onClick={() => setActiveTab('danhgia')}
                className={`pb-4 text-lg font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'danhgia' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-on-surface/60 hover:text-on-surface'}`}
              >
                Đánh giá ({totalReviews})
              </button>
            </div>

            <div className="min-h-[200px]">
              {activeTab === 'mota' && (
                <div className="animate-fade-in">
                  <p className="text-on-surface leading-relaxed mb-8">
                    {product.moTa || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                  </p>
                </div>
              )}
              {activeTab === 'danhgia' && (
                <div className="animate-fade-in space-y-6">
                  {reviewsLoading ? (
                    <div className="text-on-surface/60 italic">Đang tải đánh giá...</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-on-surface/60 italic">Sản phẩm này chưa có nhận xét chi tiết nào. Hãy là người đầu tiên đánh giá!</div>
                  ) : (
                    <div className="divide-y divide-outline-variant/20 max-w-2xl">
                      {reviews.map((review) => (
                        <div key={review.maDG} className="py-4 first:pt-0 last:pb-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-on-background text-sm">{review.tenKhachHang || 'Khách hàng'}</span>
                            <span className="text-xs text-on-surface/50">
                              {review.ngayDG ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(review.ngayDG)) : ''}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-[#fbbc05]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              i < (review.soSao || 5) ? (
                                <MdStar key={i} className="w-4 h-4" />
                              ) : (
                                <MdStarBorder key={i} className="w-4 h-4 text-gray-300" />
                              )
                            ))}
                          </div>
                          
                          <p className="text-sm text-on-surface leading-relaxed font-medium">
                            {review.noiDung || 'Khách hàng không để lại nhận xét.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-on-background font-display-md">Sản phẩm liên quan</h2>
              <Link to="/sanpham" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                Xem tất cả <MdKeyboardArrowRight />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.length > 0 ? relatedProducts.map((item, idx) => {
                const colors = ['bg-[#eef5ed]', 'bg-[#edece6]', 'bg-[#ffeae0]', 'bg-[#e5eff1]', 'bg-[#f4ebf8]'];
                const bgClass = colors[idx % colors.length];
                return (
                  <Link to={`/sanpham/${item.maSP}`} key={item.maSP} className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30 flex flex-col">
                    <div className={`w-full aspect-square ${bgClass} relative overflow-hidden flex items-center justify-center p-6`}>
                      <img 
                        src={item.hinhAnh || `https://via.placeholder.com/300x300?text=${encodeURIComponent(item.tenSP)}`} 
                        alt={item.tenSP} 
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-on-background text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {item.tenSP}
                      </h3>
                      <div className="mt-auto">
                        {item.phanTramGiam ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#DC2626]">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.giaGiam)}
                            </span>
                            <span className="text-xs text-on-surface/40 line-through">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.gia)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-primary">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.gia)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }) : (
                <p className="text-on-surface/60 italic col-span-full">Chưa có sản phẩm liên quan.</p>
              )}
            </div>
          </div>

        </main>
      )}

      <Footer />
    </div>
  );
}
