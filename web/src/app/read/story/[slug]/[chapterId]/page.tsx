"use client";

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { 
  ChevronRight, 
  Settings, 
  ArrowUp, 
  MessageSquare, 
  Heart, 
  Eye, 
  Clock, 
  User,
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { fetchStoryChapter, api } from '@/lib/api';
import Link from 'next/link';

import { useTheme } from '@/components/ThemeProvider';

export default function StoryReader() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const slug = params.slug as string;
  const { theme: globalTheme } = useTheme();
  
  const [fontSize, setFontSize] = useState(20);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>(globalTheme as 'dark' | 'sepia' | 'light');
  const [fontFamily, setFontFamily] = useState('font-be-vietnam');
  const [showSettings, setShowSettings] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { data: chapter, error, isLoading } = useSWR(`chapter_${chapterId}`, () => fetchStoryChapter(chapterId));

  useEffect(() => {
    setTheme(globalTheme);
  }, [globalTheme]);

  useEffect(() => {
    if (chapterId) {
      const token = localStorage.getItem('access_token');
      if (token) {
        api.post('/history/read', { 
          storyChapterId: chapterId,
          pageNum: 1 
        }).catch(err => console.error("Failed to save read history", err));
      }
    }
  }, [chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 font-['Be_Vietnam_Pro']">
        <div className="w-20 h-20 border-4 border-zinc-800 border-t-primary-container rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Đang nạp chương truyện...</p>
      </div>
    );
  }

  if (!chapter) return null;

  const themes: Record<string, string> = {
    dark: "bg-background text-on-surface",
    sepia: "bg-[#f4f1ea] text-[#2d2a26]",
    light: "bg-white text-zinc-900",
  };

  const story = chapter.story;
  const chapters = story.chapters || [];
  const currentIdx = chapters.findIndex((c: any) => c.id === chapterId);
  const prevChapter = chapters[currentIdx - 1];
  const nextChapter = chapters[currentIdx + 1];

  return (
    <div className={cn("min-h-screen transition-colors duration-500 selection:bg-primary-container/30", themes[theme])}>
      {/* Scroll Progress Indicator (Top) */}
      <div 
        className="fixed top-0 left-0 h-[4px] bg-primary-container z-[100] transition-all duration-300 shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
        style={{ width: `${scrollProgress}%` }}
      ></div>
      
      <Header />

      {/* Floating Sidebar Controls */}
      <aside className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40">
        <div className="bg-surface-container/60 backdrop-blur-2xl p-3 rounded-2xl flex flex-col gap-4 shadow-2xl border border-outline/10 transition-all hover:bg-surface-container">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 text-on-surface/40 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all group relative"
          >
            <Settings className="w-6 h-6" />
            <span className="absolute left-16 px-3 py-1 bg-surface-container text-on-surface text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-outline/10 whitespace-nowrap uppercase tracking-widest pointer-events-none">Cài đặt</span>
          </button>
          <button className="p-3 text-on-surface/40 hover:text-primary-container hover:bg-primary-container/10 rounded-xl transition-all group relative">
            <BookOpen className="w-6 h-6" />
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
        </div>
      </aside>
      
      <main className={cn("max-w-[800px] mx-auto px-6 pt-32 pb-32 transition-all duration-300 font-['Be_Vietnam_Pro']", fontFamily)}>
        {/* Breadcrumbs & Meta */}
        <div className="mb-16 text-center space-y-6">
          <nav className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-primary-container transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/contents/${slug}`} className="hover:text-primary-container transition-colors truncate max-w-[200px]">{story.content.title}</Link>
          </nav>
          <div className="space-y-3">
            <h2 className="text-primary-container font-black uppercase tracking-[0.2em] text-xs">Chương {chapter.chapterNum}</h2>
            <h1 className={cn(
              "text-4xl md:text-5xl font-black leading-tight tracking-tight",
              theme === 'dark' ? "text-white" : "text-inherit"
            )}>
              {chapter.title}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-primary-container" /> {story.content.author || 'Thanh Sơn'}</span>
            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary-container" /> {new Date(chapter.createdAt).toLocaleDateString('vi-VN')}</span>
            <span className="flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-primary-container" /> 12.5k</span>
          </div>
        </div>

        {/* Reader Controls (Top) */}
        <div className={cn(
          "flex items-center justify-between py-6 border-y mb-12",
          theme === 'dark' ? "border-zinc-800" : "border-zinc-200"
        )}>
          <button 
            disabled={!prevChapter}
            onClick={() => router.push(`/read/story/${slug}/${prevChapter.id}`)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20",
              theme === 'dark' ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <ArrowLeft className="w-4 h-4" /> Chương trước
          </button>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex p-1 rounded-xl",
              theme === 'dark' ? "bg-zinc-900" : "bg-zinc-100"
            )}>
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-3 py-1.5 hover:bg-primary-container/10 rounded-lg text-xs font-bold transition-all"
              >
                100%
              </button>
              <button className="px-3 py-1.5 bg-primary-container text-white rounded-lg text-xs font-bold shadow-lg shadow-red-900/20">Gốc</button>
              <button 
                onClick={() => setFontSize(prev => Math.min(30, prev + 2))}
                className="px-3 py-1.5 hover:bg-primary-container/10 rounded-lg text-xs font-bold transition-all"
              >
                120%
              </button>
            </div>
          </div>

          <button 
            disabled={!nextChapter}
            onClick={() => router.push(`/read/story/${slug}/${nextChapter.id}`)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-container hover:bg-red-700 rounded-full text-white text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-900/20 disabled:opacity-20"
          >
            Chương sau <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={cn(
            "border rounded-2xl p-8 mb-16 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-500",
            theme === 'dark' ? "bg-zinc-900/50 border-zinc-800" : "bg-white/80 backdrop-blur-md border-zinc-200"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest">Font Chữ</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setFontFamily('font-be-vietnam')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                      fontFamily === 'font-be-vietnam' 
                        ? "bg-primary-container border-primary-container text-white shadow-lg shadow-red-900/20" 
                        : theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-400"
                    )}
                  >
                    Be Vietnam
                  </button>
                  <button 
                    onClick={() => setFontFamily('font-serif')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                      fontFamily === 'font-serif' 
                        ? "bg-primary-container border-primary-container text-white shadow-lg shadow-red-900/20" 
                        : theme === 'dark' ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-400"
                    )}
                  >
                    Serif
                  </button>
                </div>
              </div>
 
              <div className="space-y-4">
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest">Màu Nền</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setTheme('dark')}
                    className={cn("w-10 h-10 rounded-full bg-[#111316] border-2 transition-all shadow-lg", theme === 'dark' ? 'border-primary-container scale-110' : 'border-zinc-800 hover:scale-105')} 
                  />
                  <button 
                    onClick={() => setTheme('sepia')}
                    className={cn("w-10 h-10 rounded-full bg-[#f4f1ea] border-2 transition-all shadow-lg", theme === 'sepia' ? 'border-primary-container scale-110' : 'border-zinc-200 hover:scale-105')} 
                  />
                  <button 
                    onClick={() => setTheme('light')}
                    className={cn("w-10 h-10 rounded-full bg-white border-2 transition-all shadow-lg", theme === 'light' ? 'border-primary-container scale-110' : 'border-zinc-200 hover:scale-105')} 
                  />
                </div>
              </div>
 
              <div className="space-y-4">
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest">Cỡ Chữ</label>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-sm",
                      theme === 'dark' ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                    )}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={cn("text-xl font-black", theme === 'dark' ? "text-white" : "text-zinc-900")}>{fontSize}</span>
                  <button 
                    onClick={() => setFontSize(prev => Math.min(40, prev + 1))}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-sm",
                      theme === 'dark' ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading Content */}
        <article 
          className="text-justify whitespace-pre-line transition-all duration-300 selection:bg-primary-container selection:text-white" 
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: lineHeight,
            fontWeight: 500
          }}
        >
          {chapter.content.split('\n\n').map((p: string, i: number) => (
            <p key={i} className="mb-10 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary-container">
              {p}
            </p>
          ))}
        </article>

        {/* Footer Controls */}
        <div className={cn(
          "mt-24 flex flex-col items-center gap-10 border-t pt-16",
          theme === 'dark' ? "border-zinc-800" : "border-zinc-200"
        )}>
          <div className="flex items-center gap-6">
            <button 
              disabled={!prevChapter}
              onClick={() => router.push(`/read/story/${slug}/${prevChapter.id}`)}
              className={cn(
                "w-16 h-16 flex items-center justify-center rounded-full transition-all active:scale-90 shadow-2xl disabled:opacity-20",
                theme === 'dark' ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button 
              disabled={!nextChapter}
              onClick={() => router.push(`/read/story/${slug}/${nextChapter.id}`)}
              className="px-16 h-16 bg-primary-container text-white font-black rounded-full hover:bg-red-700 transition-all active:scale-95 shadow-2xl shadow-red-900/40 uppercase tracking-widest text-sm disabled:opacity-20"
            >
              Chương Tiếp Theo
            </button>
            <button 
              disabled={!nextChapter}
              onClick={() => router.push(`/read/story/${slug}/${nextChapter.id}`)}
              className={cn(
                "w-16 h-16 flex items-center justify-center rounded-full transition-all active:scale-90 shadow-2xl disabled:opacity-20",
                theme === 'dark' ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
              theme === 'dark' ? "bg-zinc-900 text-zinc-500 hover:text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            )}>
              Báo lỗi chương
            </button>
            <button className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
              theme === 'dark' ? "bg-zinc-900 text-zinc-500 hover:text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            )}>
              Đề cử truyện
            </button>
            <button className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
              theme === 'dark' ? "bg-zinc-900 text-zinc-500 hover:text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            )}>
              Theo dõi
            </button>
          </div>
        </div>
      </main>

      {/* FAB for back to top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary-container text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <ArrowUp className="w-7 h-7 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
}
