"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetchMangaChapter, api } from '@/lib/api';
import { 
  ArrowLeft, 
  Settings, 
  List, 
  MessageSquare, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  ArrowUp,
  Share2,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MangaReader() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const slug = params.slug as string;

  const { data: chapter, error, isLoading } = useSWR(`manga_chapter_${chapterId}`, () => fetchMangaChapter(chapterId));
  
  useEffect(() => {
    if (chapterId) {
      const token = localStorage.getItem('access_token');
      if (token) {
        api.post('/history/read', { 
          mangaChapterId: chapterId,
          pageNum: 1 
        }).catch((err: any) => console.error("Failed to save read history", err));
      }
    }
  }, [chapterId]);

  const [showControls, setShowControls] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;
      
      setScrollProgress(currentProgress);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface p-10 font-['Be_Vietnam_Pro']">
        <div className="bg-error-container/10 border border-error-container/20 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Lỗi tải chương</h2>
          <p className="text-zinc-500 font-medium">Không thể kết nối tới máy chủ để tải nội dung chương này.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-primary-container hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-red-900/20"
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
        <div className="w-20 h-20 border-4 border-zinc-800 border-t-primary-container rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Đang nạp dữ liệu chương...</p>
      </div>
    );
  }

  if (!chapter) return null;

  const chapters = chapter.manga?.chapters || [];
  const currentIdx = chapters.findIndex((c: any) => c.id === chapterId);
  const prevChapter = chapters[currentIdx - 1];
  const nextChapter = chapters[currentIdx + 1];

  return (
    <div className="bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased min-h-screen relative selection:bg-primary-container/30">
      {/* Header (Sticky) */}
      <header className={cn(
        "fixed top-0 w-full z-50 bg-background/80 backdrop-blur-2xl border-b border-outline/5 shadow-2xl flex justify-between items-center px-6 h-16 transition-transform duration-500",
        showControls ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`/contents/${slug}`)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-90 transition-all text-on-surface/50 hover:text-on-surface"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-on-surface uppercase italic truncate max-w-[200px] tracking-tight">{chapter.manga?.content?.title}</h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-container">Chương {chapter.chapterNum}</span>
          </div>
        </div>

        {/* Chapter Selector (Desktop) */}
        <div className="hidden md:flex items-center gap-4 bg-surface-container p-1 rounded-full border border-outline/10">
          <button 
            disabled={!prevChapter}
            onClick={() => router.push(`/read/manga/${slug}/${prevChapter.id}`)}
            className="p-2 text-on-surface/40 hover:text-on-surface disabled:opacity-20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <select 
              value={chapterId}
              onChange={(e) => router.push(`/read/manga/${slug}/${e.target.value}`)}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-on-surface appearance-none cursor-pointer px-4 pr-8 focus:ring-0"
            >
              {chapters.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-surface text-on-surface">Chương {c.chapterNum}</option>
              ))}
            </select>
          </div>
          <button 
            disabled={!nextChapter}
            onClick={() => router.push(`/read/manga/${slug}/${nextChapter.id}`)}
            className="p-2 text-primary-container hover:text-red-400 disabled:opacity-20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-surface-container transition-colors rounded-full text-on-surface/50 hover:text-on-surface">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2.5 hover:bg-surface-container transition-colors rounded-full text-on-surface/50 hover:text-on-surface">
            <Sun className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-outline/10 ml-2">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Side Quick Tools (Left) */}
      <aside className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4">
        <div className="bg-surface-container/60 backdrop-blur-2xl p-3 rounded-2xl flex flex-col gap-4 shadow-2xl border border-outline/10">
          <button className="p-3 text-on-surface/40 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all group relative">
            <List className="w-6 h-6" />
            <span className="absolute left-16 px-3 py-1 bg-surface-container text-on-surface text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-outline/10 whitespace-nowrap uppercase tracking-widest pointer-events-none">Mục lục</span>
          </button>
          <button className="p-3 text-on-surface/40 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all group relative">
            <Heart className="w-6 h-6" />
            <span className="absolute left-16 px-3 py-1 bg-surface-container text-on-surface text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-outline/10 whitespace-nowrap uppercase tracking-widest pointer-events-none">Yêu thích</span>
          </button>
          <button className="p-3 text-on-surface/40 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all group relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute left-16 px-3 py-1 bg-surface-container text-on-surface text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-outline/10 whitespace-nowrap uppercase tracking-widest pointer-events-none">Bình luận</span>
          </button>
          <button className="p-3 text-on-surface/40 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all group relative">
            <Share2 className="w-6 h-6" />
            <span className="absolute left-16 px-3 py-1 bg-surface-container text-on-surface text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-outline/10 whitespace-nowrap uppercase tracking-widest pointer-events-none">Chia sẻ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pt-16 pb-32 flex flex-col items-center">
        {/* Manga Canvas */}
        <div className="w-full max-w-screen-md flex flex-col items-center shadow-2xl bg-surface">
          {chapter.pages?.map((page: any, index: number) => (
            <img 
              key={page.id || index}
              src={page.imageUrl} 
              alt={`Page ${index + 1}`} 
              className="w-full h-auto block border-none transition-opacity duration-1000"
              loading={index < 3 ? "eager" : "lazy"}
              onClick={() => setShowControls(!showControls)}
            />
          ))}
          
          {/* End of Chapter Navigation */}
          <div className="w-full px-8 py-20 flex flex-col items-center gap-10 bg-surface-container/30 border-t border-outline/5">
            <div className="flex items-center gap-6 w-full max-w-lg">
              <div className="h-px flex-1 bg-outline/10"></div>
              <span className="text-on-surface/40 font-bold uppercase tracking-[0.4em] text-[10px] whitespace-nowrap">Hết chương {chapter.chapterNum}</span>
              <div className="h-px flex-1 bg-outline/10"></div>
            </div>
 
            <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
              <button 
                disabled={!prevChapter}
                onClick={() => router.push(`/read/manga/${slug}/${prevChapter.id}`)}
                className="flex items-center justify-center gap-4 px-6 py-6 bg-surface-container border border-outline/10 rounded-2xl text-on-surface hover:bg-surface-container-high transition-all active:scale-95 group disabled:opacity-20"
              >
                <ArrowLeft className="w-6 h-6 text-on-surface/40 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest">Trước đó</p>
                  <p className="font-bold text-sm">Chương {prevChapter?.chapterNum || '??'}</p>
                </div>
              </button>
              <button 
                disabled={!nextChapter}
                onClick={() => router.push(`/read/manga/${slug}/${nextChapter.id}`)}
                className="flex items-center justify-center gap-4 px-6 py-6 bg-primary-container rounded-2xl text-white hover:bg-red-700 transition-all active:scale-95 group shadow-xl shadow-red-900/20 disabled:opacity-20"
              >
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Tiếp theo</p>
                  <p className="font-bold text-sm">Chương {nextChapter?.chapterNum || '??'}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
 
        {/* Comments Section */}
        <section className="w-full max-w-screen-md px-6 mt-16 space-y-10">
          <div className="flex items-center justify-between border-l-4 border-primary-container pl-6">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-on-surface">Bình luận (1,429)</h3>
            <div className="flex gap-4">
              <button className="text-[10px] font-black text-primary-container border-b-2 border-primary-container pb-1 uppercase tracking-widest">Mới nhất</button>
              <button className="text-[10px] font-black text-zinc-500 hover:text-on-surface transition-colors uppercase tracking-widest">Phổ biến</button>
            </div>
          </div>
          
          <div className="bg-surface-container/40 border border-outline/10 rounded-3xl p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex-shrink-0 flex items-center justify-center overflow-hidden border border-outline/10">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reader" alt="User" className="w-full h-full" />
              </div>
              <textarea 
                className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface text-sm font-medium placeholder:text-on-surface/40 resize-none min-h-[80px]" 
                placeholder="Chia sẻ cảm nghĩ của bạn về chương này..."
              />
            </div>
            <div className="flex justify-end pt-4 border-t border-outline/10">
              <button className="px-8 py-3 bg-primary-container text-white font-black rounded-xl hover:shadow-xl hover:shadow-red-900/40 transition-all active:scale-95 text-[10px] uppercase tracking-widest">Gửi bình luận</button>
            </div>
          </div>
 
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Reader${i}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-on-surface uppercase italic tracking-tight">ShadowMonarch_{i}</h4>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{i} giờ trước</span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">Art chương này đỉnh thực sự, phân cảnh Jin-Woo bộc phát sát khí nhìn sởn gai ốc luôn. Mong chờ chap sau quá!</p>
                  <div className="flex gap-6 pt-2">
                    <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-primary-container transition-colors uppercase tracking-widest">
                      <Heart className="w-4 h-4" /> {142 * i}
                    </button>
                    <button className="text-[10px] font-black text-zinc-500 hover:text-on-surface transition-colors uppercase tracking-widest">Trả lời</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Reader Progress Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-zinc-950 z-[100]">
        <div 
          className="h-full bg-primary-container shadow-[0_0_15px_rgba(229,9,20,0.8)] transition-all duration-300" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Floating Bottom Nav (Contextual) */}
      <nav className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-surface-container/90 backdrop-blur-2xl border border-outline/10 p-2 rounded-2xl shadow-2xl transition-all duration-500",
        showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 hover:bg-surface-container-high rounded-xl transition-all text-on-surface/40 hover:text-on-surface group"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
        <div className="w-px h-8 bg-outline/10 mx-2"></div>
        <button 
          disabled={!prevChapter}
          onClick={() => router.push(`/read/manga/${slug}/${prevChapter.id}`)}
          className="px-4 py-2 hover:bg-surface-container-high rounded-xl transition-all text-on-surface/60 hover:text-on-surface text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
        >
          Trước
        </button>
        <div className="px-6 py-2 bg-primary-container/10 text-primary-container rounded-xl font-black text-[10px] border border-primary-container/30 uppercase tracking-widest">
          {chapter.chapterNum} / {chapters.length}
        </div>
        <button 
          disabled={!nextChapter}
          onClick={() => router.push(`/read/manga/${slug}/${nextChapter.id}`)}
          className="px-4 py-2 hover:bg-surface-container-high rounded-xl transition-all text-on-surface/60 hover:text-on-surface text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
        >
          Sau
        </button>
        <div className="w-px h-8 bg-outline/10 mx-2"></div>
        <button className="p-3 hover:bg-surface-container-high rounded-xl transition-all text-on-surface/40 hover:text-on-surface">
          <MessageSquare className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
