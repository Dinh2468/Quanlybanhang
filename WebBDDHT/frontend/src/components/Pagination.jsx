import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const pages = [];
  // Lọc hiển thị khoảng 5 trang để không bị tràn màn hình nếu totalPages lớn
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  // nếu trang hiện tại nhỏ hơn 3 thì hiển thị từ trang 1 đến trang 5
  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  }
  // nếu trang hiện tại lớn hơn tổng số trang trừ 2 thì hiển thị từ trang cuối trừ 4 đến trang cuối 
  if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }
  // Thêm trang đầu và trang cuối vào mảng pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white rounded-b-2xl">
      <div className="text-sm font-medium text-slate-500">
        Trang {currentPage} / {totalPages}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
            currentPage === 1 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
          }`}
        >
          <MdChevronLeft className="w-5 h-5" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-9 h-9 rounded-lg text-sm font-semibold transition-colors text-slate-600 hover:bg-slate-100"
            >
              1
            </button>
            {startPage > 2 && <span className="text-slate-400">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              currentPage === p
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-slate-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-9 h-9 rounded-lg text-sm font-semibold transition-colors text-slate-600 hover:bg-slate-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
            currentPage === totalPages 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
          }`}
        >
          <MdChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
