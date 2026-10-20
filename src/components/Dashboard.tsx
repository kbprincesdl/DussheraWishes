import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  MessageCircle, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Eye, 
  Flame, 
  FlameKindling,
  Users, 
  Heart, 
  Send,
  Smartphone,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GreetingCard, ThemeId, Relationship } from '../types/greeting';
import { THEMES, LAYOUT_OPTIONS } from '../data/themes';
import { buildWhatsAppShareUrl, buildCardShareUrl } from '../utils/storage';
import { QRCodeModal } from './QRCodeModal';
import { RepliesModal } from './RepliesModal';
import { GreetingCardView } from './GreetingCardView';

interface DashboardProps {
  cards: GreetingCard[];
  activeTab: 'dashboard' | 'greetings' | 'tracker' | 'themes';
  onNavigateTab: (tab: 'dashboard' | 'greetings' | 'tracker' | 'themes') => void;
  onOpenCreateModal: (cardToEdit?: GreetingCard) => void;
  onDeleteCard: (id: string) => void;
  onSelectCardForPreview: (card: GreetingCard) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cards,
  activeTab,
  onNavigateTab,
  onOpenCreateModal,
  onDeleteCard,
  onSelectCardForPreview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'replied' | 'interacted' | 'viewed' | 'unopened'>('all');
  const [filterRelationship, setFilterRelationship] = useState<string>('all');
  const [activeQRCard, setActiveQRCard] = useState<GreetingCard | null>(null);
  const [activeRepliesCard, setActiveRepliesCard] = useState<GreetingCard | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [selectedMobileCard, setSelectedMobileCard] = useState<GreetingCard>(cards[0] || null);

  // Compute stats
  const totalCards = cards.length;
  const viewedCards = cards.filter(c => c.viewCount > 0);
  const interactedCards = cards.filter(c => c.hasInteracted);
  const repliedCards = cards.filter(c => c.replies && c.replies.length > 0);
  const totalReplies = cards.reduce((acc, c) => acc + (c.replies?.length || 0), 0);
  const totalViews = cards.reduce((acc, c) => acc + c.viewCount, 0);

  const viewRate = totalCards > 0 ? Math.round((viewedCards.length / totalCards) * 100) : 0;
  const interactionRate = totalCards > 0 ? Math.round((interactedCards.length / totalCards) * 100) : 0;

  // Filtered list
  const filteredCards = cards.filter(c => {
    const matchesSearch = 
      c.friendName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRel = filterRelationship === 'all' || c.relationship === filterRelationship;

    let matchesStatus = true;
    if (filterStatus === 'replied') matchesStatus = (c.replies && c.replies.length > 0);
    else if (filterStatus === 'interacted') matchesStatus = c.hasInteracted;
    else if (filterStatus === 'viewed') matchesStatus = c.viewCount > 0;
    else if (filterStatus === 'unopened') matchesStatus = c.viewCount === 0;

    return matchesSearch && matchesRel && matchesStatus;
  });

