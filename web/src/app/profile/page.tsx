"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import Link from 'next/link';
import {
  User, Settings, Heart, Clock, LogIn, Shield, Film, BookOpen, Crown, Loader2, Star, Calendar, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
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
              <User className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-black uppercase italic text-white">Vui lòng đăng nhập</h2>
            <p className="text-zinc-500 text-sm font-medium">Bạn cần đăng nhập để xem trang cá nhân.</p>
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

  const links = [
    { href: '/history', icon: Clock, label: 'Lịch sử xem/đọc', desc: 'Tiếp tục nội dung đang dở' },
    { href: '/following', icon: Heart, label: 'Đang theo dõi', desc: 'Nội dung bạn yêu thích' },
    { href: '/settings', icon: Settings, label: 'Cài đặt tài khoản', desc: 'Quản lý thông tin cá nhân' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 mt-16 p-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 mb-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-2 border-white/10">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">{user.displayName || user.username}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Tham gia {new Date(user.createdAt || Date.now()).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-3 py-1 bg-primary-container/10 text-primary-container text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary-container/20">
                  {user.role?.name === 'super_admin' ? 'Quản trị viên' : 'Thành viên'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Nội dung đã xem', value: '12', icon: Film },
            { label: 'Nội dung đã đọc', value: '8', icon: BookOpen },
            { label: 'Đánh giá', value: '5', icon: Star },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0f0f0f] border border-white/5 rounded-[24px] p-6 text-center">
              <stat.icon className="w-6 h-6 text-primary-container mx-auto mb-3" />
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-[#0f0f0f] border border-white/5 rounded-[24px] p-6 flex items-center gap-6 hover:bg-white/[0.02] transition-all group"
            >
              <div className="p-3 bg-zinc-900 rounded-2xl group-hover:bg-primary-container/10 transition-colors">
                <link.icon className="w-6 h-6 text-zinc-500 group-hover:text-primary-container transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-white uppercase italic tracking-tight">{link.label}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
