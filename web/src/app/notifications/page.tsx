"use client";

import React from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Bell, Loader2, Circle, CheckCircle2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { data: notifications, mutate, isLoading } = useSWR('notifications', () => api.get('/notifications').then(res => res.data));

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 mt-16 p-8 min-h-screen">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-container/20 rounded-2xl border border-primary-container/30">
              <Bell className="w-8 h-8 text-primary-container" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Thông báo</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Cập nhật những tin tức mới nhất dành cho bạn</p>
            </div>
          </div>
          
          <button
            onClick={markAllAsRead}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-container animate-spin" />
          </div>
        ) : notifications?.length > 0 ? (
          <div className="max-w-4xl space-y-4">
            {notifications.map((notif: any) => (
              <div 
                key={notif.id}
                className={cn(
                  "p-6 rounded-3xl border transition-all flex items-start gap-6 group relative",
                  notif.read ? "bg-white/[0.02] border-white/5" : "bg-primary-container/5 border-primary-container/20 shadow-lg shadow-red-900/5"
                )}
              >
                {!notif.read && (
                  <div className="mt-1.5 flex-none">
                    <Circle className="w-3 h-3 text-primary-container fill-current" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                   <div className="flex items-center justify-between">
                      <h3 className={cn("text-sm font-black uppercase tracking-tight italic", notif.read ? "text-zinc-400" : "text-white")}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase">{formatTimeAgo(notif.createdAt)}</span>
                   </div>
                   <p className={cn("text-sm font-medium leading-relaxed", notif.read ? "text-zinc-500" : "text-zinc-300")}>
                     {notif.message}
                   </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   {!notif.read && (
                     <button 
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-emerald-500 transition-all"
                     >
                        <CheckCircle2 className="w-5 h-5" />
                     </button>
                   )}
                   <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-red-500 transition-all"
                   >
                      <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <Bell className="w-10 h-10 text-zinc-700" />
             </div>
             <h3 className="text-xl font-black uppercase italic text-white">Không có thông báo</h3>
             <p className="text-zinc-500 font-medium max-w-xs uppercase text-[10px] tracking-widest">Hộp thư của bạn hiện đang trống.</p>
          </div>
        )}
      </main>
    </div>
  );
}
