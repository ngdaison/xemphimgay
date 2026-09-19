"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { api } from '@/lib/api';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-[100] h-16 flex justify-between items-center px-6 transition-all duration-500 font-['Be_Vietnam_Pro'] antialiased",
      "bg-surface/80 backdrop-blur-2xl border-b border-outline/10 shadow-sm"
    )}>
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary-container uppercase">
          CineStream
        </Link>
      </div>
      
      {/* Desktop Search */}
      <form action="/search" className="hidden md:flex flex-1 max-w-2xl px-8">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 group-focus-within:text-primary-container transition-colors">search</span>
          <input 
            name="q"
            className="w-full bg-surface border border-outline/10 rounded-full py-2 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary-container transition-all outline-none text-on-surface shadow-sm" 
            placeholder="Tìm kiếm phim, anime, truyện..." 
            type="text"
          />
        </div>
      </form>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-on-surface/60 text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        
        <NotificationCenter />
        
        <AuthProfile />
      </div>
    </header>
  );
};

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    api.get('/notifications?limit=5').then(res => {
      setNotifications(res.data?.items || res.data || []);
    }).catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200 relative group"
      >
        <span className="material-symbols-outlined text-on-surface/60 text-[20px] group-hover:rotate-12 transition-transform">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-primary-container rounded-full border-2 border-background flex items-center justify-center text-[8px] font-black text-white px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-surface border border-outline/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-5 border-b border-outline/10 flex items-center justify-between bg-surface-container/50 backdrop-blur-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Thông báo</h3>
              <button className="text-[8px] font-black uppercase tracking-widest text-primary-container hover:underline">Đánh dấu đã đọc</button>
            </div>
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? notifications.map((n: any) => {
                const diff = Date.now() - new Date(n.createdAt).getTime();
                const mins = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                const timeAgo = mins < 1 ? 'Vừa xong' : mins < 60 ? `${mins} phút trước` : hours < 24 ? `${hours} giờ trước` : `${days} ngày trước`;

                return (
                <div
                  key={n.id}
                  className={cn(
                    "p-5 hover:bg-surface-container transition-colors cursor-pointer border-b border-outline/10 last:border-0",
                    !n.read && "bg-primary-container/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[10px] font-black text-on-surface uppercase tracking-wider">{n.title}</h4>
                    <span className="text-[8px] text-on-surface/50 font-bold uppercase">{timeAgo}</span>
                  </div>
                  <p className="text-xs text-on-surface/60 leading-relaxed line-clamp-2">{n.message}</p>
                </div>
                );
              }) : (
                <div className="p-10 text-center">
                  <p className="text-xs text-zinc-500 font-medium">Không có thông báo nào</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-surface-container/50 backdrop-blur-xl text-center border-t border-outline/10">
              <Link href="/notifications" className="text-[9px] font-black uppercase tracking-widest text-on-surface/50 hover:text-on-surface transition-colors">Xem tất cả thông báo</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AuthProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    window.location.reload();
  };

  if (!user) {
    return (
      <Link href="/auth/login" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95">
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-4 border-l border-outline/10 group cursor-pointer"
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-on-surface leading-tight group-hover:text-primary-container transition-colors">{user.displayName || user.username}</p>
          <p className="text-[10px] text-on-surface/50">{user.role?.name === 'super_admin' ? 'Admin' : 'Premium Member'}</p>
        </div>
        <div className="w-8 h-8 rounded-full border border-outline/10 overflow-hidden group-hover:border-primary-container transition-all">
          <img 
            alt="User profile" 
            className="w-full h-full object-cover" 
            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
          />
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-64 bg-surface border border-outline/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-5 border-b border-outline/10 bg-surface-container/50 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/50 mb-1">Đã đăng nhập</p>
              <p className="text-sm font-black text-on-surface uppercase italic truncate">{user.displayName || user.username}</p>
            </div>
            
            <div className="p-2 space-y-1">
              {user.role?.name === 'super_admin' && (
                <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface/60 hover:text-on-surface transition-all group">
                  <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">dashboard</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Dashboard Admin</span>
                </Link>
              )}
              <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-on-surface/60 hover:text-on-surface transition-all group">
                <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">settings</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Cài đặt tài khoản</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-container/10 text-on-surface/60 hover:text-primary-container transition-all group"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">logout</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Đăng xuất</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
