import React, { useRef, useState } from 'react';
import { InvoiceCustomization, TemplateId } from '../../types/invoice.ts';
import { Palette, PenTool, Stamp, Sparkles, Check, Trash2 } from 'lucide-react';

interface CustomizationPanelProps {
  customization: InvoiceCustomization;
  onChange: (customization: InvoiceCustomization) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ customization, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type');

  const templates: { id: TemplateId; name: string; desc: string }[] = [
    { id: 'modern_minimal', name: 'Modern Minimal', desc: 'Clean, spacious, contemporary sans styling' },
    { id: 'classic', name: 'Classic Professional', desc: 'Standard business structure with formal tabular borders' },
    { id: 'elegant_blue', name: 'Elegant Blue', desc: 'Vibrant Royal Blue accents with teal contrast' },
    { id: 'executive_navy', name: 'Executive Navy', desc: 'Midnight navy banner header for prestigious agencies' },
    { id: 'clean_corporate', name: 'Clean Corporate', desc: 'Subtle gray shaded backgrounds and clean geometry' },
    { id: 'creative_freelancer', name: 'Creative Freelancer', desc: 'Distinctive typography and modern creative flair' },
  ];

  const colorPresets = [
    { name: 'Royal Blue', hex: '#2563EB' },
    { name: 'Midnight Navy', hex: '#102A43' },
    { name: 'Deep Blue', hex: '#1D4ED8' },
    { name: 'Emerald Teal', hex: '#0D9488' },
    { name: 'Rich Amber', hex: '#D97706' },
    { name: 'Cool Slate', hex: '#334155' },
    { name: 'Forest Green', hex: '#16A34A' },
    { name: 'Burgundy', hex: '#991B1B' },
  ];

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#102A43';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange({ ...customization, signatureUrl: dataUrl });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange({ ...customization, signatureUrl: undefined });
  };

  return (
    <div className="space-y-6 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Template Styling & Customization</h3>
        </div>
      </div>

      {/* 1. Template Selection Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">Choose Invoice Template</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {templates.map((tpl) => {
            const isSelected = customization.templateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChange({ ...customization, templateId: tpl.id })}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                <p className="font-semibold text-xs text-slate-900">{tpl.name}</p>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{tpl.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Scheme & Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
        <div>
          <label className="block font-medium text-slate-700 mb-1.5">Brand Accent Color</label>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {colorPresets.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => onChange({ ...customization, accentColor: c.hex })}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                  customization.accentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'scale-125 ring-2 ring-blue-500 ring-offset-1 border-white'
                    : 'border-slate-300 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customization.accentColor}
              onChange={(e) => onChange({ ...customization, accentColor: e.target.value })}
              className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5"
            />
            <span className="text-[11px] font-mono text-slate-600 uppercase">{customization.accentColor}</span>
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1.5">Font Style</label>
          <select
            value={customization.fontFamily}
            onChange={(e) => onChange({ ...customization, fontFamily: e.target.value })}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
            <option value="Inter, sans-serif">Inter (Standard Sans)</option>
            <option value="system-ui, sans-serif">System UI</option>
            <option value="Georgia, serif">Georgia (Traditional Editorial)</option>
            <option value="Courier New, monospace">Courier (Typewriter Monospace)</option>
          </select>
        </div>
      </div>

      {/* 3. Watermark Controls */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Stamp className="w-4 h-4 text-slate-600" />
            <span className="font-medium text-slate-800">Watermark Overlay</span>
          </div>
          <input
            type="checkbox"
            id="toggle-watermark"
            checked={customization.showWatermark}
            onChange={(e) => onChange({ ...customization, showWatermark: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {customization.showWatermark && (
          <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-200">
            <input
              type="text"
              value={customization.watermarkText || ''}
              onChange={(e) => onChange({ ...customization, watermarkText: e.target.value })}
              placeholder="e.g. DRAFT / PAID / COPY / SAMPLE"
              className="w-full px-2.5 py-1 border border-slate-300 rounded bg-white text-slate-900 uppercase font-bold"
            />
            <div className="flex gap-1 shrink-0">
              {['DRAFT', 'PAID', 'SAMPLE'].map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => onChange({ ...customization, watermarkText: text })}
                  className="px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[10px] font-semibold text-slate-700"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Signature Block */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-slate-600" />
            <span className="font-medium text-slate-800">Authorized Signature</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSignatureMode('type')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                signatureMode === 'type' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              Type Name
            </button>
            <button
              type="button"
              onClick={() => setSignatureMode('draw')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                signatureMode === 'draw' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              Draw
            </button>
          </div>
        </div>

        {signatureMode === 'draw' ? (
          <div className="space-y-1.5">
            <div className="border border-slate-300 bg-white rounded p-1">
              <canvas
                ref={canvasRef}
                width={300}
                height={80}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-20 cursor-crosshair touch-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Sign with mouse or stylus</span>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-[10px] text-red-600 hover:text-red-700 flex items-center gap-0.5"
              >
                <Trash2 className="w-3 h-3" /> Clear Signature
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Signatory Name</label>
              <input
                type="text"
                value={customization.signatureName || ''}
                onChange={(e) => onChange({ ...customization, signatureName: e.target.value })}
                placeholder="Marcus Vance"
                className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Date</label>
              <input
                type="date"
                value={customization.signatureDate || ''}
                onChange={(e) => onChange({ ...customization, signatureDate: e.target.value })}
                className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
