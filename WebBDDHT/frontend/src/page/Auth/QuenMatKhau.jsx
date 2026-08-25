import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineLockReset } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../services/api';

export default function QuenMatKhau() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & mật khẩu mới
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Xử lý gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    setIsLoading(true);
    try {
      const res = await API.post('/TaiKhoan/quenmatkhau', { email });
      if (res.status === 200) {
        toast.success(res.data.message || 'Mã xác nhận đã được gửi đến email của bạn');
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Vui lòng nhập mã OTP');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    setIsLoading(true);
    try {
      const res = await API.post('/TaiKhoan/datlaimatkhau', {
        email,
        otp,
        matKhauMoi: newPassword,
      });
      if (res.status === 200) {
        toast.success(res.data.message || 'Đặt lại mật khẩu thành công');
        navigate('/dangnhap');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col items-center justify-center px-4 py-12">

      {/* ===== CARD ===== */}
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-3xl shadow-2xl shadow-outline-variant/20 border border-outline-variant/25 overflow-hidden">
          <div className="px-8 pt-8 pb-10">
            {/* --- Icon trên cùng --- */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Vòng ngoài mờ */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  {/* Vòng trong */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                    <MdOutlineLockReset className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Tiêu đề --- */}
            <div className="text-center mb-7">
              <h1 className="text-2xl font-black text-on-surface mb-2">
                {step === 1 ? 'Quên mật khẩu?' : 'Đặt mật khẩu mới'}
              </h1>
              <p className="text-sm text-on-secondary-container leading-relaxed">
                {step === 1
                  ? 'Đừng lo lắng! Hãy nhập email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.'
                  : <>Mã OTP đã gửi tới <span className="font-bold text-primary">{email}</span>. Nhập mã và mật khẩu mới.</>
                }
              </p>
            </div>

            {/* --- Step dots indicator --- */}
            <div className="flex justify-center gap-2 mb-7">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/40'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/40'}`} />
            </div>

            {/* ===== BƯỚC 1: Nhập Email ===== */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-5">

                {/* Field Email */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="h-4.5 w-4.5 text-outline" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-surface-container-lowest hover:bg-surface transition-colors placeholder:text-outline/60"
                      placeholder="example@gmail.com"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Nút gửi */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>Gửi yêu cầu <span className="ml-1">→</span></>
                  )}
                </button>
              </form>
            )}

            {/* ===== BƯỚC 2: OTP + Mật khẩu mới ===== */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">

                {/* Field OTP */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">
                    Mã xác nhận (OTP)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiCheckCircle className="h-4.5 w-4.5 text-outline" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-surface-container-lowest hover:bg-surface transition-colors tracking-[0.5em] text-center font-bold"
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Field Mật khẩu mới */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-4.5 w-4.5 text-outline" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-surface-container-lowest hover:bg-surface transition-colors"
                      placeholder="Ít nhất 6 ký tự"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors focus:outline-none"
                    >
                      {showNewPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Field Xác nhận mật khẩu */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-4.5 w-4.5 text-outline" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-surface-container-lowest hover:bg-surface transition-colors"
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <p className={`mt-1.5 text-xs font-semibold flex items-center gap-1 ${newPassword === confirmPassword ? 'text-green-600' : 'text-error'}`}>
                      {newPassword === confirmPassword
                        ? <><FiCheckCircle className="w-3.5 h-3.5" /> Mật khẩu khớp</>
                        : 'Mật khẩu chưa khớp'
                      }
                    </p>
                  )}
                </div>

                {/* Nút đặt lại */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Đặt lại mật khẩu'
                  )}
                </button>
              </form>
            )}

            {/* --- Divider --- */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/25" />
              </div>
            </div>

            {/* --- Link quay lại --- */}
            <div className="text-center">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-semibold text-on-secondary-container hover:text-primary transition-colors flex items-center justify-center gap-1.5 mx-auto group"
                >
                  <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Chưa nhận mã? Thử lại
                </button>
              ) : (
                <Link
                  to="/dangnhap"
                  className="text-sm font-semibold text-on-secondary-container hover:text-primary transition-colors flex items-center justify-center gap-1.5 group"
                >
                  <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Quay lại Đăng nhập
                </Link>
              )}
            </div>

          </div>
        </div>
        
      </div>

    </div>
  );
}
