export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-['Be_Vietnam_Pro'] antialiased flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-container rounded-full animate-spin"></div>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-sm animate-pulse">Đang tải</p>
        <div className="flex gap-1 justify-center">
          <div className="w-2 h-2 bg-primary-container rounded-full animate-bounce [animation-delay:0ms]"></div>
          <div className="w-2 h-2 bg-primary-container rounded-full animate-bounce [animation-delay:150ms]"></div>
          <div className="w-2 h-2 bg-primary-container rounded-full animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  );
}
