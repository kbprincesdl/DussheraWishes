import { GreetingCard, CardInteraction, CardReply } from '../types/greeting';

const STORAGE_KEY = 'dussehra_greeting_cards_v1';

export const INITIAL_SAMPLE_CARDS: GreetingCard[] = [
  {
    id: 'card-aditya-77a',
    friendName: 'Aditya Sharma',
    senderName: 'Kabir',
    senderWhatsApp: '919876543210',
    relationship: 'childhood_friend',
    themeId: 'royal_saffron',
    layoutId: 'archery_victory',
    headline: 'To My Favorite Human this Dussehra! 🏹✨',
    shloka: 'अधर्म पर धर्म की विजय, असत्य पर सत्य की जीत!',
    message: 'Happy Dussehra, buddy! May all the lazy habits, bad vibes, and Monday morning alarms get burnt like Ravana today, leaving only good food, endless laughs, and big wins for us! Sending you the warmest festive hugs.',
    musicTrack: 'festive_shehnai',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    viewCount: 4,
    firstViewedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    lastViewedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    hasInteracted: true,
    interactedAt: new Date(Date.now() - 3600000 * 19).toISOString(),
    interactions: [
      { type: 'envelope_opened', timestamp: new Date(Date.now() - 3600000 * 20).toISOString() },
      { type: 'arrow_shot', timestamp: new Date(Date.now() - 3600000 * 19).toISOString() },
      { type: 'whatsapp_reply_clicked', timestamp: new Date(Date.now() - 3600000 * 18).toISOString() }
    ],
    replies: [
      {
        id: 'reply-1',
        senderName: 'Aditya',
        message: 'Bhai this animation of the golden arrow is mind blowing! Happy Dussehra to you and aunty! Let us catch up this weekend for sweets!',
        reaction: '🏹',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        platform: 'whatsapp'
      }
    ]
  },
  {
    id: 'card-pooja-88b',
    friendName: 'Pooja & Rohan',
    senderName: 'Kabir',
    senderWhatsApp: '919876543210',
    relationship: 'family',
    themeId: 'shami_gold',
    layoutId: 'interactive_diya',
    headline: 'Sonu Ghya, Sonyasarkhe Raha! 🍃✨',
    shloka: 'शमी शमयते पापम् शमी लोहितकण्टका। धारिण्यर्जुनबाणानाम् रामस्य प्रियवादिनी॥',
    message: 'As we exchange the sacred golden Apta and Shami leaves today, I send you heartfelt wishes for abundant health, prosperity, and golden moments that last a lifetime. May your home be blessed with radiant happiness!',
    musicTrack: 'temple_bells',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    viewCount: 3,
    firstViewedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    lastViewedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    hasInteracted: true,
    interactedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    interactions: [
      { type: 'diya_lit', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
      { type: 'flowers_showered', timestamp: new Date(Date.now() - 3600000 * 11).toISOString() }
    ],
    replies: [
      {
        id: 'reply-2',
        senderName: 'Pooja',
        message: 'Such a thoughtful and auspicious wish Kabir! Lighting the diya felt so divine. Lots of love and blessings to you!',
        reaction: '🪔',
        timestamp: new Date(Date.now() - 3600000 * 11).toISOString(),
        platform: 'app'
      }
    ]
  },
  {
    id: 'card-ananya-42c',
    friendName: 'Ananya Verma',
    senderName: 'Kabir',
    senderWhatsApp: '919876543210',
    relationship: 'colleague',
    themeId: 'crimson_shakti',
    layoutId: 'festive_scroll',
    headline: 'Wishing You a Joyous & Prosperous Dussehra',
    shloka: 'यतो धर्मस्ततो जयः (Where there is Righteousness, there is Victory)',
    message: 'On this auspicious occasion of Dussehra, wishing you and your family abundant peace, wisdom, and professional milestones. Thank you for being such an inspiring colleague and friend. May the festive season usher in great triumph and prosperity.',
    musicTrack: 'flute_chimes',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    viewCount: 1,
    firstViewedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    lastViewedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    hasInteracted: false,
    interactedAt: null,
    interactions: [],
    replies: []
  },
  {
    id: 'card-vikram-99d',
    friendName: 'Vikram Joshi (Mentor)',
    senderName: 'Kabir',
    senderWhatsApp: '919876543210',
    relationship: 'mentor',
    themeId: 'midnight_fireworks',
    layoutId: 'royal_envelope',
    headline: 'Shubh Vijayadashami Greetings',
    shloka: 'धर्मो रक्षति रक्षितः',
    message: 'Sir, on this holy festival of Vijayadashami, seeking your blessings and extending my warmest wishes to you and your family. May the triumph of good over evil guide our vision and endeavors toward excellence.',
    musicTrack: 'festive_shehnai',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    viewCount: 0,
    firstViewedAt: null,
    lastViewedAt: null,
    hasInteracted: false,
    interactedAt: null,
    interactions: [],
    replies: []
  }
];

export function loadCards(): GreetingCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_CARDS));
      return INITIAL_SAMPLE_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_CARDS));
      return INITIAL_SAMPLE_CARDS;
    }
    return parsed;
  } catch {
    return INITIAL_SAMPLE_CARDS;
  }
}

