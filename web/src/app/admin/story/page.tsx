"use client";

import React from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Loader2, FileText, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminStoryPage() {
  const { data: stories, isLoading, mutate } = useSWR('admin_story', () => api.get('/admin/contents?type=STORY').then(res => res.data));

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
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Quản lý Truyện chữ</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Quản lý light novel, web novel</p>
        </div>
        <Link href="/admin/content/new?type=STORY" className="flex items-center gap-2 px-6 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all">
          <Plus className="w-4 h-4" /> Thêm Truyện mới
        </Link>
      </div>

      {isLoading ? (
        <div className="py-32 flex justify-center"><Loader2 className="w-12 h-12 text-primary-container animate-spin" /></div>
      ) : (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Truyện</th>
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tác giả</th>
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Số chương</th>
                <th className="text-left p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Trạng thái</th>
                <th className="text-right p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stories) && stories.map((item: any) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-zinc-800">
                        <img src={item.posterUrl} className="w-full h-full object-cover" alt={item.title} />
                      </div>
                      <span className="font-bold text-sm text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-zinc-400 font-medium">{item.story?.author || '—'}</td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] font-black text-zinc-400">
                      {item.story?.chapters?.length || 0} Chương
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{item.releaseStatus || 'Đang ra'}</span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/content/${item.id}`} className="px-4 py-2 bg-primary-container/10 text-primary-container rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-container/20 transition-all flex items-center gap-1.5">
                        <Edit className="w-3 h-3" /> Sửa
                      </Link>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!stories || stories.length === 0) && (
                <tr><td colSpan={5} className="p-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">Chưa có truyện chữ nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
