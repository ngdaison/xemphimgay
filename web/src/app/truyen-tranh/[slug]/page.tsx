"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetchContentBySlug, api } from '@/lib/api';
import Link from 'next/link';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { 
  Play, 
  Plus, 
  Download, 
  Star, 
  Calendar, 
  Layers, 
  Info,
  Loader2,
  ChevronRight,
  ThumbsUp,
  Share2,
  PlayCircle,
  Clock,
  Languages,
  PlusCircle,
  Library
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MangaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState('episodes');
  const [commentText, setCommentText] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { data: content, error, isLoading, mutate } = useSWR(`content_${slug}`, () => fetchContentBySlug(slug));
  
  const { data: comments, mutate: mutateComments } = useSWR(
    content ? `comments_${content.id}` : null, 
    () => api.get(`/interaction/comments/${content.id}`).then(res => res.data)
  );

  const { data: relatedContent } = useSWR(
    content ? `related_${content.id}` : null,
    () => api.get(`/contents/${content.id}/related`).then(res => res.data)
  );

  const handleFavorite = async () => {
    if (!content) return;
    try {
      await api.post(`/interaction/favorite/${content.id}`);
      setIsFavorited(!isFavorited);
      // mutate();
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handlePostComment = async () => {
    if (!content || !commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post('/interaction/comments', { contentId: content.id, text: commentText });
      setCommentText('');
      mutateComments();
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRate = async (score: number) => {
    if (!content) return;
    setUserRating(score);
    try {
      await api.post('/interaction/rate', { contentId: content.id, score });
    } catch (err) {
      console.error("Failed to rate", err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface p-10 font-['Be_Vietnam_Pro']">
        <div className="bg-error-container/10 border border-error-container/20 p-8 rounded-2xl max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Lỗi tải dữ liệu</h2>
          <p className="text-zinc-500 text-sm">Không thể tải thông tin nội dung. Vui lòng kiểm tra lại kết nối.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-primary-container hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-widest text-xs"
          >
            THỬ LẠI
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 font-['Be_Vietnam_Pro']">
        <div className="w-20 h-20 border-4 border-zinc-800 border-t-primary-container rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Đang tải nội dung...</p>
      </div>
    );
  }

  if (!content) return null;

  const episodes = content.anime?.episodes || content.video?.episodes || [];
  const chapters = content.manga?.chapters || content.story?.chapters || [];
  const mediaItems = episodes.length > 0 ? episodes : chapters;
  const isMovie = content.type === 'MOVIE' && content.movie;

  const handleWatch = (item: any) => {
    if (isMovie) {
      router.push(`/watch/${content.slug}/${content.movie.id}`);
    } else if (content.type === 'STORY') {
      router.push(`/read/story/${content.slug}/${item.id}`);
    } else if (content.type === 'MANGA') {
      router.push(`/read/manga/${content.slug}/${item.id}`);
    } else if (item) {
      router.push(`/watch/${content.slug}/${item.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-16 min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={content.backgroundUrl || content.posterUrl} 
              alt="Backdrop"
              className="w-full h-full object-cover animate-in fade-in duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-end px-12 pb-16">
            <div className="flex flex-col md:flex-row gap-10 items-end w-full">
              {/* Poster */}
              <div className="w-64 h-[384px] rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 transform hover:scale-[1.02] transition-transform duration-300 hidden md:block">
                <img src={content.posterUrl} className="w-full h-full object-cover" alt={content.title} />
              </div>
              
              {/* Movie Info */}
              <div className="flex-1 pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-primary-container text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {content.type === 'ANIME' || content.type === 'MOVIE' ? 'Hot New 2024' : content.type}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(star * 2)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-colors"
                        >
                          <Star
                            className={cn(
                              "w-4 h-4 cursor-pointer",
                              (hoverRating || userRating / 2) >= star ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-yellow-400/40"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xl font-bold ml-2">{content.ratingAvg?.toFixed(1) || '9.8'}</span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-on-surface mb-4 drop-shadow-lg tracking-tight uppercase">
                  {content.title}
                </h1>
                
                <div className="flex items-center space-x-6 text-on-surface/70 mb-6 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {content.releaseYear}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {content.type === 'STORY' || content.type === 'MANGA' ? `${chapters.length} Chương` : '2h 15m'}</span>
                  <span className="flex items-center gap-1.5"><Languages className="w-4 h-4" /> Bản dịch chuẩn</span>
                </div>
                
                <p className="text-on-surface/70 text-lg max-w-2xl mb-8 leading-relaxed line-clamp-3">
                  {content.description || "Một cuộc hành trình đầy cảm xúc, kết hợp giữa nghệ thuật đỉnh cao và cốt truyện sâu sắc."}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => isMovie ? handleWatch(null) : (mediaItems.length > 0 && handleWatch(mediaItems[0]))}
                    className="bg-primary-container hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-red-900/20"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    {content.type === 'STORY' || content.type === 'MANGA' ? 'ĐỌC NGAY' : 'XEM NGAY'}
                  </button>
                  <button 
                    onClick={handleFavorite}
                    className={cn(
                      "backdrop-blur-md text-on-surface border px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95",
                      isFavorited 
                        ? "bg-primary-container border-primary-container text-white shadow-lg shadow-red-900/40" 
                        : "bg-surface-container/20 hover:bg-surface-container/40 border-outline/20"
                    )}
                  >
                    <PlusCircle className={cn("w-5 h-5", isFavorited && "rotate-45")} />
                    {isFavorited ? 'ĐANG THEO DÕI' : 'THEO DÕI'}
                  </button>
                  <button className="bg-surface-container/20 hover:bg-surface-container/40 backdrop-blur-md text-on-surface border border-outline/20 px-4 py-3.5 rounded-xl transition-all">
                    <Library className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Tabs & Grid */}
        <div className="px-12 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Episodes & Comments */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-on-surface border-l-4 border-primary-container pl-4 uppercase tracking-tight">
                  {content.type === 'STORY' || content.type === 'MANGA' ? 'Danh sách chương' : 'Danh sách tập'}
                </h3>
                <span className="text-slate-400 text-sm">
                  {mediaItems.length} {content.type === 'STORY' || content.type === 'MANGA' ? 'Chương' : 'Tập'} • {content.releaseStatus || 'Đã hoàn thành'}
                </span>
              </div>
              
              {/* Episode/Chapter Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {mediaItems.map((item: any, index: number) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleWatch(item)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-outline/10 mb-2 shadow-sm">
                      <img 
                        src={item.thumbnailUrl || content.backgroundUrl || content.posterUrl} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={item.title}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">Mới</div>
                    </div>
                    <p className="text-sm font-bold text-on-surface/80 group-hover:text-primary-container transition-colors line-clamp-1">
                      {content.type === 'STORY' || content.type === 'MANGA' ? `Chương ${item.chapterNum}` : `Tập ${item.episodeNum}`}
                      {item.title && `: ${item.title}`}
                    </p>
                  </div>
                ))}
                
                {mediaItems.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-surface-container rounded-2xl border border-zinc-800 border-dashed">
                    <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-xs">Nội dung đang được cập nhật...</p>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="bg-surface-container rounded-2xl p-8">
                <h3 className="text-xl font-bold text-on-surface mb-8">Bình luận ({comments?.total || 0})</h3>
                <div className="flex gap-4 mb-10">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex-shrink-0 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-background border border-zinc-800 rounded-xl p-4 text-sm text-on-surface focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none h-24 transition-all" 
                      placeholder="Chia sẻ suy nghĩ của bạn..."
                    />
                    <div className="flex justify-end mt-4">
                      <button 
                        onClick={handlePostComment}
                        disabled={isSubmitting || !commentText.trim()}
                        className="bg-secondary-container text-on-surface px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gửi bình luận'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {comments?.items?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-500 shrink-0 overflow-hidden">
                        <img src={comment.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username}`} alt="" className="w-full h-full" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-200">{comment.user?.displayName || comment.user?.username}</span>
                          <span className="text-xs text-slate-500">• {new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3 font-medium">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-container transition-colors font-bold">
                            <ThumbsUp className="w-4 h-4" /> 0
                          </button>
                          <button className="text-xs text-slate-500 hover:text-on-surface transition-colors font-bold uppercase tracking-wider">Trả lời</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!comments?.items || comments.items.length === 0) && (
                    <div className="py-10 text-center">
                       <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Related */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-8">
                <h3 className="text-xl font-bold text-on-surface border-l-4 border-primary-container pl-4 uppercase tracking-tight">Nội dung tương tự</h3>
                <div className="space-y-6">
                  {relatedContent?.map((item: any) => (
                    <Link 
                      key={item.id} 
                      href={`/contents/${item.slug}`}
                      className="flex gap-4 group cursor-pointer"
                    >
                      <div className="w-24 h-36 rounded-lg overflow-hidden shrink-0 border border-zinc-800 shadow-lg">
                        <img 
                          src={item.posterUrl} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={item.title} 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-primary-container transition-colors mb-1 line-clamp-2 uppercase">
                          {item.title}
                        </h4>
                        <div className="flex items-center text-xs text-slate-500 gap-2 mb-2">
                          <span className="flex items-center text-yellow-500"><Star className="w-3 h-3 fill-current mr-1" /> {item.ratingAvg?.toFixed(1) || '0.0'}</span>
                          <span>• {item.releaseYear}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 w-fit">
                          {item.genres?.[0]?.genre?.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                  
                  {(!relatedContent || relatedContent.length === 0) && (
                    <p className="text-zinc-600 text-xs font-bold italic uppercase tracking-widest text-center py-10">Không có đề xuất tương tự</p>
                  )}

                  <button className="w-full py-3 rounded-xl border border-zinc-800 text-slate-400 text-xs font-bold hover:bg-zinc-900 transition-all uppercase tracking-widest">
                    Xem thêm gợi ý
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
