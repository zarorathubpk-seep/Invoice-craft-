import React, { useState } from 'react';
import { Download, Copy, Check, Eye, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const BrandAssetsPage: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<'main' | 'monogram'>('main');
  const [activeTabTheme, setActiveTabTheme] = useState<'dark' | 'light'>('dark');
  const [copied, setCopied] = useState<string | null>(null);

  const mainSvgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="ic-doc-grad" x1="8" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1D4ED8"/>
      <stop offset="55%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="ic-fold-grad" x1="38" y1="6" x2="54" y2="22" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
    <linearGradient id="ic-check-grad" x1="32" y1="32" x2="58" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <filter id="ic-shadow" x="26" y="26" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>
  <path d="M14 6C10.6863 6 8 8.68629 8 12V52C8 55.3137 10.6863 58 14 58H44C47.3137 58 50 55.3137 50 52V22L34 6H14Z" fill="url(#ic-doc-grad)"/>
  <path d="M34 6V18C34 20.2091 35.7909 22 38 22H50L34 6Z" fill="url(#ic-fold-grad)"/>
  <rect x="15" y="16" width="12" height="3" rx="1.5" fill="#FFFFFF" fill-opacity="0.85"/>
  <rect x="15" y="24" width="22" height="3" rx="1.5" fill="#FFFFFF" fill-opacity="0.85"/>
  <rect x="15" y="32" width="16" height="3" rx="1.5" fill="#FFFFFF" fill-opacity="0.55"/>
  <g filter="url(#ic-shadow)">
    <circle cx="43" cy="43" r="13" fill="url(#ic-check-grad)"/>
    <circle cx="43" cy="43" r="13" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.9"/>
    <path d="M38 43.2L41.3 46.5L48.5 39" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

  const monogramSvgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="ic-letter-grad" x1="6" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1D4ED8"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="ic-check-accent" x1="26" y1="26" x2="56" y2="54" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0D9488"/>
      <stop offset="50%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect x="8" y="10" width="12" height="44" rx="4" fill="url(#ic-letter-grad)" />
  <rect x="11" y="17" width="6" height="2.5" rx="1" fill="#FFFFFF" fill-opacity="0.85" />
  <rect x="11" y="24" width="6" height="2.5" rx="1" fill="#FFFFFF" fill-opacity="0.85" />
  <rect x="11" y="31" width="6" height="2.5" rx="1" fill="#FFFFFF" fill-opacity="0.85" />
  <path d="M48 18C44.5 13 38 10 30 10C19.5 10 14 18 14 32C14 46 20.5 54 31 54C39 54 45.5 50.5 49 44" stroke="url(#ic-letter-grad)" stroke-width="9" stroke-linecap="round" />
  <path d="M29 32L35 38L52 18" stroke="url(#ic-check-accent)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const downloadFile = (fileName: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Official Brand Identity Kit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          InvoiceCraft Favicon & App Icons
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Pixel-crafted, modern vector favicons designed specifically for crisp 16×16 and 32×32 browser tab rendering, 48×48 bookmarks, and high-resolution 512×512 PWA icons.
        </p>
      </div>

      {/* Selector: Main Favicon vs IC Monogram */}
      <div className="flex gap-3 p-1.5 bg-slate-200/70 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setSelectedIcon('main')}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            selectedIcon === 'main'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Main Favicon (Folded Document + Checkmark)
        </button>
        <button
          type="button"
          onClick={() => setSelectedIcon('monogram')}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            selectedIcon === 'monogram'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Alternate Favicon (Interlocking IC Monogram)
        </button>
      </div>

      {/* Main Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big Preview & Downloads */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedIcon === 'main' ? 'Primary Document Mark' : 'Interlocking "IC" Monogram'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent SVG vector · Blue, Cyan & Emerald gradient
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active in Browser Tab
            </span>
          </div>

          {/* Large Hero Icon on Transparent Checkerboard */}
          <div className="relative rounded-2xl border border-slate-200/80 p-12 flex items-center justify-center bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50/50">
            <div className="w-48 h-48 sm:w-56 sm:h-56 transition-transform hover:scale-105 duration-300 drop-shadow-xl">
              <img
                src={selectedIcon === 'main' ? '/favicon.svg' : '/favicon-ic.svg'}
                alt={selectedIcon === 'main' ? 'InvoiceCraft Main Favicon' : 'InvoiceCraft IC Monogram Favicon'}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                downloadFile(
                  selectedIcon === 'main' ? 'favicon.svg' : 'favicon-ic.svg',
                  selectedIcon === 'main' ? mainSvgCode : monogramSvgCode,
                  'image/svg+xml'
                )
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {selectedIcon === 'main' ? 'favicon.svg' : 'favicon-ic.svg'}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  selectedIcon === 'main' ? mainSvgCode : monogramSvgCode,
                  'svg-code'
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              {copied === 'svg-code' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">SVG Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Raw SVG Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Multi-Size Browser Tab Simulation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-World Browser Tab Simulation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Browser Tab Simulation</h3>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTabTheme('dark')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTabTheme === 'dark' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  Dark Tab
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabTheme('light')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTabTheme === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Light Tab
                </button>
              </div>
            </div>

            {/* Simulated Chrome Browser Header */}
            <div
              className={`rounded-xl border p-3 space-y-2 transition-colors ${
                activeTabTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              {/* Window dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>

              {/* Tab bar */}
              <div
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg max-w-xs text-xs font-medium border shadow-xs ${
                  activeTabTheme === 'dark'
                    ? 'bg-slate-800 border-slate-700/80 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <img
                  src={selectedIcon === 'main' ? '/favicon.svg' : '/favicon-ic.svg'}
                  alt="Tab Favicon 16x16"
                  className="w-4 h-4 shrink-0"
                />
                <span className="truncate">InvoiceCraft — Free Online In...</span>
                <span className="ml-auto text-slate-400 hover:text-slate-200 text-xs">×</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              High contrast and bold geometric paths ensure that the fold and checkmark remain instantly readable even at standard 16×16 pixel scale.
            </p>
          </div>

          {/* Scale Verification Matrix: 16x16, 32x32, 48x48, 64x64 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900">Scale Verification Matrix</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">16 × 16 px (Tab)</span>
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[48px]">
                  <img
                    src={selectedIcon === 'main' ? '/favicon.svg' : '/favicon-ic.svg'}
                    alt="16x16 size"
                    className="w-4 h-4"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">32 × 32 px (Retina)</span>
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[48px]">
                  <img
                    src={selectedIcon === 'main' ? '/favicon.svg' : '/favicon-ic.svg'}
                    alt="32x32 size"
                    className="w-8 h-8"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">48 × 48 px (Bookmark)</span>
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[64px]">
                  <img
                    src={selectedIcon === 'main' ? '/favicon.svg' : '/favicon-ic.svg'}
                    alt="48x48 size"
                    className="w-12 h-12"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col items-center">
                <span className="text-[11px] font-semibold text-slate-500 font-mono">64 × 64 px (App Icon)</span>
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[64px]">
                  <img
                    src={selectedIcon === 'main' ? '/favicon.svg' : '/favicon-ic.svg'}
                    alt="64x64 size"
                    className="w-16 h-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
