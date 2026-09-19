"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased flex items-center justify-center">
      <div className="text-center space-y-8 p-12">
        <div className="relative">
          <h1 className="text-[180px] font-black text-white/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black uppercase italic tracking-tighter text-white">Không tìm thấy</span>
          </div>
        </div>
        <p className="text-zinc-500 font-medium max-w-md mx-auto leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại đường dẫn.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-10 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all"
          >
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-10 py-4 bg-surface-container border border-outline/10 text-on-surface font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-surface-container-high transition-all"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
