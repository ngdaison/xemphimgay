"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ContentCardProps {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrl: string;
  progress?: number;
  type?: 'video' | 'book';
  badge?: string;
  rating?: number;
  views?: string;
  aspect?: 'poster' | 'video' | 'mixed';
  href?: string;
}

export const ContentCard = ({
  title,
  slug,
  subtitle,
  imageUrl,
  progress,
  type = 'video',
  badge,
  rating,
  views,
  aspect = 'poster',
  href
}: ContentCardProps) => {
  const linkHref = href || `/contents/${slug}`;
  if (aspect === 'mixed') {
    return (
      <Link href={linkHref} className="bg-surface-container rounded-3xl overflow-hidden border border-outline/5 hover:border-primary-container/30 transition-all flex h-48 group font-['Be_Vietnam_Pro'] antialiased shadow-xl">
        <div className="w-1/3 relative overflow-hidden">
           <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={imageUrl} />
        </div>
        <div className="w-2/3 p-5 flex flex-col justify-between">
          <div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em]",
              type === 'book' ? "text-secondary" : "text-primary-container"
            )}>
              {type === 'book' ? 'Truyện tranh' : 'Phim Anime'}
            </span>
            <h4 className="font-black text-on-surface mt-1 line-clamp-2 uppercase italic tracking-tighter text-lg leading-tight group-hover:text-primary-container transition-colors">{title}</h4>
            <p className="text-xs text-zinc-500 mt-2 line-clamp-2 font-medium leading-relaxed">{subtitle}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-yellow-500 font-black tracking-widest">{rating ? `${rating} ★` : 'MỚI'}</span>
            <button className="text-[9px] bg-surface-container-highest border border-outline/10 px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-on-surface/50 group-hover:text-white group-hover:bg-primary-container transition-all">
              {type === 'book' ? 'Đọc ngay' : 'Xem ngay'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={linkHref} className="group block h-full font-['Be_Vietnam_Pro'] antialiased">
      <div className={cn(
        "bg-surface-container rounded-[24px] overflow-hidden border border-outline/5 group-hover:border-primary-container/30 transition-all cursor-pointer relative shadow-lg",
        aspect === 'video' ? "aspect-video" : "aspect-[2/3]"
      )}>
        <div className="w-full h-full relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Badge */}
          {badge && (
            <div className="absolute top-3 right-3 bg-primary-container text-[9px] font-black px-2 py-0.5 rounded shadow-xl uppercase tracking-widest text-white">
              {badge}
            </div>
          )}

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900">
              <div className="h-full bg-primary-container shadow-[0_0_10px_rgba(229,9,20,0.8)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
          )}

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-on-surface/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
            <div className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
              <span className="material-symbols-outlined text-3xl text-white fill-current">
                {type === 'video' ? 'play_arrow' : 'menu_book'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Label/Title */}
      <div className="mt-3 px-1 space-y-1">
        <h3 className="font-black text-sm text-on-surface truncate group-hover:text-primary-container transition-colors uppercase italic tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">{subtitle}</p>
        )}
      </div>
    </Link>
  );
};
