import React from 'react';

interface AdPlaceholderProps {
  slotId?: string;
  format?: 'banner' | 'rectangle' | 'leaderboard';
  className?: string;
}

/**
 * RevBid & Publisher Network Monetization Placeholder
 * Strict compliance rules:
 * - Marked as 'no-print' so it is NEVER included in exported invoice PDFs or printed copies
 * - Non-intrusive placement separated from functional invoice editor controls
 * - Inactive by default until real ad provider script is configured
 */
export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotId = 'slot-default',
  format = 'leaderboard',
  className = '',
}) => {
  // Can be controlled by an environment variable or config flag
  const isEnabled = false; // Intentionally disabled until real ad network keys are supplied

  if (!isEnabled) {
    // Render clean reserved slot container with subtle publisher disclosure
    return (
      <div
        className={`no-print mx-auto my-6 border border-dashed border-slate-200 bg-slate-50/70 rounded-lg p-3 text-center ${className}`}
        aria-label="Monetization Partner Section"
      >
        <div className="flex flex-col items-center justify-center gap-1 min-h-[72px]">
          <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
            Sponsorship & Ad Zone
          </span>
          <p className="text-xs text-slate-500 max-w-md">
            This space is reserved for vetted business software sponsors. Zero trackers active during current session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`no-print my-6 flex justify-center ${className}`}>
      <div id={`revbid-ad-${slotId}`} className="min-h-[90px] w-full max-w-[728px] bg-slate-100 flex items-center justify-center text-xs text-slate-400">
        Ad Slot {slotId}
      </div>
    </div>
  );
};
