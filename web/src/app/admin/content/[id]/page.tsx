"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { 
  ChevronLeft, 
  Plus, 
  Play, 
  FileText, 
  Edit3, 
  Trash2, 
  Upload, 
  Settings,
  ChevronRight,
  Video,
  BookOpen,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ManageContentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState('episodes');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ num: '', title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: content, error, isLoading, mutate } = useSWR(`admin_content_${id}`, () => api.get(`/admin/contents/${id}`).then(res => res.data));

  const handleAddItem = async () => {
    if (!newItem.num) return;
    setIsSubmitting(true);
    try {
      const endpoint = (content.type === 'ANIME' || content.type === 'MOVIE') ? 'episodes' : 'chapters';
      const payload = (content.type === 'ANIME' || content.type === 'MOVIE') 
        ? { episodeNum: parseInt(newItem.num), title: newItem.title }
        : { chapterNum: parseFloat(newItem.num), title: newItem.title, content: 'Nội dung chương mới...' };
      
      await api.post(`/admin/contents/${id}/${endpoint}`, payload);
      setIsAddingItem(false);
      setNewItem({ num: '', title: '' });
      mutate();
    } catch (error) {
      console.error("Failed to add item", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoUpload = async (episodeId: string, file: File) => {
    setUploadingId(episodeId);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('episodeId', episodeId);

    try {
      await api.post('/admin/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(progress);
        }
      });
      alert('Tải lên thành công! Tiến trình Transcode đã bắt đầu.');
      mutate();
    } catch (error) {
      console.error("Upload failed", error);
      alert('Tải lên thất bại.');
    } finally {
      setUploadingId(null);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-10 h-10 text-primary-container animate-spin" /></div>;
  if (!content) return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Nội dung không tồn tại</div>;

  const episodes = content.anime?.episodes || content.video?.episodes || [];
  const chapters = content.manga?.chapters || content.story?.chapters || [];

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] p-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/admin')}
              className="w-12 h-12 rounded-2xl bg-surface-container border border-outline/10 flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-on-surface">{content.title}</h1>
              <p className="text-on-surface/40 font-bold uppercase tracking-widest text-[10px] mt-1">Quản lý các tập phim / chương truyện</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-xl bg-surface-container border border-outline/10 text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-high transition-all text-on-surface">Sửa thông tin gốc</button>
             <button 
              onClick={() => setIsAddingItem(true)}
              className="px-8 py-3 rounded-xl bg-primary-container text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all flex items-center gap-3"
            >
              <Plus className="w-4 h-4" /> {content.type === 'ANIME' || content.type === 'MOVIE' ? 'Thêm tập mới' : 'Thêm chương mới'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           {/* Sidebar Info */}
           <div className="space-y-8">
              <div className="aspect-[2/3] rounded-[40px] overflow-hidden border border-outline/10 shadow-2xl">
                 <img src={content.posterUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="bg-surface-container border border-outline/10 rounded-3xl p-6 space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-on-surface/40">Loại</span>
                    <span className="text-on-surface">{content.type}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-on-surface/40">Trạng thái</span>
                    <span className="text-emerald-500 font-black">{content.status}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-on-surface/40">Năm</span>
                    <span className="text-on-surface">{content.releaseYear}</span>
                 </div>
              </div>
           </div>

           {/* Content Management Area */}
           <div className="lg:col-span-3 space-y-8">
              <div className="flex gap-8 border-b border-outline/10 mb-8 overflow-x-auto no-scrollbar">
                 <button 
                    onClick={() => setActiveTab('episodes')}
                    className={cn(
                      "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                      activeTab === 'episodes' ? "text-primary-container" : "text-on-surface/40 hover:text-on-surface"
                    )}
                  >
                    Danh sách {content.type === 'ANIME' || content.type === 'MOVIE' ? 'tập' : 'chương'}
                    {activeTab === 'episodes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-container rounded-full"></div>}
                 </button>
                 <button 
                    onClick={() => setActiveTab('stats')}
                    className={cn(
                      "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                      activeTab === 'stats' ? "text-primary-container" : "text-on-surface/40 hover:text-on-surface"
                    )}
                  >
                    Thống kê lượt xem
                    {activeTab === 'stats' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-container rounded-full"></div>}
                 </button>
              </div>

              {activeTab === 'episodes' && (
                <div className="space-y-4">
                   {(content.type === 'ANIME' || content.type === 'MOVIE' ? episodes : chapters).map((item: any) => (
                      <div 
                        key={item.id}
                        className="bg-surface-container/30 border border-outline/10 rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-surface-container transition-all group"
                      >
                         <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface/40 group-hover:text-primary-container transition-colors shrink-0">
                            {content.type === 'ANIME' || content.type === 'MOVIE' ? <Video className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="text-sm font-black uppercase italic tracking-tight text-on-surface">
                                {content.type === 'ANIME' || content.type === 'MOVIE' ? `Tập ${item.episodeNum}` : `Chương ${item.chapterNum}`}
                                {item.title && `: ${item.title}`}
                              </h4>
                              {item.videoSources?.length > 0 && (
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest">Sẵn sàng (HLS)</span>
                              )}
                            </div>
                            <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest mt-1">Cập nhật: {new Date(item.updatedAt).toLocaleDateString('vi-VN')}</p>
                            
                            {uploadingId === item.id && (
                              <div className="mt-3">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-primary-container mb-1">
                                  <span>Đang tải video...</span>
                                  <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                                  <div className="h-full bg-primary-container transition-all" style={{ width: `${uploadProgress}%` }} />
                                </div>
                              </div>
                            )}
                         </div>
                         
                         <div className="flex items-center gap-4">
                            {content.type === 'ANIME' || content.type === 'MOVIE' && !item.videoSources?.length && !uploadingId && (
                              <label className="cursor-pointer bg-primary-container/10 hover:bg-primary-container/20 text-primary-container px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary-container/20 transition-all flex items-center gap-2">
                                <Upload className="w-3 h-3" /> Tải Video
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="video/*"
                                  onChange={(e) => e.target.files?.[0] && handleVideoUpload(item.id, e.target.files[0])}
                                />
                              </label>
                            )}

                            <div className="flex gap-2">
                               <button className="w-10 h-10 rounded-xl bg-surface-container border border-outline/10 flex items-center justify-center hover:text-primary-container transition-all text-on-surface">
                                  <Edit3 className="w-4 h-4" />
                               </button>
                               <button className="w-10 h-10 rounded-xl bg-surface-container border border-outline/10 flex items-center justify-center hover:text-red-500 transition-all text-on-surface">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                      </div>
                   ))}

                   {(content.type === 'ANIME' || content.type === 'MOVIE' ? episodes : chapters).length === 0 && (
                      <div className="py-24 text-center border-2 border-dashed border-outline/10 rounded-[40px] bg-surface-container/20">
                         <p className="text-on-surface/20 font-black uppercase tracking-[0.4em] text-[10px]">Chưa có nội dung nào được thêm</p>
                      </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Simplified Add Item Modal Placeholder */}
      {isAddingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsAddingItem(false)}></div>
           <div className="relative w-full max-w-lg bg-surface border border-outline/10 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-on-surface">Thêm {content.type === 'ANIME' || content.type === 'MOVIE' ? 'Tập mới' : 'Chương mới'}</h2>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 ml-4">Số thứ tự</label>
                    <input 
                      type="number" 
                      value={newItem.num}
                      onChange={(e) => setNewItem({ ...newItem, num: e.target.value })}
                      className="w-full bg-surface-container border border-outline/10 rounded-2xl px-6 py-4 outline-none focus:border-primary-container transition-all text-on-surface" 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 ml-4">Tiêu đề (Tùy chọn)</label>
                    <input 
                      type="text" 
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="w-full bg-surface-container border border-outline/10 rounded-2xl px-6 py-4 outline-none focus:border-primary-container transition-all text-on-surface" 
                    />
                 </div>
                 <button 
                  onClick={handleAddItem}
                  disabled={isSubmitting || !newItem.num}
                  className="w-full py-5 bg-primary-container text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-red-900/20 mt-4 disabled:opacity-50"
                 >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Xác nhận thêm'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
