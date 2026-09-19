"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetchMangaChapter } from '@/lib/api';
import { MangaReader } from '@/components/MangaReader';
import { Loader2 } from 'lucide-react';

export default function MangaChapterPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const chapterId = params.chapterId as string;

  const { data: chapter, error, isLoading } = useSWR(`manga_chapter_${chapterId}`, () => fetchMangaChapter(chapterId));

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white p-10 font-['Be_Vietnam_Pro']">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md text-center space-y-4">
          <h2 className="text-xl font-black uppercase italic">Lỗi tải chương</h2>
          <p className="text-zinc-400">Không thể tải nội dung chương này.</p>
          <button onClick={() => router.push(`/truyen-tranh/${slug}`)} className="w-full bg-red-500 py-3 rounded-xl font-black">QUAY LẠI</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Đang tải trang truyện...</p>
      </div>
    );
  }

  return (
    <MangaReader
      pages={chapter?.pages || []}
      title={chapter?.manga?.content?.title || "Manga Reader"}
      chapterNum={chapter?.chapterNum || 1}
      onNextChapter={() => {}}
      onPrevChapter={() => {}}
    />
  );
}
