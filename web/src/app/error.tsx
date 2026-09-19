"use client";

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased flex items-center justify-center">
      <div className="text-center space-y-8 p-12 max-w-lg">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <span className="text-4xl">⚠</span>
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Đã xảy ra lỗi</h1>
        <p className="text-zinc-500 font-medium leading-relaxed">
          Rất tiếc, đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại hoặc quay về trang chủ.
        </p>
        <p className="text-[10px] text-zinc-600 font-mono bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          {error.message || 'Lỗi không xác định'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-10 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="px-10 py-4 bg-surface-container border border-outline/10 text-on-surface font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-surface-container-high transition-all"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
