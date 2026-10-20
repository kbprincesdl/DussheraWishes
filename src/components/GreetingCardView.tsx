import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles, 
  MessageCircle, 
  Flame, 
  Heart, 
  Send, 
  Check, 
  Copy, 
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { GreetingCard, CardReply } from '../types/greeting';
import { THEMES } from '../data/themes';
import { festiveAudio } from '../utils/audio';
import { 
  recordCardView, 
  recordCardInteraction, 
  addCardReply, 
  buildWhatsAppReplyUrl, 
  buildCardShareUrl 
} from '../utils/storage';

interface GreetingCardViewProps {
  card: GreetingCard;
  isEmbeddedPreview?: boolean;
  onBackToStudio?: () => void;
}

export const GreetingCardView: React.FC<GreetingCardViewProps> = ({
  card,
  isEmbeddedPreview = false,
  onBackToStudio
}) => {
  const theme = THEMES[card.themeId] || THEMES.royal_saffron;

  // Interactivity states
  const [isDiyaLit, setIsDiyaLit] = useState(card.hasInteracted && card.layoutId === 'interactive_diya');
  const [isArrowShot, setIsArrowShot] = useState(card.hasInteracted && card.layoutId === 'archery_victory');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(card.hasInteracted || card.layoutId !== 'royal_envelope');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedReaction, setSelectedReaction] = useState('🪔');
  const [replySubmitted, setReplySubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReplySheet, setShowReplySheet] = useState(false);

  const viewRecordedRef = useRef(false);

  // Trigger celebration confetti
  const triggerFestiveConfetti = (colors: string[] = theme.sparkleColors) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });
  };

  // Shower marigold & rose petals
  const showerMarigoldPetals = () => {
    festiveAudio.playTempleBell(783.99);
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.3 },
      colors: ['#f59e0b', '#fbbf24', '#f97316', '#dc2626', '#fef08a'],
      shapes: ['circle'],
      scalar: 1.2
    });
    recordCardInteraction(card.id, {
      type: 'flowers_showered',
      timestamp: new Date().toISOString()
    });
  };

  // Record view on mount if not in preview mode
  useEffect(() => {
    if (!viewRecordedRef.current && !isEmbeddedPreview) {
      viewRecordedRef.current = true;
      recordCardView(card.id);
    }
    return () => {
      festiveAudio.stopAmbientMusic();
    };
  }, [card.id, isEmbeddedPreview]);

  // Audio toggle
  const toggleMusic = () => {
    if (isMusicPlaying) {
      festiveAudio.stopAmbientMusic();
      setIsMusicPlaying(false);
    } else {
      festiveAudio.startAmbientMusic();
      setIsMusicPlaying(true);
      recordCardInteraction(card.id, {
        type: 'music_played',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Light Diya handler
  const handleLightDiya = () => {
    setIsDiyaLit(true);
    festiveAudio.playDiyaLightingSound();
    triggerFestiveConfetti(['#fbbf24', '#f59e0b', '#f97316', '#ffffff']);
    recordCardInteraction(card.id, {
      type: 'diya_lit',
      timestamp: new Date().toISOString()
    });
  };

  // Shoot Golden Arrow handler
  const handleShootArrow = () => {
    setIsArrowShot(true);
    festiveAudio.playArrowShootSound();
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.4 },
        colors: ['#eab308', '#f59e0b', '#ef4444', '#ffffff', '#38bdf8']
      });
    }, 400);
    recordCardInteraction(card.id, {
      type: 'arrow_shot',
      timestamp: new Date().toISOString()
    });
  };

  // Open Royal Envelope handler
  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    festiveAudio.playTempleBell(659.25);
    triggerFestiveConfetti();
    recordCardInteraction(card.id, {
      type: 'envelope_opened',
      timestamp: new Date().toISOString()
    });
  };

  // Handle WhatsApp reply click
  const handleWhatsAppReplyClick = () => {
    recordCardInteraction(card.id, {
      type: 'whatsapp_reply_clicked',
      timestamp: new Date().toISOString()
    });
  };

  // Submit in-app guestbook reply
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addCardReply(card.id, {
      senderName: card.friendName,
      message: replyText.trim(),
      reaction: selectedReaction,
      platform: 'app'
    });

    festiveAudio.playTempleBell(880);
    setReplySubmitted(true);
    triggerFestiveConfetti();
    setReplyText('');
    setTimeout(() => {
      setShowReplySheet(false);
      setReplySubmitted(false);
    }, 2500);
  };

  // Copy card link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildCardShareUrl(card.id));
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  // Native share
  const handleNativeShare = async () => {
    const url = buildCardShareUrl(card.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Dussehra Wishes for ${card.friendName}`,
          text: `✨ Personalized Dussehra & Vijayadashami greeting for ${card.friendName} from ${card.senderName}`,
          url: url
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-b ${theme.bgGradient} text-white flex flex-col justify-between overflow-x-hidden selection:bg-amber-500`}>
      {/* Background festive image with atmospheric scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={theme.imageSrc}
          alt={theme.name}
          className="w-full h-full object-cover opacity-25 scale-105 filter blur-[1px] transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85" />
      </div>

      {/* Top Floating App Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 backdrop-blur-md bg-black/25">
        <div className="flex items-center gap-3">
          {onBackToStudio && (
            <button
              onClick={onBackToStudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-200 bg-white/10 hover:bg-white/20 border border-amber-400/30 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Creator Studio
            </button>
          )}
          <span className="text-xs tracking-wider uppercase text-amber-300/80 font-medium font-festive">
            Vijayadashami 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isMusicPlaying
                ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            title="Toggle festive music"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden sm:inline">Playing Raga</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Play Festive Music</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleNativeShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            title="Share this greeting"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 max-w-xl mx-auto w-full my-auto">
        {/* Envelope Unfold Mode Initial View */}
        {card.layoutId === 'royal_envelope' && !isEnvelopeOpen && (
          <div className="w-full text-center space-y-6 py-8 animate-fade-in">
            <div className="relative mx-auto w-72 sm:w-80 h-52 rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 p-6 shadow-2xl border-2 border-amber-400/50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-200 cursor-pointer transform hover:scale-105 transition-transform"
                onClick={handleOpenEnvelope}
              >
                <span className="text-2xl font-bold font-devanagari text-amber-950">ॐ</span>
              </div>
              <p className="text-amber-100 font-festive text-sm font-semibold mt-4">
                Special Greeting for {card.friendName}
              </p>
              <span className="text-[11px] text-amber-300/80">From {card.senderName}</span>
            </div>

            <button
              onClick={handleOpenEnvelope}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 rounded-xl shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Break the Royal Seal & Read Card
            </button>
          </div>
        )}

        {/* Archery Victory Mode Initial State */}
        {card.layoutId === 'archery_victory' && !isArrowShot && (
          <div className="w-full text-center space-y-6 py-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-amber-400/30 shadow-2xl">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Triumph of Virtue</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-festive text-amber-100 mt-1">
                Lord Rama’s Golden Bow
              </h2>
              <p className="text-xs text-amber-200/80 max-w-sm mx-auto mt-2">
                Dear {card.friendName}, aim and release the golden arrow to conquer negativity, burn evil like Ravana, and unlock your Vijayadashami blessing!
              </p>

              <div className="my-8 relative flex items-center justify-center">
                <div className="w-44 h-44 rounded-full border border-amber-400/20 flex items-center justify-center animate-pulse">
                  <div className="w-32 h-32 rounded-full border border-amber-400/40 flex items-center justify-center">
                    <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">🏹</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleShootArrow}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-xl shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Launch the Arrow of Victory
              </button>
            </div>
          </div>
        )}

        {/* Interactive Diya Mode Initial State */}
        {card.layoutId === 'interactive_diya' && !isDiyaLit && (
          <div className="w-full text-center space-y-6 py-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-amber-400/30 shadow-2xl">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Auspicious Muhurat</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-festive text-amber-100 mt-1">
                Light the Sacred Diya
              </h2>
              <p className="text-xs text-amber-200/80 max-w-sm mx-auto mt-2">
                Touch the lamp to spark the flame of knowledge, peace, and eternal triumph for {card.friendName}.
              </p>

              <div className="my-8 flex justify-center cursor-pointer group" onClick={handleLightDiya}>
                <div className="relative p-6 rounded-full bg-amber-500/10 border border-amber-400/20 group-hover:scale-105 transition-transform">
                  <span className="text-7xl filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">🪔</span>
                </div>
              </div>

              <button
                onClick={handleLightDiya}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 rounded-xl shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Flame className="w-4 h-4 text-orange-600" />
                Tap to Light the Diya
              </button>
            </div>
          </div>
        )}

        {/* Revealed Greeting Card (Rendered when unlocked or for scroll layout) */}
        {(card.layoutId === 'festive_scroll' || 
          (card.layoutId === 'royal_envelope' && isEnvelopeOpen) ||
          (card.layoutId === 'archery_victory' && isArrowShot) ||
          (card.layoutId === 'interactive_diya' && isDiyaLit)) && (
          <div className="w-full space-y-5 animate-fade-in">
            {/* The Greeting Card Surface */}
            <div className={`relative rounded-3xl p-6 sm:p-8 shadow-2xl ${theme.cardBg} border-2 ${theme.borderStyle} overflow-hidden`}>
              {/* Subtle top ornament */}
              <div className="flex items-center justify-center gap-3 text-amber-400/70 mb-4">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
                <span className="text-xs font-serif-festive tracking-widest uppercase">शुभ विजयदशमी</span>
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
              </div>

              {/* Lit Diya Centerpiece */}
              <div className="flex justify-center mb-3">
                <div className="relative flex items-center justify-center">
                  <span className="text-5xl animate-diya-flame">🪔</span>
                  <div className="absolute -top-4 w-12 h-12 bg-amber-400/30 rounded-full blur-xl pointer-events-none" />
                </div>
              </div>

              {/* Recipient Title */}
              <div className="text-center space-y-2 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-festive tracking-tight text-amber-100 gold-foil-text">
                  {card.headline}
                </h1>
                <p className="text-sm font-semibold text-amber-300/90 font-festive">
                  Specially crafted for {card.friendName}
                </p>
              </div>

              {/* Shloka Quote Box */}
              {card.shloka && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-amber-400/25 text-center mb-6">
                  <p className="text-sm font-devanagari text-amber-200 font-medium leading-relaxed">
                    {card.shloka}
                  </p>
                </div>
              )}

              {/* Heartfelt Message Body */}
              <div className="space-y-4 text-center">
                <p className="text-base sm:text-lg leading-relaxed text-amber-50/95 font-medium">
                  {card.message}
                </p>

                {/* Sender Signature */}
                <div className="pt-4 border-t border-amber-500/20 text-center">
                  <p className="text-xs tracking-wider uppercase text-amber-400/80">With Warmth & Blessings,</p>
                  <p className="text-lg font-bold font-festive text-amber-200 mt-0.5">
                    {card.senderName} 🪔
                  </p>
                </div>
              </div>

              {/* Quick Card Action Buttons */}
              <div className="mt-6 pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={showerMarigoldPetals}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Shower Petals 🌸
                </button>

                <button
                  onClick={() => setShowReplySheet(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Reply Back 💬
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Response Banner */}
            <div className="p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Instant WhatsApp Reply
                  </h4>
                  <p className="text-xs text-stone-300">
                    Send your Dussehra thank-you directly to {card.senderName}
                  </p>
                </div>
              </div>

              <a
                href={buildWhatsAppReplyUrl(card)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppReplyClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Reply on WhatsApp
              </a>
            </div>

            {/* Guestbook Replies Feed */}
            {card.replies && card.replies.length > 0 && (
              <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/80">
                  Replies from Friends ({card.replies.length})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {card.replies.map(rep => (
                    <div key={rep.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span>{rep.reaction}</span>
                          <span className="font-semibold text-amber-200">{rep.senderName}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 tabular-nums">
                          {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-stone-200 leading-relaxed pl-5">&ldquo;{rep.message}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reply Modal / Bottom Sheet */}
      {showReplySheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-stone-900 border border-amber-500/40 text-stone-100 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Leave a Blessing</span>
                <h3 className="text-lg font-bold font-festive text-amber-100">Reply to {card.senderName}</h3>
              </div>
              <button
                onClick={() => setShowReplySheet(false)}
                className="p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800"
              >
                <ChevronDown className="w-5 h-5 sm:hidden" />
                <span className="hidden sm:inline text-xs font-bold">✕</span>
              </button>
            </div>

            {replySubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-amber-100 font-festive">Festive Reply Sent!</h4>
                <p className="text-xs text-stone-400">{card.senderName} will see your message in their tracker.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">Select a Festive Reaction</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {['🪔', '🏹', '🌸', '🍬', '✨', '💖', '🎉'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedReaction(emoji)}
                        className={`text-xl p-2 rounded-xl border transition-all ${
                          selectedReaction === emoji
                            ? 'bg-amber-500/20 border-amber-400 scale-110'
                            : 'bg-stone-800/60 border-stone-700 hover:bg-stone-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">Your Message / Dussehra Wish</label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`e.g. "Happy Dussehra ${card.senderName}! Loved your card. Wishing you and family tons of happiness and sweets!"`}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={buildWhatsAppReplyUrl(card, replyText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppReplyClick}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send via WhatsApp
                  </a>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Post in Guestbook
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-20 py-3 px-4 border-t border-white/10 text-center text-xs text-stone-400 backdrop-blur-md bg-black/25">
        <p>
          Celebrate Vijayadashami · Triumph of Light over Darkness · Happy Dussehra
        </p>
      </footer>
    </div>
  );
};
