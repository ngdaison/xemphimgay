"use client";

import React, { useState } from 'react';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Loader2, TrendingUp, Sparkles, Clock, Star, PlayCircle, ChevronRight, Play, Plus, BookOpen, Flame, Trophy, Info } from "lucide-react";
import useSWR from 'swr';
import { fetchHomeContent, api } from '@/lib/api';
import { cn } from "@/lib/utils";
import Link from 'next/link';

export default function Home() {
  const { data, error, isLoading } = useSWR('home_content', fetchHomeContent);
  // Fetch user watch/read history for Continue Watching
  const { data: watchHistory } = useSWR('home_watch_history', () =>
    api.get('/history/watch?limit=4').then(res => res.data).catch(() => [])
  );
  const { data: readHistory } = useSWR('home_read_history', () =>
    api.get('/history/read?limit=4').then(res => res.data).catch(() => [])
  );

  const continueItems = [
    ...(Array.isArray(watchHistory) ? watchHistory.slice(0, 4) : []),
    ...(Array.isArray(readHistory) ? readHistory.slice(0, 4) : []),
  ].slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [targetSlide, setTargetSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const featured = data?.featured || [];
  const slides = featured.slice(0, 5);

  const autoSlideTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    if (autoSlideTimerRef.current) clearTimeout(autoSlideTimerRef.current);
    if (isPaused) return;
    
    autoSlideTimerRef.current = setTimeout(() => {
      handleNext();
    }, 10000);
  };

  React.useEffect(() => {
    if (slides.length > 0 && !isPaused) {
      startAutoSlide();
    }
    return () => {
      if (autoSlideTimerRef.current) clearTimeout(autoSlideTimerRef.current);
    };
  }, [slides.length, isPaused]);

  const handleNext = () => {
    const nextIdx = (currentSlide + 1) % slides.length;
    goToSlide(nextIdx);
  };

  const transitionTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const lastClickRef = React.useRef<number>(0);

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    
    // Throttle very fast clicks (less than 50ms) to prevent event spam
    const now = Date.now();
    if (now - lastClickRef.current < 50) return;
    lastClickRef.current = now;

    // If already transitioning, sync immediately
    if (isTransitioning) {
      setCurrentSlide(targetSlide);
      setIsTransitioning(false);
    }

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

    // Determine direction
    let newDirection: 'next' | 'prev' = 'next';
    if (currentSlide === slides.length - 1 && idx === 0) {
      newDirection = 'next';
    } else if (currentSlide === 0 && idx === slides.length - 1) {
      newDirection = 'prev';
    } else {
      newDirection = idx > currentSlide ? 'next' : 'prev';
    }

    setDirection(newDirection);
    setTargetSlide(idx);
    setPrevSlide(currentSlide);
    
    // Restart auto-slide timer on manual interaction
    startAutoSlide();

    // Force a reflow and wait for next frame to ensure smooth transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    });

    fallbackTimerRef.current = setTimeout(() => {
      setCurrentSlide(idx);
      setIsTransitioning(false);
    }, 850); 
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return;
    
    if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      setCurrentSlide(targetSlide);
      setIsTransitioning(false);
      // Restart timer after transition ends to keep it in sync
      startAutoSlide();
    }
  };

  if (error) {
    const statusCode = (error as any)?.response?.status;
    const is404 = statusCode === 404;
    const is500 = statusCode === 500;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface p-10 font-['Be_Vietnam_Pro']">
        <div className="bg-error-container/10 border border-error-container/20 p-8 rounded-2xl max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">
            {is500 ? 'Máy chủ đang gặp sự cố' : is404 ? 'Nội dung chưa sẵn sàng' : 'Lỗi kết nối hệ thống'}
          </h2>
          <p className="text-zinc-500 text-sm">
            {is500
              ? 'Kiểm tra server API đã chạy prisma generate && chạy lại pnpm dev chưa?'
              : is404
                ? 'Dữ liệu chưa được đồng bộ hoặc không tồn tại.'
                : 'Không thể nạp dữ liệu từ máy chủ.'}
          </p>
          <div className="text-[10px] text-zinc-700 bg-black/20 p-2 rounded border border-white/5 font-mono break-all">
             Error: {error?.message || "Unknown Error"} {statusCode ? `(HTTP ${statusCode})` : ''}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-container hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-widest text-xs"
          >
            TẢI LẠI TRANG
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 font-['Be_Vietnam_Pro']">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-zinc-800 border-t-primary-container rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-primary-container/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-[10px] animate-pulse">Nạp năng lượng điện ảnh...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased selection:bg-primary-container/30">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 mt-16 min-h-screen">
        {/* Hero Banner Slider Section */}
        <section 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[700px] overflow-hidden group bg-background"
        >
          {/* Slides Container - Dynamic 3-Slot Carousel Logic */}
          <div 
            onTransitionEnd={handleTransitionEnd}
            className={cn(
              "flex h-full will-change-transform",
              isTransitioning ? "transition-transform duration-700 ease-in-out" : "transition-none"
            )}
            style={{ 
              width: '300%',
              transform: !isTransitioning 
                ? 'translateX(-33.333%)' 
                : (direction === 'next' ? 'translateX(-66.666%)' : 'translateX(0%)')
            }}
          >
            {[0, 1, 2].map((slotIdx) => {
              let slideIdx = currentSlide;
              
              if (isTransitioning) {
                if (direction === 'next') {
                  if (slotIdx === 1) slideIdx = currentSlide;
                  else if (slotIdx === 2) slideIdx = targetSlide;
                  else slideIdx = (currentSlide - 1 + slides.length) % slides.length;
                } else {
                  if (slotIdx === 0) slideIdx = targetSlide;
                  else if (slotIdx === 1) slideIdx = currentSlide;
                  else slideIdx = (currentSlide + 1) % slides.length;
                }
              } else {
                if (slotIdx === 0) slideIdx = (currentSlide - 1 + slides.length) % slides.length;
                else if (slotIdx === 1) slideIdx = currentSlide;
                else slideIdx = (currentSlide + 1) % slides.length;
              }

              const item = slides[slideIdx];
              if (!item) return <div key={slotIdx} className="w-1/3 h-full flex-shrink-0" />;
              
              return (
                <div key={slotIdx} className="relative w-1/3 h-full flex-shrink-0">
                  <div className="absolute inset-0 z-0">
                    <img
                      src={item.backgroundUrl || item.posterUrl}
                      alt=""
                      className="w-full h-full object-cover animate-in fade-in duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                  </div>
                  
                  <div className={cn(
                    "absolute inset-0 flex flex-col justify-end pb-24 px-8 md:px-16 space-y-8",
                    !isTransitioning && slotIdx === 1 ? "animate-in fade-in slide-in-from-bottom-4 duration-700" : ""
                  )}>
                    <div className="space-y-4 max-w-4xl">
                      <div className="flex items-center gap-3">
                        <span className="inline-block bg-primary-container text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                          {item.type} NỔI BẬT
                        </span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/90">4K Ultra HD</span>
                        </div>
                      </div>
                      <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] drop-shadow-2xl tracking-tighter italic uppercase">
                        {item.title}
                      </h1>
                      <p className="text-white/80 text-xl font-medium line-clamp-2 leading-relaxed max-w-3xl drop-shadow-md">
                        {item.description || "Hành trình khám phá những vùng đất mới đầy rãy nguy hiểm và kịch tính đang chờ đón bạn."}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <Link
                        href={`/contents/${item.slug}`}
                        className="bg-primary-container text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-red-700 transition-all hover:shadow-[0_0_40px_rgba(229,9,20,0.4)] active:scale-95 group/btn cursor-pointer shadow-2xl"
                      >
                        <Play className="w-6 h-6 fill-current group-hover/btn:scale-110 transition-transform" />
                        XEM NGAY
                      </Link>
                      <Link 
                        href={`/contents/${item.slug}`}
                        className="bg-white/5 hover:bg-white/10 dark:bg-black/40 backdrop-blur-3xl text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border border-white/20 transition-all active:scale-95 shadow-2xl cursor-pointer flex items-center gap-3 group/info"
                      >
                        <Info className="w-6 h-6 group-hover/info:rotate-12 transition-transform" />
                        CHI TIẾT
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-12 right-8 md:right-16 flex items-end gap-3 z-30">
            {slides.map((item: any, idx: number) => {
              const isActive = isTransitioning ? targetSlide === idx : currentSlide === idx;
              return (
                <button 
                  key={item.id}
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    "relative group transition-all duration-300 cursor-pointer",
                    isActive ? "w-24 md:w-28 -translate-y-2" : "w-14 md:w-16 opacity-60 hover:opacity-100 hover:scale-110"
                  )}
                >
                  <div className={cn(
                    "aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-2xl",
                    isActive ? "border-primary-container scale-105" : "border-white/20 scale-100"
                  )}>
                    <img src={item.backgroundUrl || item.posterUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-3 left-0 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-container"
                        style={{ animation: 'progress-timer 9.8s linear forwards' }}
                        key={isTransitioning ? targetSlide : currentSlide}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </section>

        <div className="px-8 pb-12 space-y-12">

        {/* Trending Section - Compact Row Layout */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary-container" />
              <h2 className="text-xl font-bold text-on-surface">Thịnh hành hôm nay</h2>
            </div>
            <Link href="/trending" className="text-primary-container text-xs font-bold hover:underline">Xem tất cả</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data?.trending?.slice(0, 5).map((item: any, idx: number) => (
              <Link 
                key={item.id}
                href={`/contents/${item.slug}`}
                className="group space-y-3"
              >
                <div className="relative aspect-[10/14] rounded-2xl overflow-hidden border border-outline/5 shadow-md group-hover:shadow-xl transition-all duration-500">
                  <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute top-3 left-3 w-8 h-8 bg-surface-container/90 backdrop-blur-md rounded-xl flex items-center justify-center border border-outline/10 z-10 shadow-lg">
                    <span className={cn(
                      "text-sm font-black italic",
                      idx === 0 ? "text-primary-container" : "text-on-surface"
                    )}>{idx + 1}</span>
                  </div>
                  <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="text-sm font-black text-on-surface group-hover:text-primary-container transition-colors line-clamp-2 uppercase italic tracking-tight">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.type}</span>
                    <span className="w-1 h-1 rounded-full bg-outline/20"></span>
                    <span className="text-[10px] text-primary-container font-black">{item.ratingAvg?.toFixed(1)} ★</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Updates Section - Horizontal Scroll */}
        <section className="mb-12">
           <div className="flex items-center gap-3 mb-6">
             <Clock className="w-6 h-6 text-primary-container" />
             <h2 className="text-2xl font-bold text-on-surface">Mới cập nhật</h2>
           </div>
           <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
              {data?.newUpdates?.map((item: any) => (
                <Link key={item.id} href={`/contents/${item.slug}`} className="flex-none w-44 space-y-3 group">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden relative shadow-lg ring-1 ring-white/10 group-hover:ring-primary-container/50 transition-all">
                    <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                    <div className="absolute top-2 right-2 bg-primary-container text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tighter">Mới</div>
                    <div className="absolute inset-0 bg-on-surface/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-sm">
                      <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="px-1">
                    <h4 className="font-bold text-sm truncate group-hover:text-primary-container transition-colors">{item.title}</h4>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-1">{item.type} • {item.releaseYear}</p>
                  </div>
                </Link>
              ))}
           </div>
        </section>

        {/* Infinite Feed - Mixed Content Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Dành cho bạn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Novel/Story Card */}
            {data?.newStories?.slice(0, 2).map((item: any) => (
              <Link 
                key={item.id}
                href={`/contents/${item.slug}`}
                className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant hover:border-primary-container transition-all flex h-48 group shadow-sm"
              >
                <div className="w-1/3 overflow-hidden">
                   <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-tertiary font-bold uppercase tracking-widest">Truyện chữ</span>
                    <h4 className="font-bold text-on-surface mt-1 line-clamp-2 group-hover:text-primary-container transition-colors">{item.title}</h4>
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{item.description || "Hàng ngàn năm sau khi thế giới lụi tàn..."}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-container font-bold">{item.ratingAvg?.toFixed(1) || '4.8'} ★</span>
                    <button className="text-xs bg-surface-container-highest text-on-surface px-3 py-1 rounded-full hover:bg-primary-container hover:text-white transition-colors">Đọc ngay</button>
                  </div>
                </div>
              </Link>
            ))}

            {/* Anime/Movie Video Item */}
            {data?.newManga?.slice(0, 2).map((item: any) => (
              <Link 
                key={item.id}
                href={`/contents/${item.slug}`}
                className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant hover:border-primary-container transition-all group shadow-sm relative"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute bottom-2 right-2 bg-on-surface/70 dark:bg-black/70 text-white dark:text-on-surface text-[10px] px-2 py-1 rounded">24:05</div>
                  <div className="absolute inset-0 bg-on-surface/10 group-hover:bg-on-surface/30 transition-colors"></div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] text-primary-container font-bold uppercase tracking-widest">Anime</span>
                  <h4 className="font-bold text-on-surface mt-1 truncate group-hover:text-primary-container transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-[10px] text-white font-bold">CS</div>
                    <span className="text-[10px] text-zinc-500">CineStream Original</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cinematic Footer */}
        <footer className="w-full mt-auto border-t border-outline/10 bg-surface flex flex-col md:flex-row justify-between items-center px-12 py-8 ml-0 rounded-t-3xl">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-on-surface text-lg">CineStream</span>
            <p className="text-xs uppercase tracking-widest text-on-surface/50">© 2026 CineStream. Cinematic & Immersive Experiences.</p>
          </div>
          <div className="flex gap-8 mt-6 md:mt-0">
            {['Movies', 'Anime', 'Comics', 'About Us', 'Privacy'].map(link => (
              <a key={link} className="text-xs uppercase tracking-widest text-on-surface/50 hover:text-primary-container transition-colors" href="#">
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </main>
  </div>
  );
}
