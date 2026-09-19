"use client";

import React, { useState } from 'react';
import { Upload, Film, FileVideo, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

export default function AddMoviePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [episodeId, setEpisodeId] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !episodeId) return;

    setUploading(true);
    setStatus('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('episodeId', episodeId);

    try {
      await api.post('/admin/video/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        },
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary-container/10 rounded-2xl border border-primary-container/20">
          <Film className="w-8 h-8 text-primary-container" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight italic">Thêm Phim / Anime mới</h1>
          <p className="text-zinc-500 font-bold mt-1 uppercase text-xs tracking-widest">Tải video lên và tự động xử lý sang chuẩn 4K Streaming (HLS).</p>
        </div>
      </div>

      <div className="bg-[#0f0f0f] rounded-3xl border border-white/5 p-10 space-y-8">
        {/* Episode ID Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">ID Tập phim (Episode ID)</label>
          <input 
            type="text" 
            value={episodeId}
            onChange={(e) => setEpisodeId(e.target.value)}
            placeholder="Nhập ID tập phim để gán video..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary-container/50 focus:outline-none transition-all"
          />
        </div>

        {/* Upload Area */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Tệp Video gốc (.mp4, .mkv, .mov)</label>
          <div 
            className={cn(
              "border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer",
              file ? "border-primary-container/50 bg-primary-container/5" : "border-white/5 hover:border-white/10 bg-zinc-900/50",
              uploading && "pointer-events-none opacity-50"
            )}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input 
              id="fileInput"
              type="file" 
              className="hidden" 
              accept="video/*" 
              onChange={handleFileChange}
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-primary-container/20 rounded-2xl">
                  <FileVideo className="w-12 h-12 text-primary-container" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold">{file.name}</p>
                  <p className="text-zinc-500 text-[10px] font-black uppercase mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-zinc-800 rounded-2xl">
                  <Upload className="w-12 h-12 text-zinc-500" />
                </div>
                <div>
                  <p className="text-white font-black uppercase tracking-tight italic">Kéo thả hoặc Click để chọn Video</p>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1">Hỗ trợ tệp lên đến 10GB cho chuẩn 4K HDR</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status !== 'idle' && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status === 'uploading' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                {status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest italic",
                  status === 'uploading' && "text-blue-500",
                  status === 'success' && "text-emerald-500",
                  status === 'error' && "text-red-500"
                )}>
                  {status === 'uploading' && `Đang tải lên... ${progress}%`}
                  {status === 'success' && 'Tải lên thành công! Đang chờ Transcode...'}
                  {status === 'error' && 'Đã có lỗi xảy ra. Thử lại?'}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-300",
                  status === 'uploading' ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                )} 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          disabled={!file || !episodeId || uploading}
          onClick={handleUpload}
          className="w-full bg-primary-container hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] italic transition-all shadow-2xl shadow-red-900/20 active:scale-[0.98]"
        >
          {uploading ? 'Đang thực hiện...' : 'Bắt đầu xử lý Video'}
        </button>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex items-start gap-4">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <Info className="w-5 h-5 text-blue-500" />
        </div>
        <div className="space-y-1">
          <h4 className="text-white font-bold text-sm uppercase tracking-tight italic">Lưu ý hệ thống</h4>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Sau khi tải lên hoàn tất, hệ thống Worker sẽ tự động thực hiện **Transcoding đa luồng (Multi-threaded)**. 
            Video sẽ được tạo ra các phiên bản 4K, 2K, 1080p và 720p theo chuẩn Adaptive HLS để tối ưu băng thông người dùng.
          </p>
        </div>
      </div>
    </div>
  );
}

function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
