"use client";

import React from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Loader2, BookOpen, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminMangaPage() {
  const { data: manga, isLoading, mutate } = useSWR('admin_manga', () => api.get('/admin/contents?type=MANGA').then(res => res.data));

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa truyện này?')) return;
    try {
      await api.delete(`/admin/contents/${id}`);
      mutate();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Quản lý Truyện tranh</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Quản lý manga, manhwa, manhua</p>
        </div>
        <Link href="/admin/content/new?type=MANGA" className="flex items-center gap-2 px-6 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all">
          <Plus className="w-4 h-4" /> Thêm Truyện mới
        </Link>
      </div>

      {isLoading ? (
        <div className="py-32 flex justify-center"><Loader2 className="w-12 h-12 text-primary-container animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(manga) && manga.map((item: any) => (
            <div key={item.id} className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden group hover:border-primary-container/30 transition-all">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <Link href={`/admin/content/${item.id}`} className="flex-1 py-2.5 bg-primary-container text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                    <Edit className="w-3 h-3" /> Sửa
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="py-2.5 px-4 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-black text-white uppercase italic truncate">{item.title}</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500">
                  <span>{item.manga?.chapters?.length || 0} Chương</span>
                  <span>•</span>
                  <span className="uppercase tracking-widest">{item.releaseStatus || 'Đang ra'}</span>
                </div>
              </div>
            </div>
          ))}
          {(!manga || manga.length === 0) && (
            <div className="col-span-full py-32 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">Chưa có truyện tranh nào</div>
          )}
        </div>
      )}
    </div>
  );
}
