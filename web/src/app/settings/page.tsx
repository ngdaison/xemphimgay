"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import {
  User,
  Mail,
  Lock,
  Shield,
  CreditCard,
  Bell,
  Check,
  Crown,
  Camera,
  Loader2,
  Eye,
  EyeOff,
  LogIn
} from "lucide-react";
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notification toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifNewContent, setNotifNewContent] = useState(true);
  const [notifComments, setNotifComments] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    if (!token) {
      setLoading(false);
      return;
    }
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setDisplayName(parsed.displayName || parsed.username || '');
        setEmail(parsed.email || '');
      } catch { /* ignore */ }
    }
    // Try to fetch fresh user data
    api.get('/auth/me').then(res => {
      setUser(res.data);
      setDisplayName(res.data.displayName || res.data.username || '');
      setEmail(res.data.email || '');
      localStorage.setItem('user', JSON.stringify(res.data));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await api.put('/auth/profile', { displayName, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ các trường');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  const sections = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'subscription', label: 'Gói thành viên', icon: Crown },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased">
        <Header />
        <Sidebar />
        <main className="lg:ml-64 mt-16 p-8 flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased">
        <Header />
        <Sidebar />
        <main className="lg:ml-64 mt-16 p-8 max-w-lg mx-auto min-h-[80vh] flex items-center justify-center">
          <div className="bg-surface-container border border-outline/10 rounded-[40px] p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-black uppercase italic text-white">Vui lòng đăng nhập</h2>
            <p className="text-zinc-500 text-sm font-medium">Bạn cần đăng nhập để truy cập cài đặt tài khoản.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-10 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all flex items-center gap-2 mx-auto"
            >
              <LogIn className="w-4 h-4" /> Đăng nhập
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 mt-16 p-8 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Cài đặt tài khoản</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Quản lý thông tin cá nhân và thiết lập hệ thống</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
                  activeSection === section.id
                    ? "bg-primary-container text-white shadow-lg shadow-red-900/20"
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="md:col-span-3 space-y-8">
            {activeSection === 'profile' && (
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border-2 border-white/10 group-hover:border-primary-container transition-all">
                      <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-container rounded-2xl flex items-center justify-center border-4 border-[#0f0f0f] shadow-xl group-hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic">{user.displayName || user.username}</h3>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Thành viên từ {new Date(user.createdAt || Date.now()).getFullYear()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Tên hiển thị</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-primary-container transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Địa chỉ Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-primary-container transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
                  {saved && (
                    <span className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                      <Check className="w-4 h-4" /> Đã lưu
                    </span>
                  )}
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-10 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-white uppercase italic">Đổi mật khẩu</h3>

                {passwordError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold">{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm font-bold">{passwordSuccess}</div>
                )}

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-primary-container transition-all text-sm font-bold pr-12"
                        placeholder="••••••••"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Mật khẩu mới</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-primary-container transition-all text-sm font-bold"
                      placeholder="Ít nhất 6 ký tự"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Xác nhận mật khẩu mới</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-primary-container transition-all text-sm font-bold"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    className="px-10 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'subscription' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[40px] p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Crown className="w-64 h-64 text-yellow-500" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em]">Hiện tại: CineStream Free</span>
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">Nâng cấp lên Premium<br />Giải trí không giới hạn</h2>
                    <p className="text-zinc-400 text-sm max-w-md font-medium leading-relaxed">Xem phim 4K Ultra HD, không quảng cáo, và truy cập sớm vào các bộ anime/manga mới nhất.</p>
                    <button className="px-10 py-5 bg-yellow-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-yellow-500/20 hover:bg-yellow-400 transition-all">Nâng cấp ngay • 99.000đ/tháng</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 space-y-4">
                    <div className="p-3 bg-white/5 w-fit rounded-2xl">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Chất lượng 4K HDR</h4>
                    <p className="text-zinc-500 text-xs font-medium leading-relaxed">Trải nghiệm hình ảnh sắc nét nhất trên mọi thiết bị của bạn.</p>
                  </div>
                  <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 space-y-4">
                    <div className="p-3 bg-white/5 w-fit rounded-2xl">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Không quảng cáo</h4>
                    <p className="text-zinc-500 text-xs font-medium leading-relaxed">Xem phim và đọc truyện liền mạch, không bao giờ bị gián đoạn.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-white uppercase italic">Tùy chọn thông báo</h3>

                <div className="space-y-6">
                  <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer">
                    <div>
                      <span className="text-sm font-bold text-white">Thông báo qua Email</span>
                      <p className="text-[10px] text-zinc-500 font-medium">Nhận thông báo qua địa chỉ email của bạn</p>
                    </div>
                    <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} className="w-5 h-5 accent-primary-container rounded" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer">
                    <div>
                      <span className="text-sm font-bold text-white">Thông báo đẩy</span>
                      <p className="text-[10px] text-zinc-500 font-medium">Nhận thông báo trên trình duyệt</p>
                    </div>
                    <input type="checkbox" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} className="w-5 h-5 accent-primary-container rounded" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer">
                    <div>
                      <span className="text-sm font-bold text-white">Nội dung mới</span>
                      <p className="text-[10px] text-zinc-500 font-medium">Khi có phim/truyện mới được thêm</p>
                    </div>
                    <input type="checkbox" checked={notifNewContent} onChange={(e) => setNotifNewContent(e.target.checked)} className="w-5 h-5 accent-primary-container rounded" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer">
                    <div>
                      <span className="text-sm font-bold text-white">Bình luận</span>
                      <p className="text-[10px] text-zinc-500 font-medium">Khi có người trả lời bình luận của bạn</p>
                    </div>
                    <input type="checkbox" checked={notifComments} onChange={(e) => setNotifComments(e.target.checked)} className="w-5 h-5 accent-primary-container rounded" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
