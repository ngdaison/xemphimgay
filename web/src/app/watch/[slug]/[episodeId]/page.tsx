"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetchVideoEpisode, api } from '@/lib/api';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import {
  Info,
  List,
  ThumbsUp,
  Share2,
  Loader2,
  Star,
  PlayCircle,
  Eye,
  SortAsc,
  Plus,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.episodeId as string;
  const slug = params.slug as string;

  const { data: episode, error } = useSWR(`episode_${episodeId}`, () => fetchVideoEpisode(episodeId));

  const contentId = episode?.content?.id;
  const { data: commentsData, mutate: mutateComments } = useSWR(
    contentId ? `comments_${contentId}` : null,
    () => api.get(`/interaction/comments/${contentId}`).then(res => res.data)
  );
  const { data: relatedData } = useSWR(
    contentId ? `related_${contentId}` : null,
    () => api.get(`/contents/${contentId}/related`).then(res => res.data)
  );

  const [commentText, setCommentText] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const handlePostComment = async () => {
    if (!contentId || !commentText.trim()) return;
    setIsCommentSubmitting(true);
    try {
      await api.post('/interaction/comments', { contentId, text: commentText });
      setCommentText('');
      mutateComments();
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const hlsUrl = episode?.sources?.find((s: any) => s.manifestUrl)?.manifestUrl 
    || episode?.sources?.[0]?.url 
    || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  // Save watch history on load and periodically
  useEffect(() => {
    if (!episodeId) return;
    const interval = setInterval(() => {
      api.post('/history/watch', { episodeId, progress: 0 })
        .catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [episodeId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface p-10 font-['Be_Vietnam_Pro']">
        <div className="bg-error-container/10 border border-error-container/20 p-8 rounded-2xl max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Lỗi phát video</h2>
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

  if (!episode && !error) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 font-['Be_Vietnam_Pro']">
      <div className="w-20 h-20 border-4 border-zinc-800 border-t-primary-container rounded-full animate-spin"></div>
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Đang nạp trình phát...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-20 px-8 pb-12 transition-all">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Player Column (70%) */}
            <div className="lg:w-[70%] flex flex-col gap-8">
              {/* Video Player */}
              <VideoPlayer
                src={hlsUrl}
                poster={episode?.content?.posterUrl}
                title={`${episode?.content?.title} - Tập ${episode?.episodeNum}`}
                onNext={() => {
                  const episodes = episode?.content?.anime?.episodes || episode?.content?.video?.episodes || [];
                  const currentIdx = episodes.findIndex((ep: any) => ep.id === episodeId);
                  if (currentIdx < episodes.length - 1) {
                    router.push(`/watch/${slug}/${episodes[currentIdx + 1].id}`);
                  }
                }}
                onPrev={() => {
                  const episodes = episode?.content?.anime?.episodes || episode?.content?.video?.episodes || [];
                  const currentIdx = episodes.findIndex((ep: any) => ep.id === episodeId);
                  if (currentIdx > 0) {
                    router.push(`/watch/${slug}/${episodes[currentIdx - 1].id}`);
                  }
                }}
              />

              {/* Movie Info */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-on-surface tracking-tight uppercase">{episode?.content?.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-on-surface/50 font-medium">
                      <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary-container" /> 2,451,029 lượt xem</span>
                      <span>•</span>
                      <span>2022</span>
                      <span>•</span>
                      <span className="bg-primary-container/10 text-primary-container px-2 py-0.5 rounded text-[10px] font-bold border border-primary-container/20">TV-MA</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-6 py-3 rounded-xl border border-outline/10 transition-all active:scale-95 text-on-surface font-bold text-sm">
                      <ThumbsUp className="w-5 h-5" />
                      128K
                    </button>
                    <button className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-6 py-3 rounded-xl border border-outline/10 transition-all active:scale-95 text-on-surface font-bold text-sm">
                      <Plus className="w-5 h-5" />
                      Lưu
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container rounded-2xl p-6 border border-outline/10">
                  <p className="text-on-surface/60 dark:text-zinc-400 leading-relaxed font-medium">
                    {episode?.content?.description || "Trong một thế giới tương lai đầy khắc nghiệt, bị ám ảnh bởi công nghệ và biến đổi cơ thể, một đứa trẻ đường phố đầy nghị lực cố gắng sống sót trong thành phố Night City."}
                  </p>
                  <div className="flex gap-2 mt-6">
                    {episode?.content?.genres?.map((cg: any) => (
                      <span key={cg.genreId} className="px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-400 text-[11px] font-bold border border-zinc-800 uppercase tracking-widest">
                        {cg.genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-on-surface">{commentsData?.total || 0} Bình luận</h3>
                  <button className="flex items-center gap-2 text-sm text-zinc-500 font-bold hover:text-on-surface transition-colors">
                    <SortAsc className="w-4 h-4" /> Sắp xếp theo
                  </button>
                </div>

                {/* Add Comment */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-700">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="User" className="w-full h-full" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-primary-container outline-none py-2 transition-all text-on-surface text-sm min-h-[60px]"
                      placeholder="Viết bình luận của bạn..."
                    />
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setCommentText('')} className="text-sm font-bold text-zinc-500 hover:text-on-surface px-4 py-2 transition-colors">Hủy</button>
                      <button
                        onClick={handlePostComment}
                        disabled={isCommentSubmitting || !commentText.trim()}
                        className="text-sm font-bold bg-primary-container text-on-surface px-8 py-2.5 rounded-full hover:shadow-lg hover:shadow-red-900/40 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isCommentSubmitting ? 'Đang gửi...' : 'Bình luận'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment List */}
                <div className="space-y-8 mt-10">
                  {commentsData?.items?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-700">
                        <img src={comment.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username || comment.id}`} alt="" className="w-full h-full" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-on-surface">{comment.user?.displayName || comment.user?.username || 'Người dùng'}</span>
                          <span className="text-xs text-zinc-600 font-medium">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">{comment.text}</p>
                        <div className="flex items-center gap-6 mt-4">
                          <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-primary-container transition-colors font-bold">
                            <ThumbsUp className="w-4 h-4" /> {comment.likes || 0}
                          </button>
                          <button className="text-xs font-bold text-zinc-500 hover:text-on-surface uppercase tracking-wider">Phản hồi</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!commentsData?.items || commentsData.items.length === 0) && (
                    <div className="py-10 text-center">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Episode List (30%) */}
            <div className="lg:w-[30%] flex flex-col gap-8">
              <div className="bg-surface-container rounded-2xl border border-zinc-800/50 flex flex-col h-fit">
                <div className="p-6 border-b border-zinc-800/50">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-on-surface uppercase tracking-tight">Danh sách tập</h3>
                    <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Phần 1</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-primary-container text-white text-[10px] font-bold py-2.5 rounded-xl transition-all active:scale-95 uppercase tracking-widest">Thuyết minh</button>
                    <button className="bg-surface-container-highest hover:bg-surface-container text-on-surface/60 text-[10px] font-bold py-2.5 rounded-xl border border-outline/10 transition-all active:scale-95 uppercase tracking-widest">Vietsub</button>
                  </div>
                </div>

                <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {(episode?.content?.anime?.episodes || episode?.content?.video?.episodes || [episode]).map((ep: any) => (
                    <div
                      key={ep.id}
                      onClick={() => router.push(`/watch/${slug}/${ep.id}`)}
                      className={cn(
                        "flex gap-4 p-3 rounded-2xl transition-all cursor-pointer group",
                        ep.id === episodeId
                          ? "bg-primary-container/10 border border-primary-container/30"
                          : "hover:bg-zinc-900/50"
                      )}
                    >
                      <div className="w-28 aspect-video bg-zinc-800 rounded-xl overflow-hidden relative flex-shrink-0">
                        <img
                          src={ep.thumbnailUrl || episode?.content?.posterUrl}
                          className={cn(
                            "w-full h-full object-cover transition-all",
                            ep.id !== episodeId && "opacity-50 grayscale"
                          )}
                          alt=""
                        />
                        {ep.id === episodeId && (
                          <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center backdrop-blur-sm">
                            <PlayCircle className="w-8 h-8 text-primary-container fill-current" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/80 dark:bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase">24:00</div>
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden">
                        {ep.id === episodeId && (
                          <span className="text-[9px] font-bold text-primary-container uppercase tracking-tighter mb-1">Đang xem</span>
                        )}
                        <h4 className={cn(
                          "text-xs font-bold truncate",
                          ep.id === episodeId ? "text-on-surface" : "text-zinc-500 group-hover:text-zinc-300"
                        )}>
                          Tập {ep.episodeNum < 10 ? `0${ep.episodeNum}` : ep.episodeNum}: {ep.title || `Tập ${ep.episodeNum}`}
                        </h4>
                        <span className="text-[10px] text-zinc-600 font-medium mt-1">24:00 • HD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-on-surface border-l-4 border-primary-container pl-4 uppercase tracking-tight">Đề xuất cho bạn</h3>
                <div className="space-y-4">
                  {relatedData?.map((item: any) => (
                    <Link key={item.id} href={`/contents/${item.slug}`} className="flex gap-4 group cursor-pointer">
                      <div className="w-32 aspect-video bg-zinc-800 rounded-xl overflow-hidden relative flex-shrink-0 border border-zinc-800 shadow-lg">
                        <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden">
                        <h4 className="text-sm font-bold text-on-surface group-hover:text-primary-container transition-colors truncate uppercase">{item.title}</h4>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2">{item.type} • {item.releaseYear}</span>
                      </div>
                    </Link>
                  ))}
                  {(!relatedData || relatedData.length === 0) && (
                    <p className="text-zinc-600 text-xs font-bold italic uppercase tracking-widest text-center py-8">Đang cập nhật đề xuất...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
