import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Flame, 
  Mail, 
  Scroll, 
  MessageCircle, 
  Check, 
  BookOpen, 
  Phone, 
  Music,
  Eye
} from 'lucide-react';
import { GreetingCard, ThemeId, LayoutId, Relationship, MusicTrack } from '../types/greeting';
import { THEMES, LAYOUT_OPTIONS } from '../data/themes';
import { MESSAGE_TEMPLATES, MessageTemplate } from '../data/messages';
import { generateFestiveGreeting } from '../utils/gemini';
import { GreetingCardView } from './GreetingCardView';

interface CardStudioModalProps {
  cardToEdit?: GreetingCard | null;
  defaultSenderName: string;
  defaultSenderWhatsApp: string;
  onSave: (card: GreetingCard) => void;
  onClose: () => void;
}

export const CardStudioModal: React.FC<CardStudioModalProps> = ({
  cardToEdit,
  defaultSenderName,
  defaultSenderWhatsApp,
  onSave,
  onClose
}) => {
  const isEditing = Boolean(cardToEdit);

  // Form states
  const [friendName, setFriendName] = useState(cardToEdit?.friendName || '');
  const [senderName, setSenderName] = useState(cardToEdit?.senderName || defaultSenderName || 'Kabir');
  const [senderWhatsApp, setSenderWhatsApp] = useState(cardToEdit?.senderWhatsApp || defaultSenderWhatsApp || '');
  const [relationship, setRelationship] = useState<Relationship>(cardToEdit?.relationship || 'best_friend');
  const [themeId, setThemeId] = useState<ThemeId>(cardToEdit?.themeId || 'royal_saffron');
  const [layoutId, setLayoutId] = useState<LayoutId>(cardToEdit?.layoutId || 'interactive_diya');
  const [headline, setHeadline] = useState(cardToEdit?.headline || 'Happy Vijayadashami & Dussehra!');
  const [shloka, setShloka] = useState(cardToEdit?.shloka || 'यतो धर्मस्ततो जयः (Where there is Righteousness, there is Victory)');
  const [message, setMessage] = useState(
    cardToEdit?.message || 
    'May this auspicious day of Dussehra illuminate your path with courage, joy, and boundless prosperity. Wishing you and your loved ones triumphant moments and sweet celebrations!'
  );
  const [musicTrack, setMusicTrack] = useState<MusicTrack>(cardToEdit?.musicTrack || 'festive_shehnai');

  // AI Generator state
  const [aiTone, setAiTone] = useState<'heartfelt' | 'witty' | 'spiritual' | 'poetic' | 'professional'>('heartfelt');
  const [aiLanguage, setAiLanguage] = useState<'English' | 'Hindi' | 'Hinglish' | 'Marathi' | 'Telugu'>('English');
  const [specialMemory, setSpecialMemory] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showTemplatesPicker, setShowTemplatesPicker] = useState(false);
  const [previewTab, setPreviewTab] = useState<'form' | 'preview'>('form');

  // Construct draft card for live preview
  const draftCard: GreetingCard = {
    id: cardToEdit?.id || 'draft-card',
    friendName: friendName || 'Friend Name',
    senderName: senderName || 'Your Name',
    senderWhatsApp,
    relationship,
    themeId,
    layoutId,
    headline,
    message,
    shloka,
    musicTrack,
    createdAt: cardToEdit?.createdAt || new Date().toISOString(),
    viewCount: cardToEdit?.viewCount || 0,
    firstViewedAt: cardToEdit?.firstViewedAt || null,
    lastViewedAt: cardToEdit?.lastViewedAt || null,
    hasInteracted: cardToEdit?.hasInteracted || false,
    interactedAt: cardToEdit?.interactedAt || null,
    interactions: cardToEdit?.interactions || [],
    replies: cardToEdit?.replies || []
  };

  // Handle AI generation
  const handleGenerateAI = async () => {
    if (!friendName.trim()) {
      alert('Please enter your friend’s name first!');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const res = await generateFestiveGreeting({
        friendName: friendName.trim(),
        senderName: senderName.trim(),
        relationship,
        tone: aiTone,
        language: aiLanguage,
        specialMention: specialMemory.trim() || undefined
      });
      setHeadline(res.headline);
      setShloka(res.shloka);
      setMessage(res.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Apply curated template
  const applyTemplate = (tpl: MessageTemplate) => {
    setHeadline(tpl.headline);
    setShloka(tpl.shloka || '');
    setMessage(tpl.message);
    setShowTemplatesPicker(false);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;

    const finalCard: GreetingCard = {
      ...draftCard,
      id: cardToEdit?.id || `card-${friendName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`,
      friendName: friendName.trim(),
      senderName: senderName.trim(),
      senderWhatsApp: senderWhatsApp.trim() || undefined,
      headline: headline.trim(),
      message: message.trim(),
      shloka: shloka.trim() || undefined
    };

    onSave(finalCard);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-stone-900 border border-amber-500/30 text-stone-100 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-festive text-amber-100">
                {isEditing ? `Edit Greeting for ${friendName}` : 'Create Personalized Dussehra Greeting'}
              </h2>
              <p className="text-xs text-stone-400">Customize festive theme, layout, audio, and heartfelt wishes</p>
            </div>
          </div>

          {/* Mobile Tab switch for Form vs Preview */}
          <div className="flex items-center gap-2">
            <div className="flex lg:hidden bg-stone-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewTab('form')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  previewTab === 'form' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300'
                }`}
              >
                Customize
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('preview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  previewTab === 'preview' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-300'
                }`}
              >
                Live Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view on Desktop, Tabbed on Mobile */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
          {/* Left Column: Customization Controls (7 cols on lg) */}
          <div className={`lg:col-span-7 p-6 space-y-6 ${previewTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <form id="greeting-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Friend & Sender Info */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  1. Recipient & Sender Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Friend’s Full Name or Nickname *
                    </label>
                    <input
                      type="text"
                      value={friendName}
                      onChange={e => setFriendName(e.target.value)}
                      placeholder="e.g. Rahul Sharma or Priya"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Circle / Relationship
                    </label>
                    <select
                      value={relationship}
                      onChange={e => setRelationship(e.target.value as Relationship)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="best_friend">Best Friend</option>
                      <option value="childhood_friend">Childhood Friend</option>
                      <option value="family">Family & Relatives</option>
                      <option value="colleague">Colleague / Workmate</option>
                      <option value="mentor">Mentor / Teacher</option>
                      <option value="festive_group">Festive Group / Community</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Your Name (Sender) *
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      placeholder="e.g. Kabir"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                      <span>Your WhatsApp Number</span>
                      <span className="text-[10px] text-stone-400 font-normal">For direct friend replies</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={senderWhatsApp}
                        onChange={e => setSenderWhatsApp(e.target.value)}
                        placeholder="e.g. 919876543210"
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                      <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Choose Theme */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  2. Choose Festive Theme & Artwork
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(THEMES) as ThemeId[]).map(key => {
                    const t = THEMES[key];
                    const isSelected = themeId === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setThemeId(key)}
                        className={`cursor-pointer rounded-2xl p-3 border-2 transition-all relative overflow-hidden flex items-center gap-3 ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/40 shadow-lg'
                            : 'border-stone-800 bg-stone-950/40 hover:border-stone-700'
                        }`}
                      >
                        <img
                          src={t.imageSrc}
                          alt={t.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-stone-100 truncate">{t.name}</h4>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{t.tagline}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Interactive Layout */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  3. Select Interactive Experience / Layout
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LAYOUT_OPTIONS.map(opt => {
                    const isSelected = layoutId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setLayoutId(opt.id)}
                        className={`cursor-pointer rounded-2xl p-3 border-2 transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/40 shadow-lg'
                            : 'border-stone-800 bg-stone-950/40 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-200">{opt.name}</span>
                          <span className="text-[10px] text-amber-400 font-semibold">{opt.badge}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-tight">{opt.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Message & Sanskrit Shloka Composer */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    4. Dussehra Message & Blessings
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTemplatesPicker(!showTemplatesPicker)}
                      className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      Browse Templates
                    </button>
                  </div>
                </div>

                {/* AI Festive Message Assistant Accordion */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Wand2 className="w-3.5 h-3.5" />
                      AI Festive Blessings Assistant
                    </div>
                    <span className="text-[10px] text-stone-400">Powered by Gemini</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Tone</label>
                      <select
                        value={aiTone}
                        onChange={e => setAiTone(e.target.value as any)}
                        className="w-full text-xs p-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200"
                      >
                        <option value="heartfelt">Heartfelt & Warm</option>
                        <option value="witty">Fun & Witty</option>
                        <option value="spiritual">Spiritual & Devotional</option>
                        <option value="poetic">Poetic & Auspicious</option>
                        <option value="professional">Formal & Respectful</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Language</label>
                      <select
                        value={aiLanguage}
                        onChange={e => setAiLanguage(e.target.value as any)}
                        className="w-full text-xs p-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Hinglish">Hinglish</option>
                        <option value="Marathi">Marathi (मराठी)</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                      </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Action</label>
                      <button
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={isGeneratingAI}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isGeneratingAI ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {isGeneratingAI ? 'Crafting...' : 'Generate Wish'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={specialMemory}
                      onChange={e => setSpecialMemory(e.target.value)}
                      placeholder="Optional: add an inside joke or memory (e.g. 'sweet tooth for jalebi')"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-stone-900 border border-stone-700 text-stone-300 placeholder:text-stone-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Templates Picker Dropdown */}
                {showTemplatesPicker && (
                  <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 max-h-56 overflow-y-auto">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Choose from Curated Dussehra Wishes
                    </span>
                    {MESSAGE_TEMPLATES.map(tpl => (
                      <div
                        key={tpl.id}
                        onClick={() => applyTemplate(tpl)}
                        className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 cursor-pointer transition-colors space-y-1 text-left"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-amber-300">{tpl.title}</span>
                          <span className="text-[10px] text-stone-400">{tpl.language}</span>
                        </div>
                        <p className="text-xs text-stone-300 line-clamp-2">{tpl.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Greeting Headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      placeholder="e.g. Happy Vijayadashami & Dussehra!"
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Sanskrit Shloka / Auspicious Couplet (Optional)
                    </label>
                    <input
                      type="text"
                      value={shloka}
                      onChange={e => setShloka(e.target.value)}
                      placeholder="e.g. यतो धर्मस्ततो जयः"
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Personalized Message Body *
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Write your heartfelt message here..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Music Track */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  5. Ambient Festive Music
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'festive_shehnai', label: 'Festive Shehnai' },
                    { id: 'flute_chimes', label: 'Flute & Bells' },
                    { id: 'temple_bells', label: 'Temple Chimes' },
                    { id: 'none', label: 'Silent' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMusicTrack(m.id as MusicTrack)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        musicTrack === m.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live Recipient Simulation / Preview (5 cols on lg) */}
          <div className={`lg:col-span-5 p-6 bg-stone-950/60 flex flex-col items-center justify-center ${previewTab === 'form' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 text-xs text-stone-400">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" /> Recipient Live Preview
                </span>
                <span>Mobile view</span>
              </div>

              {/* iPhone style frame for authentic mobile preview */}
              <div className="w-full h-[580px] rounded-[36px] p-2.5 bg-stone-800 border-4 border-stone-700 shadow-2xl overflow-hidden relative flex flex-col">
                {/* Dynamic Island / speaker notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 shrink-0 z-30" />
                
                {/* Embedded screen */}
                <div className="flex-1 rounded-[26px] overflow-y-auto overflow-x-hidden relative bg-black">
                  <GreetingCardView card={draftCard} isEmbeddedPreview={true} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="greeting-form"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            {isEditing ? 'Save Changes' : 'Create & Generate Card Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
