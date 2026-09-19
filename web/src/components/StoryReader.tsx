"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Settings, List, Type, Palette, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

function sanitizeHtml(html: string): string {
  if (!html) return '';
  if (typeof window !== 'undefined' && (window as any).DOMPurify) {
    return (window as any).DOMPurify.sanitize(html);
  }
  // Fallback sanitization
  const el = document.createElement('div');
  el.textContent = html;
  return el.innerHTML;
}

interface StoryReaderProps {
  title: string;
  chapterTitle: string;
  chapterNum: number;
  content: string;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  title,
  chapterTitle,
  chapterNum,
  content,
  onNextChapter,
  onPrevChapter,
}) => {
  const [fontSize, setFontSize] = useState(20);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY) > 50) {
        setShowControls(window.scrollY < lastScrollY);
        lastScrollY = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sanitizedContent = useMemo(() => sanitizeHtml(content), [content]);

  const themes = {
    light: "bg-[#f8f9fa] text-[#1a1a1a]",
    dark: "bg-[#0a0a0a] text-[#d1d1d1]",
    sepia: "bg-[#f4ecd8] text-[#5b4636]",
  };

  const fonts = {
    sans: "font-['Be_Vietnam_Pro']",
    serif: "font-['Merriweather',serif]",
    mono: "font-mono",
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      themes[theme]
    )}>
      {/* Top Header */}
      <div className={cn(
        "fixed top-0 left-0 w-full z-50 transition-transform duration-500 border-b",
        theme === 'dark' ? "bg-black/80 border-white/5" : "bg-white/80 border-black/5",
        "backdrop-blur-xl p-4 md:px-8",
        showControls ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xs font-black uppercase tracking-widest text-zinc-500">
                {title}
              </h1>
              <p className="text-sm font-black uppercase italic tracking-tighter">
                Chương {chapterNum}: {chapterTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-all">
               <Palette className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-all">
               <Type className="w-5 h-5" />
            </button>
            <button className="p-3 bg-primary-container text-white rounded-2xl shadow-lg shadow-red-600/20">
               <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reading Progress Bar at top */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent pointer-events-none">
        <div 
          className="h-full bg-primary-container transition-all duration-300"
          style={{ width: '30%' }} // Dynamic progress
        />
      </div>

      {/* Main Content */}
      <article className={cn(
        "max-w-3xl mx-auto pt-32 pb-40 px-6 md:px-0",
        fonts[fontFamily]
      )}>
        <div className="mb-16 space-y-4">
           <span className="text-primary-container font-black uppercase tracking-[0.3em] text-xs">Chapter {chapterNum}</span>
           <h2 className={cn(
             "text-3xl md:text-5xl font-black uppercase italic tracking-tighter",
             theme === 'dark' ? "text-white" : "text-black"
           )}>
             {chapterTitle}
           </h2>
           <div className="w-20 h-1.5 bg-primary-container rounded-full" />
        </div>

        <div 
          className="prose-lg md:prose-xl max-w-none leading-relaxed whitespace-pre-wrap selection:bg-primary-container selection:text-white"
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        
        {/* Navigation Buttons at bottom of article */}
        <div className="mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between gap-6">
           <button 
            onClick={onPrevChapter}
            className="flex-1 flex items-center justify-between p-6 bg-zinc-900/50 hover:bg-zinc-800 rounded-3xl border border-white/5 transition-all group"
           >
              <div className="flex items-center gap-4">
                 <ChevronLeft className="w-6 h-6 text-zinc-500 group-hover:text-primary-container" />
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Chương trước</p>
                    <h4 className="text-sm font-black text-white italic">Tiêu đề chương cũ</h4>
                 </div>
              </div>
           </button>
           <button 
            onClick={onNextChapter}
            className="flex-1 flex items-center justify-between p-6 bg-zinc-900/50 hover:bg-zinc-800 rounded-3xl border border-white/5 transition-all group"
           >
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Chương tiếp theo</p>
                 <h4 className="text-sm font-black text-white italic">Tiêu đề chương mới</h4>
              </div>
              <ChevronRight className="w-6 h-6 text-zinc-500 group-hover:text-primary-container" />
           </button>
        </div>
      </article>

      {/* Floating Settings Menu (simplified) */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4">
         <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-4 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-white/10 hover:scale-110 active:scale-95 transition-all"
         >
           <ArrowUp className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
};
