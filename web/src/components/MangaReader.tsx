"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Settings, Maximize, List, MessageSquare, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MangaPage {
  id: string;
  imageUrl: string;
  pageNum: number;
}

interface MangaReaderProps {
  pages: MangaPage[];
  title: string;
  chapterNum: number;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export const MangaReader: React.FC<MangaReaderProps> = ({ 
  pages, 
  title, 
  chapterNum,
  onNextChapter,
  onPrevChapter 
}) => {
  const [readingMode, setReadingMode] = useState<'vertical' | 'paged'>('vertical');
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [zoom, setZoom] = useState(100);
  const readerRef = useRef<HTMLDivElement>(null);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro']">
      {/* Top Controls */}
      <div className={cn(
        "fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline/10 transition-transform duration-500 p-4 md:px-8",
        showControls ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface-container rounded-xl transition-colors text-on-surface">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-sm md:text-lg font-black uppercase italic tracking-tighter truncate max-w-[200px] md:max-w-md text-on-surface">
                {title}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">
                Chương {chapterNum}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setReadingMode(readingMode === 'vertical' ? 'paged' : 'vertical')}
              className="p-2 bg-surface-container/50 hover:bg-surface-container rounded-xl border border-outline/10 transition-all text-[10px] font-black uppercase tracking-widest hidden sm:flex items-center gap-2 text-on-surface"
            >
              <Settings className="w-4 h-4" />
              {readingMode === 'vertical' ? 'Cuộn dọc' : 'Trang đơn'}
            </button>
            <button className="p-3 bg-surface-container/50 hover:bg-surface-container rounded-2xl border border-outline/10 text-on-surface">
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reader Area */}
      <div 
        ref={readerRef}
        className={cn(
          "pt-24 pb-32 mx-auto transition-all duration-500",
          readingMode === 'vertical' ? "max-w-4xl" : "max-w-2xl"
        )}
      >
        {readingMode === 'vertical' ? (
          <div className="space-y-0">
            {pages.map((page, index) => (
              <div key={page.id} className="relative group">
                <img 
                  src={page.imageUrl} 
                  alt={`Page ${page.pageNum}`}
                  className="w-full h-auto block select-none"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
                <div className="absolute top-4 right-4 bg-surface/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">
                  {page.pageNum} / {pages.length}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative min-h-[80vh] flex items-center justify-center">
               <img 
                src={pages[currentPage]?.imageUrl} 
                alt={`Page ${currentPage + 1}`}
                className="max-h-[90vh] w-auto shadow-2xl rounded-sm"
              />
              {/* Navigation overlays */}
              <div 
                className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize" 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize" 
                onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
              />
            </div>
            <div className="mt-8 flex items-center gap-8 text-on-surface">
               <button 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-4 bg-surface-container/50 rounded-full disabled:opacity-20"
               >
                 <ChevronLeft className="w-6 h-6" />
               </button>
               <span className="font-black italic text-xl">{currentPage + 1} / {pages.length}</span>
               <button 
                disabled={currentPage === pages.length - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-4 bg-surface-container/50 rounded-full disabled:opacity-20"
               >
                 <ChevronRight className="w-6 h-6" />
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <button 
          onClick={scrollToTop}
          className="p-4 bg-primary-container text-white rounded-2xl shadow-2xl shadow-red-600/40 hover:scale-110 active:scale-90 transition-all"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background to-transparent pt-20 pb-8 px-4 flex justify-center gap-4 pointer-events-none">
         <div className="pointer-events-auto flex items-center gap-2 bg-surface/80 backdrop-blur-2xl p-2 rounded-2xl border border-outline/10 shadow-2xl">
            <button 
              onClick={onPrevChapter}
              className="px-6 py-3 bg-surface-container/50 hover:bg-surface-container rounded-xl text-xs font-black uppercase tracking-widest transition-all text-on-surface"
            >
              Chương trước
            </button>
            <div className="px-6 py-3 bg-primary-container text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-600/20">
              Chương {chapterNum}
            </div>
            <button 
              onClick={onNextChapter}
              className="px-6 py-3 bg-surface-container/50 hover:bg-surface-container rounded-xl text-xs font-black uppercase tracking-widest transition-all text-on-surface"
            >
              Chương sau
            </button>
         </div>
      </div>
    </div>
  );
};
