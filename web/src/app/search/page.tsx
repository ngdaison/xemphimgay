"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { 
  Search as SearchIcon, 
  Filter,
  Loader2,
  Frown,
  Mic,
  TrendingUp,
  Star,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);

  const { data, error, isLoading } = useSWR(
    query ? `search_${query}_${type}` : null,
    () => api.get(`/search?q=${query}&type=${type}`).then(res => res.data)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set('q', searchTerm);
    else params.delete('q');
    router.push(`/search?${params.toString()}`);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'Tất cả' && value !== 'Tất cả nội dung') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased flex flex-col">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 mt-16 flex-1 flex flex-col min-h-screen">
        {/* Search Hero Section */}
        <section className="relative px-8 md:px-16 py-16 bg-gradient-to-br from-primary-container/10 via-secondary-container/5 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.05),transparent)] pointer-events-none"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-on-surface mb-3">Kết quả tìm kiếm</h1>
              <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px]">
                Tìm thấy <span className="text-primary-container font-black">{data?.items?.length || 0}</span> nội dung phù hợp cho từ khóa của bạn
              </p>
            </div>

            {/* Large Search Input */}
            <form onSubmit={handleSearch} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-container to-secondary-container rounded-full blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-surface-container border border-outline/10 rounded-full px-8 h-20 shadow-2xl shadow-black/10">
                <Search className="w-8 h-8 text-zinc-600 mr-6 group-focus-within:text-primary-container transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 w-full text-on-surface text-xl font-black placeholder-on-surface/20 uppercase italic tracking-tighter" 
                  placeholder="Tìm kiếm phim, truyện, anime..." 
                />
                <button 
                  type="submit"
                  className="bg-primary-container text-white px-10 h-12 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-900/40"
                >
                  TÌM KIẾM
                </button>
              </div>
            </form>

            {/* Filters Row */}
            <div className="mt-10 flex flex-wrap gap-4 items-center animate-in fade-in duration-1000">
              <div className="flex items-center gap-3 text-zinc-600 mr-2">
                <Filter className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Bộ lọc:</span>
              </div>
              <select 
                value={type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="bg-surface-container text-on-surface border border-outline/10 rounded-xl px-5 h-10 text-[10px] font-black uppercase tracking-widest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none cursor-pointer transition-all"
              >
                <option value="">Tất cả nội dung</option>
                <option value="MOVIE">Phim lẻ</option>
                <option value="ANIME">Anime</option>
                <option value="MANGA">Truyện tranh</option>
                <option value="STORY">Truyện chữ</option>
              </select>
              <select 
                className="bg-surface-container text-on-surface border border-outline/10 rounded-xl px-5 h-10 text-[10px] font-black uppercase tracking-widest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none cursor-pointer transition-all"
                onChange={(e) => updateFilter('genre', e.target.value)}
              >
                <option value="">Tất cả thể loại</option>
                <option value="hanh-dong">Hành động</option>
                <option value="fantasy">Fantasy</option>
                <option value="lang-man">Lãng mạn</option>
                <option value="kinh-di">Kinh dị</option>
              </select>
              <button 
                onClick={() => router.push('/search')}
                className="ml-auto text-zinc-600 hover:text-primary-container text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> LÀM MỚI BỘ LỌC
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="px-8 md:px-16 py-16 flex-1 bg-background">
          <div className="flex items-center gap-4 mb-12 border-l-4 border-primary-container pl-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-on-surface">
              {query ? `Kết quả cho "${query}"` : "Khám phá xu hướng"}
            </h2>
            <Sparkles className="w-5 h-5 text-primary-container" />
          </div>

          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-8">
              <div className="w-20 h-20 border-4 border-zinc-800 border-t-primary-container rounded-full animate-spin"></div>
              <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Đang quét cơ sở dữ liệu CineStream...</p>
            </div>
          ) : data?.items?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
              {data.items.map((item: any, idx: number) => {
                const isWide = idx % 9 === 0;
                return (
                  <Link 
                    key={item.id}
                    href={`/contents/${item.slug}`}
                    className={cn(
                      "group relative rounded-[40px] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.03] border border-white/5",
                      isWide ? "md:col-span-2 aspect-video" : "aspect-[2/3]"
                    )}
                  >
                    <img 
                      src={item.posterUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
                      alt={item.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent dark:from-black dark:via-black/20 opacity-80"></div>
                    
                    {/* Hover Info */}
                    <div className="absolute inset-0 bg-primary-container/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <div className="w-16 h-16 bg-surface text-primary-container rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                          <Search className="w-8 h-8 fill-current" />
                       </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                      <span className={cn(
                        "px-3 py-1 text-[8px] font-black rounded-lg uppercase tracking-widest mb-2 inline-block shadow-2xl",
                        item.type === 'MOVIE' || item.type === 'ANIME' ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                      )}>
                        {item.type}
                      </span>
                      <h3 className="text-xl font-black text-on-surface dark:text-white leading-tight uppercase italic truncate drop-shadow-2xl group-hover:text-primary-container transition-colors tracking-tighter">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                         <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                            {item.releaseYear || '2024'} • {item.type === 'STORY' || item.type === 'MANGA' ? '120 Chương' : '2h 15m'}
                         </p>
                         <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-black">
                            <Star className="w-3 h-3 fill-current" />
                            <span>8.9</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : query ? (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 glass-card rounded-[60px] border border-white/5 border-dashed">
               <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center">
                  <Frown className="w-16 h-16 text-zinc-800" />
               </div>
               <div className="space-y-3">
                 <h3 className="text-3xl font-black uppercase italic text-on-surface tracking-tighter">Không tìm thấy nội dung</h3>
                 <p className="text-zinc-500 font-medium max-w-sm uppercase text-[10px] tracking-[0.2em] mx-auto leading-relaxed">
                   Chúng tôi đã lật tung vũ trụ nhưng không tìm thấy "{query}". Hãy thử tìm kiếm với từ khóa khác.
                 </p>
               </div>
               <button 
                onClick={() => setSearchTerm('')}
                className="px-12 py-4 bg-surface-container text-on-surface rounded-2xl font-black text-xs uppercase tracking-widest border border-outline/10 hover:bg-surface-container-high transition-all active:scale-95"
               >
                 XÓA TÌM KIẾM
               </button>
            </div>
          ) : null}
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-outline/10 bg-surface py-16 px-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black text-on-surface italic tracking-tighter uppercase">CineStream</h2>
            <p className="text-on-surface/40 text-[10px] uppercase tracking-[0.3em]">© 2024 Cinematic & Immersive Experiences</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Movies', 'Anime', 'Comics', 'About', 'Privacy', 'Contact'].map(link => (
              <Link key={link} href="#" className="text-zinc-500 hover:text-primary-container text-[10px] font-black uppercase tracking-widest transition-colors">{link}</Link>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
