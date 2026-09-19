"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroBannerProps {
  content?: any;
}

export const HeroBanner = ({ content }: HeroBannerProps) => {
  const data = content || {
    title: "Hành Trình Ánh Sao",
    description: "Khi các vì sao bắt đầu lụi tàn, một nhóm thám hiểm buộc phải dấn thân vào vùng vô tận của vũ trụ để tìm kiếm hy vọng cuối cùng cho nhân loại.",
    backgroundUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJXX3evxuoLBA8DTXSQ-skUzuuxLRViW8D-IHRQT88IA4ZfWU5PWtwLPQ6iFSFcOVK7OdncEhB960JFbLEi5Sorbgvo8IBDI_nwTWG4tWTHWX39EhjWLUSxDyNVZCO5BYZ4txRTcJXEVM71Qar6pLp54CBeYUk4f8C92pjEbxzRY9XocKQvyN33WmCZaJUnd5yK1fUKHXRUZUcv-9jcBOESSwD2y0YtQDUl9s8482iyat83HZXn_lJdjrqSNHb3W82h9i1rL7OZqQ",
    type: "Phim Nổi Bật",
    slug: "hanh-trinh-anh-sao"
  };

  return (
    <section className="relative w-full aspect-[3/4] md:aspect-[21/9] rounded-[32px] overflow-hidden mb-12 shadow-2xl group font-['Be_Vietnam_Pro'] antialiased">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
        style={{ backgroundImage: `url(${data.backgroundUrl || data.posterUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-zinc-950/60 md:via-zinc-950/40 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-8 md:p-16 space-y-4 md:space-y-6">
        <div className="space-y-2">
          <span className="inline-block bg-primary-container text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-[0.2em] shadow-lg">
            {data.type || 'Phim Nổi Bật'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white max-w-2xl drop-shadow-lg leading-tight uppercase italic tracking-tighter">
            {data.title}
          </h1>
          <p className="text-sm md:text-base text-zinc-300 max-w-xl line-clamp-2 font-medium drop-shadow-md">
            {data.description}
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 pb-4 md:pb-0">
          <Link 
            href={`/contents/${data.slug}`}
            className="bg-primary-container text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            Xem ngay
          </Link>
          <button className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white active:scale-95 transition-all">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
      {/* Slider Indicators */}
      <div className="absolute bottom-10 right-10 hidden md:flex gap-2">
        <div className="w-10 h-1 bg-primary-container rounded-full"></div>
        <div className="w-10 h-1 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-all"></div>
        <div className="w-10 h-1 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-all"></div>
      </div>
    </section>
  );
};