export function saveAllCards(cards: GreetingCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error('Failed to save greeting cards', err);
  }
}

export function saveCard(card: GreetingCard): GreetingCard[] {
  const cards = loadCards();
  const idx = cards.findIndex(c => c.id === card.id);
  let updated: GreetingCard[];
  if (idx >= 0) {
    updated = [...cards];
    updated[idx] = card;
  } else {
    updated = [card, ...cards];
  }
  saveAllCards(updated);
  return updated;
}

export function deleteCard(id: string): GreetingCard[] {
  const cards = loadCards();
  const updated = cards.filter(c => c.id !== id);
  saveAllCards(updated);
  return updated;
}

export function getCardById(id: string): GreetingCard | undefined {
  const cards = loadCards();
  return cards.find(c => c.id === id);
}

export function recordCardView(id: string): GreetingCard | undefined {
  const cards = loadCards();
  const idx = cards.findIndex(c => c.id === id);
  if (idx < 0) return undefined;

  const card = cards[idx];
  const now = new Date().toISOString();
  const updatedCard: GreetingCard = {
    ...card,
    viewCount: card.viewCount + 1,
    firstViewedAt: card.firstViewedAt || now,
    lastViewedAt: now
  };
  cards[idx] = updatedCard;
  saveAllCards(cards);
  return updatedCard;
}

export function recordCardInteraction(id: string, interaction: CardInteraction): GreetingCard | undefined {
  const cards = loadCards();
  const idx = cards.findIndex(c => c.id === id);
  if (idx < 0) return undefined;

  const card = cards[idx];
  const updatedCard: GreetingCard = {
    ...card,
    hasInteracted: true,
    interactedAt: card.interactedAt || interaction.timestamp,
    interactions: [interaction, ...(card.interactions || [])]
  };
  cards[idx] = updatedCard;
  saveAllCards(cards);
  return updatedCard;
}

export function addCardReply(id: string, reply: Omit<CardReply, 'id' | 'timestamp'>): GreetingCard | undefined {
  const cards = loadCards();
  const idx = cards.findIndex(c => c.id === id);
  if (idx < 0) return undefined;

  const card = cards[idx];
  const newReply: CardReply = {
    ...reply,
    id: 'reply-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString()
  };

  const updatedCard: GreetingCard = {
    ...card,
    hasInteracted: true,
    replies: [newReply, ...(card.replies || [])]
  };
  cards[idx] = updatedCard;
  saveAllCards(cards);
  return updatedCard;
}

export function buildCardShareUrl(cardId: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}?card=${cardId}`;
}

export function buildWhatsAppShareUrl(card: GreetingCard): string {
  const shareUrl = buildCardShareUrl(card.id);
  const text = `🪔 *Shubh Dussehra & Vijayadashami!* 🏹\n\nHey ${card.friendName}, I made a special personalized Dussehra digital greeting card just for you with festive music and blessings!\n\n✨ Tap here to open your card:\n${shareUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppReplyUrl(card: GreetingCard, replyMessage?: string): string {
  const defaultReply = `✨ Thank you so much ${card.senderName} for the beautiful Dussehra greeting! Wishing you and your family a very Happy, Blessed, and Prosperous Vijayadashami! 🪔🏹`;
  const text = replyMessage ? `${replyMessage} (Replying to your Dussehra card)` : defaultReply;
  
  if (card.senderWhatsApp) {
    const cleanNumber = card.senderWhatsApp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
