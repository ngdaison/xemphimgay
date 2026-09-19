"use client";

import React, { useState } from 'react';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ContentCard } from "@/components/ContentCard";
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { Loader2, Filter, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';

const GENRES = ['Tất cả', 'Hành động', 'Hài hước', 'Kinh dị', 'Lãng mạn', 'Viễn tưởng', 'Tâm lý', 'Manhwa', 'Manhua', 'Mecha'];
const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'latest' },
  { label: 'Phổ biến nhất', value: 'popular' },
  { label: 'Đánh giá cao', value: 'top_rated' },
];

export default function MangaPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [genre, setGenre] = useState('Tất cả');
  const [sort, setSort] = useState('latest');
  const [year, setYear] = useState('');

  const queryParams = new URLSearchParams({ type: 'MANGA' });
  if (genre !== 'Tất cả') queryParams.set('genre', genre);
  if (sort) queryParams.set('sort', sort);
  if (year) queryParams.set('year', year);

  const { data, error, isLoading } = useSWR(
    `/contents?${queryParams.toString()}`,
    (url) => api.get(url).then(res => res.data)
  );

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <Sidebar />

      <main className={cn(
        "transition-all duration-300 pt-20 pb-20",
        "ml-0 lg:ml-64 px-4 md:px-10"
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-on-surface">Truyện Tranh</h1>
            <p className="text-zinc-500 text-sm mt-1">Tổng hợp Manga, Manhwa, Manhua hot nhất hiện nay.</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all self-start text-on-surface border",
              showFilters
                ? "bg-primary-container text-white border-primary-container"
                : "bg-surface-container hover:bg-surface-container-high border-outline/10"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
          </button>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 bg-surface-container border border-outline/10 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Thể loại</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:border-primary-container transition-all"
              >
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sắp xếp</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:border-primary-container transition-all"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Năm phát hành</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="VD: 2024"
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:border-primary-container transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs animate-pulse font-['Be_Vietnam_Pro']">Đang tải truyện tranh...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center bg-red-500/5 border border-red-500/10 rounded-3xl space-y-4">
             <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
              </div>
             <p className="text-zinc-400 font-bold uppercase tracking-tight">Không thể tải danh sách truyện</p>
             <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white font-black px-8 py-3 rounded-xl transition-all uppercase tracking-widest text-[10px]"
              >
                TẢI LẠI TRANG
              </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {data?.data?.map((content: any) => (
              <ContentCard key={content.id} title={content.title} slug={content.slug} imageUrl={content.posterUrl} badge="Manga" href={`/truyen-tranh/${content.slug}`} />
            ))}

            {(!data?.data || data.data.length === 0) && (
              <div className="col-span-full py-20 text-center bg-surface-container/50 border border-outline/10 border-dashed rounded-3xl">
                <p className="text-on-surface/40 font-bold italic uppercase tracking-widest text-xs">Chưa có truyện nào trong danh mục này.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
