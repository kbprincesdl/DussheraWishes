import React from 'react';
import { X, MessageCircle, Heart, Clock, ArrowRight } from 'lucide-react';
import { GreetingCard } from '../types/greeting';
import { buildWhatsAppReplyUrl } from '../utils/storage';

interface RepliesModalProps {
  card: GreetingCard;
  onClose: () => void;
}

export const RepliesModal: React.FC<RepliesModalProps> = ({ card, onClose }) => {
  const replies = card.replies || [];
  const interactions = card.interactions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-stone-900 border border-amber-500/30 text-stone-100 p-6 shadow-2xl max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-amber-400 text-xs font-semibold tracking-wider uppercase">Guestbook & Replies</span>
          <h3 className="text-xl font-bold font-festive text-amber-100">
            Messages from {card.friendName}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'} · {interactions.length} festive interactions
          </p>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {replies.length === 0 ? (
            <div className="text-center py-10 px-4 bg-stone-950/40 rounded-xl border border-stone-800">
              <MessageCircle className="w-10 h-10 mx-auto text-amber-400/50 mb-2" />
              <p className="text-sm font-medium text-stone-300">No replies received yet</p>
              <p className="text-xs text-stone-500 mt-1">
                When {card.friendName} opens the greeting and replies via WhatsApp or in-app guestbook, their message will appear here.
              </p>
            </div>
          ) : (
            replies.map(reply => (
              <div
                key={reply.id}
                className="p-4 rounded-xl bg-stone-950/60 border border-amber-500/20 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{reply.reaction || '🪔'}</span>
                    <span className="font-semibold text-amber-200">{reply.senderName}</span>
                    {reply.platform && (
                      <span className="text-[11px] text-stone-400">
                        via {reply.platform === 'whatsapp' ? 'WhatsApp' : 'Digital Card'}
                      </span>
                    )}
                  </div>
                  <span className="text-stone-500 tabular-nums">
                    {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-stone-200 leading-relaxed pl-7">
                  &ldquo;{reply.message}&rdquo;
                </p>
              </div>
            ))
          )}

          {/* Activity Log */}
          {interactions.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Interaction Timeline
              </h4>
              <div className="space-y-1.5 text-xs text-stone-400 bg-stone-950/30 p-3 rounded-lg border border-stone-800">
                {interactions.map((int, i) => (
                  <div key={i} className="flex items-center justify-between py-0.5">
                    <span className="text-stone-300">
                      {int.type === 'diya_lit' && '🪔 Lit the Sacred Diya'}
                      {int.type === 'arrow_shot' && '🏹 Launched Rama’s Golden Victory Arrow'}
                      {int.type === 'envelope_opened' && '✉️ Opened the Royal Envelope'}
                      {int.type === 'flowers_showered' && '🌸 Showered Marigold & Rose Petals'}
                      {int.type === 'whatsapp_reply_clicked' && '💬 Clicked WhatsApp Reply'}
                      {int.type === 'music_played' && '🎵 Enjoyed Festive Music'}
                    </span>
                    <span className="text-[11px] text-stone-500 tabular-nums">
                      {new Date(int.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                      {new Date(int.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Chat link */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
          <a
            href={buildWhatsAppReplyUrl(card)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with {card.friendName} on WhatsApp
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
