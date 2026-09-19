"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Upload, 
  Plus, 
  X, 
  Save, 
  Image as ImageIcon, 
  Film, 
  BookOpen, 
  Settings,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

function NewContentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'MOVIE';

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(initialType);
  const [formData, setFormData] = useState({
    title: '',
    originalTitle: '',
    slug: '',
    description: '',
    posterUrl: '',
    backgroundUrl: '',
    releaseYear: new Date().getFullYear(),
    status: 'PUBLISHED',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/contents', { ...formData, type });
      router.push('/admin');
    } catch (error) {
      console.error('Failed to create content', error);
      alert('Có lỗi xảy ra khi tạo nội dung.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-['Be_Vietnam_Pro']">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">Thêm nội dung mới</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Khởi tạo siêu phẩm mới cho CineStream</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => router.back()}
              className="px-8 py-3 rounded-xl bg-zinc-900 text-zinc-500 font-black uppercase tracking-widest text-xs border border-white/5 hover:text-white transition-all"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 rounded-xl bg-primary-container text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Lưu nội dung</>}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Media Selection */}
          <div className="space-y-8">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-8 space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 block">Loại nội dung</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'MOVIE', label: 'Phim Lẻ' },
                    { id: 'ANIME', label: 'Anime' },
                    { id: 'MANGA', label: 'Manga' },
                    { id: 'STORY', label: 'Truyện Chữ' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setType(item.id)}
                      type="button"
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-3xl border transition-all gap-3 group",
                        type === item.id 
                          ? "bg-primary-container/10 border-primary-container text-primary-container" 
                          : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10"
                      )}
                    >
                      {item.id === 'MOVIE' && <Film className={cn("w-6 h-6", type === item.id ? "animate-bounce" : "")} />}
                      {item.id === 'ANIME' && <Settings className={cn("w-6 h-6", type === item.id ? "animate-bounce" : "")} />}
                      {item.id === 'MANGA' && <BookOpen className={cn("w-6 h-6", type === item.id ? "animate-bounce" : "")} />}
                      {item.id === 'STORY' && <PlusCircle className={cn("w-6 h-6", type === item.id ? "animate-bounce" : "")} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 block">Ảnh Poster</label>
                <div className="aspect-[2/3] rounded-[30px] bg-zinc-900 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group hover:border-primary-container/30 transition-all cursor-pointer overflow-hidden relative">
                  {formData.posterUrl ? (
                    <img src={formData.posterUrl} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-600 group-hover:text-primary-container transition-colors">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Tải ảnh lên</p>
                    </>
                  )}
                  <input 
                    type="text" 
                    placeholder="Dán URL ảnh vào đây..."
                    className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white outline-none focus:border-primary-container transition-all"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Basic Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Tiêu đề nội dung</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-white/5 focus:border-primary-container/50 outline-none rounded-2xl py-4 px-6 text-sm font-bold text-white transition-all"
                    placeholder="Ví dụ: Solo Leveling"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Đường dẫn (Slug)</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-white/5 focus:border-primary-container/50 outline-none rounded-2xl py-4 px-6 text-sm font-bold text-zinc-400 transition-all"
                    placeholder="solo-leveling"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Mô tả tóm tắt</label>
                <textarea 
                  className="w-full bg-zinc-900 border border-white/5 focus:border-primary-container/50 outline-none rounded-3xl py-6 px-6 text-sm font-bold text-white transition-all min-h-[160px]"
                  placeholder="Viết vài dòng mô tả về nội dung này..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Năm phát hành</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-900 border border-white/5 focus:border-primary-container/50 outline-none rounded-2xl py-4 px-6 text-sm font-bold text-white transition-all"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({...formData, releaseYear: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Trạng thái</label>
                  <select 
                    className="w-full bg-zinc-900 border border-white/5 focus:border-primary-container/50 outline-none rounded-2xl py-4 px-6 text-sm font-bold text-white transition-all appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PUBLISHED">Công khai</option>
                    <option value="DRAFT">Bản nháp</option>
                    <option value="HIDDEN">Ẩn</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Ảnh nền (Background)</label>
                <div className="relative group">
                  <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary-container transition-colors" />
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900 border border-white/5 focus:border-primary-container/50 outline-none rounded-2xl py-4 pl-16 pr-6 text-sm font-bold text-white transition-all"
                    placeholder="Dán URL ảnh nền..."
                    value={formData.backgroundUrl}
                    onChange={(e) => setFormData({...formData, backgroundUrl: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary-container">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase italic tracking-tighter">Thêm tập phim / chương truyện</h3>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] mt-1">Bạn có thể thêm sau khi đã lưu nội dung cơ bản</p>
                  </div>
               </div>
               <button className="px-6 py-3 rounded-xl bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all border border-white/5">
                 Thiết lập nhanh
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewContentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><Loader2 className="w-10 h-10 text-primary-container animate-spin" /></div>}>
      <NewContentForm />
    </Suspense>
  );
}
