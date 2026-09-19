"use client";

import React from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Heart, Loader2, Sparkles, Clock, Star, UserMinus } from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function FollowingPage() {
  const { data: follows, error, isLoading, mutate } = useSWR('follows', () => api.get('/user/follows').then(res => res.data));

  const unfollow = async (e: React.MouseEvent, contentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/interaction/favorite/${contentId}`);
      mutate();
    } catch (err) {
      console.error('Failed to unfollow', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased pb-24 lg:pb-12">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 mt-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12 pt-6">
        {/* Header Section */}
        <div className="relative p-10 md:p-16 rounded-[40px] overflow-hidden bg-surface-container border border-outline/10 shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 animate-pulse">
            <Heart className="w-64 h-64 text-red-600 fill-current" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-600/20 rounded-3xl border border-red-600/30 backdrop-blur-xl">
                <Heart className="w-10 h-10 text-red-600 fill-current" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-on-surface">Đang Theo Dõi</h1>
                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Cập nhật mới nhất từ những nội dung bạn yêu thích</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-16 h-16 text-primary-container animate-spin" />
            <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px]">Đang đồng bộ hóa thư viện cá nhân...</p>
          </div>
        ) : follows?.length > 0 ? (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-l-4 border-primary-container pl-4">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-on-surface">Nội dung yêu thích ({follows.length})</h2>
              <Sparkles className="w-5 h-5 text-primary-container" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {follows.map((follow: any, idx: number) => (
                <Link 
                  key={follow.contentId}
                  href={`/contents/${follow.content.slug}`}
                  className="group relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.05] border border-white/5"
                >
                  <img 
                    src={follow.content.posterUrl} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={follow.content.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent dark:from-black/90 dark:via-black/20"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                     <span className="bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest shadow-lg animate-pulse">
                        Mới cập nhật
                     </span>
                     <button
                       onClick={(e) => unfollow(e, follow.contentId)}
                       className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/70 hover:text-red-500 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                       title="Bỏ theo dõi"
                     >
                       <UserMinus className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={cn(
                      "px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-widest mb-2 inline-block shadow-md",
                      follow.content.type === 'MOVIE' || follow.content.type === 'ANIME' ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                    )}>
                      {follow.content.type}
                    </span>
                    <h3 className="text-lg font-black text-on-surface dark:text-white leading-tight uppercase italic truncate drop-shadow-lg group-hover:text-primary-container transition-colors tracking-tighter">
                      {follow.content.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                       <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                          {follow.content.releaseYear} • {follow.content.type === 'STORY' || follow.content.type === 'MANGA' ? 'Chương mới' : 'Tập mới'}
                       </p>
                       <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-black">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{follow.content.ratingAvg?.toFixed(1) || '0.0'}</span>
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 glass-card rounded-[40px] border border-outline/10 border-dashed">
             <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-zinc-400" />
             </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase italic text-on-surface tracking-tighter">Chưa theo dõi nội dung nào</h3>
                <p className="text-zinc-500 font-medium max-w-xs uppercase text-[10px] tracking-widest mx-auto leading-relaxed">
                  Hãy nhấn biểu tượng trái tim ở trang chi tiết để lưu nội dung bạn yêu thích vào đây.
                </p>
             </div>
             <Link 
              href="/"
              className="px-10 py-4 bg-primary-container text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all active:scale-95"
             >
                Khám phá ngay
             </Link>
          </div>
        )}

        {/* Suggestion based on follows */}
        {follows?.length > 0 && (
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-3 border-l-4 border-primary-container pl-4">
              <Clock className="w-5 h-5 text-on-surface/40" />
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-on-surface">Gợi ý dành riêng cho bạn</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2].map(i => (
                 <div key={i} className="glass-card p-6 rounded-3xl flex gap-6 border border-outline/10 group hover:bg-surface-container transition-all shadow-xl">
                   <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-xl border border-outline/10 flex-none relative">
                     <img src={`https://picsum.photos/seed/${i + 200}/500/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                     <div className="absolute inset-0 bg-on-surface/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                     </div>
                   </div>
                    <div className="flex-1 flex flex-col justify-center space-y-2">
                      <h4 className="font-black text-lg text-on-surface uppercase italic tracking-tighter group-hover:text-primary-container transition-colors leading-tight">Siêu Phẩm Đề Xuất {i}</h4>
                      <p className="text-[10px] text-on-surface/40 font-black uppercase tracking-[0.2em]">Dựa trên sở thích của bạn</p>
                     <div className="flex gap-2 pt-2">
                        <span className="px-2 py-0.5 bg-surface-container text-[8px] font-black text-on-surface/60 rounded uppercase">Hành động</span>
                        <span className="px-2 py-0.5 bg-surface-container text-[8px] font-black text-on-surface/60 rounded uppercase">Kịch tính</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
