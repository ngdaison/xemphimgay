"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { fetchStoryChapter } from '@/lib/api';
import { StoryReader } from '@/components/StoryReader';
import { Loader2 } from 'lucide-react';

export default function StoryChapterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const chapterId = params.chapterId as string;

  const { data: chapter, error, isLoading } = useSWR(`story_chapter_${chapterId}`, () => fetchStoryChapter(chapterId));

  if (error) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Error loading chapter</div>;
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-[#0a0a0a]"><Loader2 className="animate-spin text-primary-container" /></div>;

  return (
    <StoryReader
      title={chapter?.story?.content?.title || "Story Reader"}
      chapterTitle={chapter?.title || "Không tiêu đề"}
      chapterNum={chapter?.chapterNum || 1}
      content={chapter?.content || ""}
      onNextChapter={() => {}}
      onPrevChapter={() => {}}
    />
  );
}
