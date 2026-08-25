import React from 'react';
import { Link } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder, MdAddShoppingCart } from 'react-icons/md';
import { addToCart } from '../utils/cart';

export default function ProductCard({ product, isFavorite, onToggleFav }) {
  const brandName = product.tenTH || product.thuongHieu || product.tenThuongHieu || 'Thương hiệu';
  const hasDiscount = product.phanTramGiam > 0;
  const sl=product.soLuongTon;

  const ratingCount = product.rating ?? product.soSaoTrungBinh ?? 5;
  const reviewCount = product.reviewCount ?? product.soLuongDanhGia ?? 0;
  const stars = Array.from({ length: 5 }, (_, index) => index < ratingCount);

  return (
    <Link 
      to={`/sanpham/${product.maSP || product.id}`} 
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col p-3 md:p-3.5 h-full"
    >
      {/* Image Container with light purple bg */}
      <div className="relative aspect-[4/5] bg-[#F5F3F7] rounded-2xl overflow-hidden flex items-center justify-center mb-3 p-4 shrink-0">
        
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#FF6B00] text-white px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm z-10">
            -{product.phanTramGiam}%
          </span>
        )}
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (onToggleFav) onToggleFav(e, product);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
        >
          {isFavorite ? (
            <MdFavorite className="w-4 h-4 text-red-500" />
          ) : (
            <MdFavoriteBorder className="w-4 h-4" />
          )}
        </button>
        
        {/* Product Image */}
        <img 
          src={(product.hinhAnh ? product.hinhAnh.split(',')[0] : null) || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.tenSP || 'SP')}&background=EFF6FF&color=2563EB&size=400`}
          alt={product.tenSP} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.tenSP || 'SP')}&background=EFF6FF&color=2563EB&size=400`;
          }}
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 px-1">
        {/* Brand / Category */}
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 line-clamp-1">
          {brandName}
        </p>
        
        {/* Title */}
        <h3 className="font-semibold text-[13px] md:text-[14px] text-gray-800 mb-1.5 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors leading-snug">
          {product.tenSP}
        </h3>
        
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
            {stars.map((isFilled, idx) => (
              <span key={idx} className={`text-[11px] ${isFilled ? 'text-yellow-400' : 'text-gray-200'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-medium ml-1">({reviewCount})</span>
        </div>
        {/** SoLuongTon */}
        <div className="flex items-center gap-1 mb-3">
          {sl > 0 ? (
            <span className="text-[10px] text-gray-400 font-medium ml-1">SL còn: {product.soLuongTon}</span>
          ) : (
            <span className="text-[10px] text-red-400 font-medium ml-1">Hết hàng</span>
          )}
        </div>
        {/* Price and Cart Action */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1 border-t border-gray-50/50">
          <div className="flex flex-col gap-0.5">
            {hasDiscount ? (
              <>
                <span className="text-[11px] text-gray-400 line-through font-medium">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}
                </span>
                <span className="font-bold text-[15px] md:text-[17px] text-red-600 tracking-tight">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.giaGiam)}
                </span>
              </>
            ) : (
              <span className="font-bold text-[15px] md:text-[17px] text-red-600 tracking-tight">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}
              </span>
            )}
          </div>
          
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#EEF2FF] hover:bg-blue-600 text-blue-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md shrink-0 active:scale-95"
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            title="Thêm vào giỏ hàng"
          >
            <MdAddShoppingCart className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </Link>
  );
}
