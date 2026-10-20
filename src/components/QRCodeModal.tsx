import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { GreetingCard } from '../types/greeting';
import { buildCardShareUrl, buildWhatsAppShareUrl } from '../utils/storage';

interface QRCodeModalProps {
  card: GreetingCard;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ card, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = buildCardShareUrl(card.id);
  const whatsappUrl = buildWhatsAppShareUrl(card);

  // Generate SVG QR code via public Google Charts / QR service API for crisp rendering
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-stone-900 border border-amber-500/30 text-stone-100 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-5">
          <span className="text-amber-400 text-xs font-semibold tracking-wider uppercase">Dussehra Card QR</span>
          <h3 className="text-lg font-bold font-festive text-amber-100">Scan to Open Greeting</h3>
          <p className="text-xs text-stone-400">Card for {card.friendName}</p>
        </div>

        {/* QR Code Frame */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner border-2 border-amber-400/40 mx-auto w-fit">
          <img
            src={qrImageUrl}
            alt={`QR code for ${card.friendName}'s Dussehra greeting`}
            className="w-48 h-48 rounded"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] text-stone-500 font-medium mt-2">Scan with camera or WhatsApp</span>
        </div>

        {/* URL Display and Action */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 p-2 bg-stone-950/70 rounded-lg border border-stone-800 text-xs text-stone-300 font-mono">
            <span className="truncate flex-1">{shareUrl}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-stone-800 rounded transition-colors"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              Send on WhatsApp
            </a>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4" />
              Open Card
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