  const handleCopyLink = async (cardId: string) => {
    try {
      await navigator.clipboard.writeText(buildCardShareUrl(cardId));
      setCopiedCardId(cardId);
      setTimeout(() => setCopiedCardId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome & Festive Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Vijayadashami Greetings & Engagement Studio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-festive text-amber-100 gold-foil-text tracking-tight">
              Celebrate Dussehra With Your Friends
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Send personalized interactive greetings with glowing diyas, Rama’s golden arrow, and festive melodies. Track real-time views and enable 1-click WhatsApp replies!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenCreateModal()}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:brightness-110 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Create Personalized Card
            </button>
          </div>
        </div>
      </section>

      {/* KPI Metrics Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Cards */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Greetings Sent</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-amber-100 font-festive tabular-nums">
              {totalCards}
            </span>
            <span className="text-xs text-stone-400">friends</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Across {new Set(cards.map(c => c.relationship)).size} circles
          </div>
        </div>

        {/* Metric 2: Views */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Opened & Viewed</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-sky-100 font-festive tabular-nums">
              {viewedCards.length}
            </span>
            <span className="text-xs font-semibold text-sky-400 tabular-nums">
              {viewRate}% open rate
            </span>
          </div>
          <div className="text-[11px] text-stone-400 tabular-nums">
            {totalViews} total card opens
          </div>
        </div>

        {/* Metric 3: Interacted */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Festive Interacted</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-orange-100 font-festive tabular-nums">
              {interactedCards.length}
            </span>
            <span className="text-xs font-semibold text-orange-400 tabular-nums">
              {interactionRate}% engaged
            </span>
          </div>
          <div className="text-[11px] text-stone-400">
            Diyas lit & arrows shot
          </div>
        </div>

        {/* Metric 4: Replies */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Replies Received</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-100 font-festive tabular-nums">
              {totalReplies}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {repliedCards.length} friends
            </span>
          </div>
          <div className="text-[11px] text-stone-400">
            Via WhatsApp & guestbook
          </div>
        </div>
      </section>

      {/* Main Grid: Card Manager on Left (7 cols) + Live Mobile Interactive Sandbox on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Greetings Management & Tracker (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Controls Bar: Search & Filters */}
          <div className="p-4 rounded-2xl bg-stone-900/70 border border-amber-500/20 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by friend name, wish, or keyword..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Relationship Circle filter */}
              <select
                value={filterRelationship}
                onChange={e => setFilterRelationship(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-300 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Circles</option>
                <option value="best_friend">Best Friends</option>
                <option value="childhood_friend">Childhood Friends</option>
                <option value="family">Family</option>
                <option value="colleague">Colleagues</option>
                <option value="mentor">Mentors</option>
              </select>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Greetings', count: cards.length },
                { id: 'replied', label: 'Replied', count: repliedCards.length },
                { id: 'interacted', label: 'Interacted', count: interactedCards.length },
                { id: 'viewed', label: 'Viewed', count: viewedCards.length },
                { id: 'unopened', label: 'Unopened', count: cards.filter(c => c.viewCount === 0).length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    filterStatus === tab.id
                      ? 'bg-amber-400 text-stone-950 font-semibold'
                      : 'bg-stone-950/60 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label} <span className="tabular-nums opacity-75">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredCards.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
                <Users className="w-10 h-10 mx-auto text-amber-400/50" />
                <h3 className="text-base font-bold text-stone-200 font-festive">No greetings found</h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  No friends matched your search or status filter. Try resetting filters or create a new personalized greeting!
                </p>
                <button
                  onClick={() => onOpenCreateModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Greeting
                </button>
              </div>
            ) : (
              filteredCards.map(card => {
                const theme = THEMES[card.themeId] || THEMES.royal_saffron;
                const hasReplies = card.replies && card.replies.length > 0;
                const isSelectedForPreview = selectedMobileCard?.id === card.id;

                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl p-5 border transition-all ${
                      isSelectedForPreview
                        ? 'border-amber-400/80 bg-stone-900/90 shadow-xl'
                        : 'border-stone-800 bg-stone-900/60 hover:border-amber-500/40'
                    }`}
                  >
                    {/* Top Row: Friend Name & Status indicator */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold font-festive text-amber-100">
                            {card.friendName}
                          </h3>
                          {/* Unboxed metadata per constitution */}
                          <span className="text-xs text-stone-400">
                            {card.relationship.replace('_', ' ')}
                          </span>
                        </div>
                        {/* Theme and Layout unboxed metadata */}
                        <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                          <span>{theme.name}</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{card.layoutId.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="text-right">
                        {hasReplies ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Replied ({card.replies.length})
                          </span>
                        ) : card.hasInteracted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            Interacted
                          </span>
                        ) : card.viewCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            Viewed ({card.viewCount}x)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-400">
                            <span className="w-2 h-2 rounded-full bg-stone-500" />
                            Unopened
                          </span>
                        )}

                        {card.lastViewedAt && (
                          <div className="text-[10px] text-stone-500 mt-0.5 tabular-nums">
                            Last {new Date(card.lastViewedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Headline and Preview Message */}
                    <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs space-y-1 mb-4">
                      <p className="font-semibold text-amber-200">{card.headline}</p>
                      <p className="text-stone-300 line-clamp-2 leading-relaxed">{card.message}</p>
                    </div>

                    {/* Latest reply snippet if any */}
                    {hasReplies && (
                      <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/25 text-xs text-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <span>{card.replies[0].reaction}</span>
                          <span className="truncate">&ldquo;{card.replies[0].message}&rdquo;</span>
                        </div>
                        <button
                          onClick={() => setActiveRepliesCard(card)}
                          className="text-[11px] text-emerald-300 hover:underline shrink-0 font-semibold"
                        >
                          View all
                        </button>
                      </div>
                    )}

                    {/* Action buttons row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/60">
                      <div className="flex items-center gap-1.5">
                        {/* WhatsApp Send button */}
                        <a
                          href={buildWhatsAppShareUrl(card)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Send on WhatsApp
                        </a>

                        {/* Copy Link */}
                        <button
                          onClick={() => handleCopyLink(card.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
                          title="Copy Link"
                        >
                          {copiedCardId === card.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="hidden sm:inline">
                            {copiedCardId === card.id ? 'Copied' : 'Link'}
                          </span>
                        </button>

                        {/* QR Code */}
                        <button
                          onClick={() => setActiveQRCard(card)}
                          className="p-1.5 text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
                          title="View QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Preview on Mobile frame toggle */}
                        <button
                          onClick={() => setSelectedMobileCard(card)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            isSelectedForPreview
                              ? 'bg-amber-400 text-stone-950 font-bold'
                              : 'text-amber-300 bg-stone-800 hover:bg-stone-700'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5 inline mr-1" />
                          Preview
                        </button>

                        {/* Full Screen Recipient View */}
                        <button
                          onClick={() => onSelectCardForPreview(card)}
                          className="p-1.5 text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
                          title="Open Fullscreen Recipient View"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Card */}
                        <button
                          onClick={() => onOpenCreateModal(card)}
                          className="p-1.5 text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
                          title="Edit Card"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Card */}
                        <button
                          onClick={() => {
                            if (confirm(`Delete greeting for ${card.friendName}?`)) {
                              onDeleteCard(card.id);
                            }
                          }}
                          className="p-1.5 text-rose-400/80 hover:text-rose-300 hover:bg-stone-800 rounded-lg transition-colors"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Mobile-first Interactive Recipient Sandbox (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="p-5 rounded-3xl bg-stone-900 border border-amber-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  Interactive Recipient Sandbox
                </span>
                <h3 className="text-base font-bold font-festive text-stone-100">
                  {selectedMobileCard ? `Previewing: ${selectedMobileCard.friendName}` : 'Select a card'}
                </h3>
              </div>

              {selectedMobileCard && (
                <button
                  onClick={() => onSelectCardForPreview(selectedMobileCard)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Fullscreen
                </button>
              )}
            </div>

            {selectedMobileCard ? (
              <div className="w-full h-[620px] rounded-[36px] p-2.5 bg-stone-800 border-4 border-stone-700 shadow-inner overflow-hidden relative flex flex-col mx-auto max-w-[340px]">
                {/* Dynamic island notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 shrink-0 z-30" />
                
                {/* Embedded scrollable card view */}
                <div className="flex-1 rounded-[26px] overflow-y-auto overflow-x-hidden relative bg-black">
                  <GreetingCardView card={selectedMobileCard} isEmbeddedPreview={true} />
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-stone-500 text-xs">
                Select a card on the left to test interactive recipient preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Themes & Layouts Showcase Gallery */}
      <section className="space-y-4 pt-6 border-t border-stone-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Visual Styles</span>
            <h2 className="text-xl font-bold font-festive text-amber-100">Festive Themes & Artwork Gallery</h2>
          </div>
          <button
            onClick={() => onOpenCreateModal()}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
          >
            Create with any theme <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(THEMES) as ThemeId[]).map(key => {
            const t = THEMES[key];
            return (
              <div
                key={key}
                onClick={() => onOpenCreateModal()}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-400/50 transition-all shadow-lg flex flex-col"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={t.imageSrc}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                </div>
                <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-100 font-festive">{t.name}</h4>
                    <p className="text-xs text-stone-400 mt-1">{t.tagline}</p>
                  </div>
                  <div className="pt-3 flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>Use this theme</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* QR Code Modal */}
      {activeQRCard && (
        <QRCodeModal card={activeQRCard} onClose={() => setActiveQRCard(null)} />
      )}

      {/* Replies Modal */}
      {activeRepliesCard && (
        <RepliesModal card={activeRepliesCard} onClose={() => setActiveRepliesCard(null)} />
      )}
    </div>
  );
};
