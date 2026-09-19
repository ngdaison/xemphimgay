"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { 
  Loader2, 
  Play, 
  BookOpen, 
  Trash2, 
  Search, 
  Settings, 
  History, 
  Heart, 
  LayoutGrid, 
  List,
  Filter,
  Shuffle,
  Star,
  Plus,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import Link from 'next/link';

type TabType = 'watching' | 'favorite' | 'playlist' | 'liked';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('watching');
  
  const { data: watchHistory, isLoading: watchLoading } = useSWR('watch_history', () => api.get('/history/watch').then(res => res.data));
  const { data: readHistory, isLoading: readLoading } = useSWR('read_history', () => api.get('/history/read').then(res => res.data));

  const isLoading = watchLoading || readLoading;

  const renderContentCard = (item: any, type: 'video' | 'book') => {
    const content = type === 'video' 
      ? (item.episode?.anime?.content || item.episode?.video?.content) 
      : (item.mangaChapter?.manga?.content || item.storyChapter?.story?.content);
    
    if (!content) return null;

    const progress = type === 'video' 
      ? (item.progress / (item.episode?.duration || 1)) * 100 
      : 40;

    const isVideo = type === 'video';

    return (
      <div key={item.id} className="group relative flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className={cn(
          "relative overflow-hidden rounded-[30px] border border-outline/5 bg-surface-container shadow-2xl transition-all duration-500 hover:scale-[1.05] group-hover:shadow-primary-container/10",
          isVideo ? "aspect-video" : "aspect-[3/4]"
        )}>
          <img 
            alt={content.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src={content.posterUrl} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent dark:from-black/80 dark:via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <button className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white shadow-xl shadow-red-900/40">
              {isVideo ? <Play className="w-6 h-6 fill-current" /> : <BookOpen className="w-6 h-6" />}
            </button>
          </div>
          <div className="absolute top-4 right-4 bg-red-600 text-white text-[8px] font-black px-2.5 py-1 rounded-lg shadow-xl tracking-widest">MỚI</div>
          
          {isVideo && (
            <div className="absolute bottom-4 right-4 bg-surface-container/80 backdrop-blur-md text-[8px] font-black text-on-surface px-2.5 py-1 rounded-lg border border-outline/10 uppercase tracking-widest">
              2h 15m
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-primary-container shadow-[0_0_10px_rgba(229,9,20,1)]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="px-2">
          <h3 className="font-black text-on-surface text-lg uppercase italic tracking-tighter truncate group-hover:text-primary-container transition-colors">
            {content.title}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              {isVideo ? 'Phim • 2024' : 'Truyện • Manhwa'}
            </span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black">8.9</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased flex flex-col pb-24">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 mt-16 px-8 md:px-16 pt-12 flex-1">
        {/* Page Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-on-surface">Thư viện cá nhân</h1>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-container border border-outline/10 hover:bg-surface-container-high transition-all text-[10px] font-black uppercase tracking-widest text-on-surface">
                <Filter className="w-4 h-4" /> Bộ lọc
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-container text-white hover:bg-red-700 transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-900/40">
                <Shuffle className="w-4 h-4" /> Phát ngẫu nhiên
              </button>
            </div>
          </div>
          <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px]">Quản lý và tiếp tục trải nghiệm những nội dung bạn yêu thích</p>
        </header>

        {/* Custom Library Tabs */}
        <div className="flex items-center gap-10 border-b border-white/5 mb-12 overflow-x-auto hide-scrollbar whitespace-nowrap animate-in fade-in duration-700">
          {(['watching', 'favorite', 'playlist', 'liked'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-5 px-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group",
                activeTab === tab ? "text-primary-container" : "text-on-surface/40 hover:text-on-surface"
              )}
            >
              {tab === 'watching' ? 'Đang theo dõi' : tab === 'favorite' ? 'Yêu thích' : tab === 'playlist' ? 'Danh sách phát' : 'Đã thích'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-container shadow-[0_-5px_15px_rgba(229,9,20,0.5)] rounded-full"></div>
              )}
              {tab === 'watching' && (
                <span className="ml-3 px-2 py-0.5 rounded-full bg-primary-container/10 text-[8px] text-primary-container font-black border border-primary-container/20 animate-pulse">3 MỚI</span>
              )}
            </button>
          ))}
        </div>

        {/* Library Grid */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-8">
            <div className="w-20 h-20 border-4 border-zinc-800 border-t-primary-container rounded-full animate-spin"></div>
            <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Đang đồng bộ hóa thư viện...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-10">
            {activeTab === 'watching' && (
              <>
                {watchHistory?.map((item: any) => renderContentCard(item, 'video'))}
                {readHistory?.map((item: any) => renderContentCard(item, 'book'))}
              </>
            )}
            
            {activeTab === 'favorite' && (
              <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 glass-card rounded-[60px] border border-white/5 border-dashed">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-zinc-800" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black uppercase italic text-on-surface tracking-tighter">Danh sách trống</h3>
                  <p className="text-zinc-500 font-medium max-w-sm uppercase text-[10px] tracking-[0.2em] mx-auto leading-relaxed">
                    Bạn chưa yêu thích nội dung nào. Hãy bắt đầu khám phá và lưu lại những siêu phẩm bạn thích.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Personalized Recommendations (Bento Grid Style) */}
        <section className="mt-32">
          <div className="flex items-center gap-4 mb-10 border-l-4 border-primary-container pl-6">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-on-surface">Dành riêng cho bạn</h2>
            <Sparkles className="w-6 h-6 text-primary-container" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Large Highlight Card */}
            <div className="md:col-span-2 md:row-span-2 relative rounded-[50px] overflow-hidden border border-white/5 group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
                alt="Featured" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-transparent to-transparent p-12 flex flex-col justify-end">
                <span className="text-[10px] font-black text-primary-container uppercase tracking-[0.4em] mb-4">Đề xuất hàng đầu</span>
                <h3 className="text-4xl font-black text-on-surface dark:text-white uppercase italic tracking-tighter mb-6 leading-none">The Last Sentinel:<br/>Final War</h3>
                <p className="text-on-surface/60 dark:text-zinc-400 text-sm font-medium max-w-md mb-10 leading-relaxed">Trải nghiệm chương cuối cùng của series anime đình đám nhất thập kỷ với độ phân giải 4K HDR siêu sắc nét.</p>
                <div className="flex gap-6">
                  <button className="px-10 py-4 bg-primary-container text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/40 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-3">
                    <Play className="w-4 h-4 fill-current" /> XEM NGAY
                  </button>
                  <button className="px-10 py-4 bg-surface-container-highest backdrop-blur-xl border border-outline/10 text-on-surface rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-surface-container transition-all active:scale-95">
                    CHI TIẾT
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Bento Cards */}
            <div className="md:col-span-2 relative rounded-[40px] overflow-hidden bg-gradient-to-br from-purple-900/20 to-zinc-950 p-10 flex flex-col justify-center border border-purple-500/10 group">
              <div className="flex items-center gap-8">
                <div className="w-24 h-36 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl border border-white/5">
                  <img src="https://images.unsplash.com/photo-1543004629-141a045a33dd?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
                <div className="space-y-4">
                  <span className="text-[8px] font-black text-purple-400 uppercase tracking-[0.4em]">Tiếp tục đọc</span>
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Bí mật của những vì sao</h4>
                  <p className="text-xs text-zinc-500 font-medium italic">Bạn đang ở Chương 25/120</p>
                  <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-all">
                    ĐỌC TIẾP <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative rounded-[40px] overflow-hidden bg-zinc-900/50 border border-white/5 p-8 flex flex-col items-center justify-center text-center gap-4 group hover:bg-white/5 transition-all">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-primary-container transition-colors">
                <Plus className="w-8 h-8" />
              </div>
              <h4 className="font-black text-white uppercase italic tracking-tighter text-lg">Tạo danh sách mới</h4>
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">Nhóm các nội dung theo chủ đề</p>
            </div>

            <div className="relative rounded-[40px] overflow-hidden bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-center group hover:bg-white/5 transition-all">
              <div className="flex -space-x-4 mb-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-surface-container overflow-hidden shadow-2xl">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${i}`} className="w-full h-full" alt="" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-[#111316] bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">+12</div>
              </div>
              <p className="text-xs font-medium text-on-surface/60 leading-relaxed uppercase tracking-tighter">
                Bạn bè đang xem <span className="text-on-surface font-black italic">Spider-Man: No Way Home</span>
              </p>
              <button className="mt-4 text-[10px] font-black text-primary-container uppercase tracking-widest hover:underline text-left">
                THAM GIA PHÒNG CHỜ
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
