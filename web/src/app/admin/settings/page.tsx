"use client";

import React, { useState } from 'react';
import { Shield, Save, Loader2, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const [siteName, setSiteName] = useState('CineStream');
  const [siteDescription, setSiteDescription] = useState('Nền tảng giải trí chất lượng cao');
  const [maxUploadSize, setMaxUploadSize] = useState('2GB');
  const [defaultQuality, setDefaultQuality] = useState('1080p');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Cài đặt Hệ thống</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-1">Cấu hình hệ thống và quản lý máy chủ</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-4 bg-primary-container text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Đã lưu' : 'Lưu cài đặt'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 space-y-6">
          <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary-container" /> Thông tin chung
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Tên trang web</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 outline-none focus:border-primary-container text-sm font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Mô tả</label>
              <textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 outline-none focus:border-primary-container text-sm font-bold h-24" />
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 space-y-6">
          <h3 className="text-lg font-black text-white uppercase italic">Upload & Phát</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Kích thước upload tối đa</label>
              <select value={maxUploadSize} onChange={(e) => setMaxUploadSize(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 outline-none focus:border-primary-container text-sm font-bold">
                <option value="500MB">500 MB</option>
                <option value="1GB">1 GB</option>
                <option value="2GB">2 GB</option>
                <option value="5GB">5 GB</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Chất lượng mặc định</label>
              <select value={defaultQuality} onChange={(e) => setDefaultQuality(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 outline-none focus:border-primary-container text-sm font-bold">
                <option value="1080p">1080p FHD</option>
                <option value="720p">720p HD</option>
                <option value="4K">4K UHD</option>
                <option value="auto">Tự động</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl">
              <div>
                <span className="text-sm font-bold text-white">Chế độ bảo trì</span>
                <p className="text-[10px] text-zinc-500 font-medium">Chặn tất cả truy cập từ người dùng</p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-14 h-8 rounded-full transition-all ${maintenanceMode ? 'bg-red-500' : 'bg-zinc-700'} relative`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${maintenanceMode ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 space-y-6">
          <h3 className="text-lg font-black text-white uppercase italic">CDN & Edge</h3>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">Edge Node 01 (Singapore)</span>
                <p className="text-[10px] text-zinc-500 font-medium">Đang hoạt động • 45ms</p>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">Edge Node 02 (Tokyo)</span>
                <p className="text-[10px] text-zinc-500 font-medium">Đang hoạt động • 80ms</p>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">Edge Node 03 (San Francisco)</span>
                <p className="text-[10px] text-zinc-500 font-medium">Đang hoạt động • 180ms</p>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 space-y-6">
          <h3 className="text-lg font-black text-white uppercase italic">Thống kê hệ thống</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900 rounded-xl">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">CPU</span>
              <div className="mt-2 text-2xl font-black text-white">34%</div>
              <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[34%]"></div>
              </div>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">RAM</span>
              <div className="mt-2 text-2xl font-black text-white">62%</div>
              <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[62%]"></div>
              </div>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Disk</span>
              <div className="mt-2 text-2xl font-black text-white">45%</div>
              <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[45%]"></div>
              </div>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Băng thông</span>
              <div className="mt-2 text-2xl font-black text-white">12.4 Gbps</div>
              <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[78%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
