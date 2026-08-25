import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-hot-toast';
import { MdCheckCircle, MdStar, MdStarBorder, MdArrowBack } from 'react-icons/md';

export default function DanhGia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewOrder, setReviewOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [submittingReviews, setSubmittingReviews] = useState({});
  const [completedReviews, setCompletedReviews] = useState({});

  // Local storage helpers
  const getLocalReviewedOrders = () => {
    try {
      return JSON.parse(localStorage.getItem('reviewed_orders') || '{}');
    } catch (e) {
      return {};
    }
  };

  const markOrderAsReviewedLocally = (orderId) => {
    try {
      const localData = getLocalReviewedOrders();
      localData[orderId] = true;
      localStorage.setItem('reviewed_orders', JSON.stringify(localData));
    } catch (e) {
      console.error(e);
    }
  };

  const getLocalReviewedProducts = () => {
    try {
      return JSON.parse(localStorage.getItem('reviewed_products') || '{}');
    } catch (e) {
      return {};
    }
  };

  const markProductAsReviewedLocally = (orderId, maSP) => {
    try {
      const localData = getLocalReviewedProducts();
      if (!localData[orderId]) {
        localData[orderId] = {};
      }
      localData[orderId][maSP] = true;
      localStorage.setItem('reviewed_products', JSON.stringify(localData));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrderDetails = async () => {
      try {
        const res = await API.get(`/DonHang/chitiet/${id}`);
        const orderDetails = res.data;
        
        const localReviewedProducts = getLocalReviewedProducts()[id] || {};
        const mergedProducts = (orderDetails.danhSachSanPham || []).map(item => ({
          ...item,
          daDanhGia: item.daDanhGia || !!localReviewedProducts[item.maSP]
        }));
        
        const updatedOrderDetails = { ...orderDetails, danhSachSanPham: mergedProducts };
        setReviewOrder(updatedOrderDetails);
        
        const initialRatings = {};
        const initialComments = {};
        const initialCompleted = {};
        mergedProducts.forEach(item => {
          initialRatings[item.maSP] = 5;
          initialComments[item.maSP] = '';
          if (item.daDanhGia) {
            initialCompleted[item.maSP] = true;
          }
        });
        setRatings(initialRatings);
        setComments(initialComments);
        setCompletedReviews(initialCompleted);
      } catch (error) {
        console.error(error);
        toast.error('Lỗi tải sản phẩm để đánh giá!');
        navigate('/lichsudonhang');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  const handleRatingChange = (maSP, ratingValue) => {
    setRatings(prev => ({ ...prev, [maSP]: ratingValue }));
  };

  const handleCommentChange = (maSP, text) => {
    setComments(prev => ({ ...prev, [maSP]: text }));
  };
  // Xử lý đánh giá sản phẩm
  const handleSubmitReview = async (maSP) => {
    const rating = ratings[maSP] || 5;
    const comment = comments[maSP] || '';
    const orderId = reviewOrder.maDH || reviewOrder.maDonHang;

    setSubmittingReviews(prev => ({ ...prev, [maSP]: true }));
    try {
      if (comment.trim().split(/\s+/).length < 5) {
        toast.error('Nội dung đánh giá phải có ít nhất 5 từ!');
        return;
      }
      // Gửi đánh giá sản phẩm
      const res = await API.post('/DanhGia/vietdanhgia', {
        maSP: maSP,
        maDH: orderId,        
        soSao: rating,
        noiDung: comment
      });
      toast.success(res.data.message || 'Đánh giá sản phẩm thành công!');
      
      markProductAsReviewedLocally(orderId, maSP);
      const nextCompleted = { ...completedReviews, [maSP]: true };
      setCompletedReviews(nextCompleted);
      
      const allCompleted = reviewOrder.danhSachSanPham?.every(item => 
        item.maSP === maSP ? true : nextCompleted[item.maSP]
      );
      if (allCompleted) {
        markOrderAsReviewedLocally(orderId);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Không thể gửi đánh giá!';
      toast.error(errorMsg);
      if (errorMsg.includes('đã để lại đánh giá') || errorMsg.includes('đã đánh giá')) {
        markProductAsReviewedLocally(orderId, maSP);
        const nextCompleted = { ...completedReviews, [maSP]: true };
        setCompletedReviews(nextCompleted);
        const allCompleted = reviewOrder.danhSachSanPham?.every(item => 
          item.maSP === maSP ? true : nextCompleted[item.maSP]
        );
        if (allCompleted) {
          markOrderAsReviewedLocally(orderId);
        }
      }
    } finally {
      setSubmittingReviews(prev => ({ ...prev, [maSP]: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-background selection:bg-primary-container selection:text-primary">
      <Header />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-surface rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-outline-variant/30 bg-background">
              <Link 
                to="/lichsudonhang"
                className="w-10 h-10 flex items-center justify-center rounded-full text-on-secondary-container hover:bg-outline-variant/30 hover:text-on-background transition-colors cursor-pointer"
              >
                <MdArrowBack className="w-6 h-6" />
              </Link>
              <div>
                <h3 className="font-bold text-xl text-on-background">Đánh giá sản phẩm</h3>
                <p className="text-sm text-on-secondary-container mt-0.5">Đơn hàng #DH-{reviewOrder?.maDH || reviewOrder?.maDonHang}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-on-secondary-container">
                Vui lòng chia sẻ trải nghiệm của bạn về các sản phẩm trong đơn hàng này để giúp chúng mình cải thiện dịch vụ nhé!
              </p>

              <div className="space-y-6">
                {reviewOrder?.danhSachSanPham?.map((item) => {
                  const isCompleted = completedReviews[item.maSP];
                  const isSubmitting = submittingReviews[item.maSP];
                  const currentRating = ratings[item.maSP] || 5;

                  return (
                    <div key={item.maSP} className="border border-outline-variant/20 p-5 rounded-2xl bg-background/50 hover:border-primary/20 transition-all flex flex-col gap-4">
                      
                      {/* Product summary info */}
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-outline-variant/30 flex items-center justify-center">
                          <img 
                            src={item.hinhAnh ? (item.hinhAnh.startsWith('http') ? item.hinhAnh : `https://localhost:7224${item.hinhAnh}`) : 'https://placehold.co/100'} 
                            alt={item.tenSP} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-on-background truncate">{item.tenSP}</h4>
                          <p className="text-sm text-on-secondary-container mt-0.5">Số lượng mua: x{item.soLuong}</p>
                        </div>
                      </div>

                      {isCompleted ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold p-4 rounded-xl flex items-center gap-3">
                          <MdCheckCircle className="w-6 h-6 text-emerald-600 shrink-0 animate-bounce" />
                          Cảm ơn bạn đã gửi đánh giá cho sản phẩm này!
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Stars rating selection */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-on-secondary-container mr-3">Xếp hạng:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingChange(item.maSP, star)}
                                className="text-3xl transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                              >
                                {star <= currentRating ? (
                                  <MdStar className="text-amber-400" />
                                ) : (
                                  <MdStarBorder className="text-gray-300" />
                                )}
                              </button>
                            ))}
                            <span className="text-sm font-bold text-amber-500 ml-2">
                              {currentRating === 5 ? 'Cực kỳ hài lòng' : 
                               currentRating === 4 ? 'Rất hài lòng' : 
                               currentRating === 3 ? 'Bình thường' : 
                               currentRating === 2 ? 'Không hài lòng' : 'Rất tệ'}
                            </span>
                          </div>

                          {/* Comment textarea */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-on-secondary-container uppercase tracking-wider">Nội dung nhận xét</label>
                            <textarea
                              value={comments[item.maSP] || ''}
                              onChange={(e) => handleCommentChange(item.maSP, e.target.value)}
                              placeholder="Chia sẻ ý kiến của bạn về chất lượng sản phẩm (tối thiểu 5 từ)..."
                              maxLength={1000}
                              className="w-full bg-white border border-outline-variant/50 rounded-xl p-4 text-sm focus:outline-none focus:border-primary h-24 resize-none font-medium"
                            />
                          </div>

                          {/* Submit button per product */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleSubmitReview(item.maSP)}
                              disabled={isSubmitting}
                              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-[#1D4ED8] transition-all disabled:opacity-60 cursor-pointer shadow-sm shadow-primary/10"
                            >
                              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
