"use client";

import React from 'react';
import useSWR from 'swr';
import { fetchHomeContent } from '@/lib/api';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TrendingUp, Loader2, Star, Play, Flame, Trophy, Crown } from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TrendingPage() {
  const { data, error, isLoading } = useSWR('home_content', fetchHomeContent);

  const trendingItems = data?.trending || [];

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased pb-24 lg:pb-12">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 mt-16 px-4 md:px-8 space-y-12 pt-6 w-full">
        {/* Header Section */}
        <div className="relative p-10 md:p-16 rounded-[40px] overflow-hidden bg-surface-container border border-outline/5 shadow-xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 animate-pulse">
            <Flame className="w-64 h-64 text-primary-container" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-container/20 rounded-3xl border border-primary-container/30 backdrop-blur-xl">
                <TrendingUp className="w-10 h-10 text-primary-container" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-on-surface">Bảng Xếp Hạng</h1>
                <p className="text-on-surface/40 font-black uppercase tracking-[0.3em] text-[10px]">Cập nhật mỗi giờ • CineStream Realtime</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-16 h-16 text-primary-container animate-spin" />
            <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px]">Đang phân tích dữ liệu thị trường...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trendingItems.slice(0, 3).map((item: any, idx: number) => (
                <Link 
                  key={item.id} 
                  href={`/contents/${item.slug}`}
                  className="group relative aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                >
                  <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Rank Badge */}
                  <div className="absolute top-6 left-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container/80 backdrop-blur-2xl border border-outline/10 shadow-2xl">
                    {idx === 0 ? <Crown className="w-8 h-8 text-yellow-500" /> : <span className="text-2xl font-black italic text-on-surface">#{idx + 1}</span>}
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 space-y-3">
                    <span className="px-3 py-1 bg-primary-container text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg">
                      {item.type}
                    </span>
                    <h3 className="text-2xl font-black text-white uppercase italic leading-none tracking-tighter group-hover:text-primary-container transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
                          <span>{item.viewCount?.toLocaleString()} SỨC NÓNG</span>
                       </div>
                       <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-black">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{item.ratingAvg?.toFixed(1) || '0.0'}</span>
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Rest of the Ranking (List View) */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 border-l-4 border-primary-container pl-4 mb-8">
                  <Trophy className="w-5 h-5 text-on-surface/40" />
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-on-surface">Top 10 Thịnh Hành</h2>
               </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {trendingItems.slice(3, 11).map((item: any, idx: number) => (
                    <Link 
                      key={item.id}
                      href={`/contents/${item.slug}`}
                      className="bg-surface-container p-4 rounded-3xl flex items-center gap-6 border border-outline/5 hover:bg-surface-container-high transition-all group active:scale-[0.98] shadow-sm"
                    >
                      <span className="text-3xl font-black italic text-on-surface/20 group-hover:text-primary-container transition-colors w-10 text-center">#{idx + 4}</span>
                      <div className="w-16 h-20 rounded-xl overflow-hidden shadow-lg border border-outline/10 flex-none">
                        <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase italic truncate tracking-tight group-hover:text-primary-container transition-colors">{item.title}</h4>
                         <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest mt-1">{item.type} • {item.releaseYear}</p>
                      </div>
                      <div className="text-right flex-none">
                         <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-black mb-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{item.ratingAvg?.toFixed(1) || '0.0'}</span>
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{item.viewCount?.toLocaleString()} XEM</p>
                      </div>
                    </Link>
                  ))}
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
