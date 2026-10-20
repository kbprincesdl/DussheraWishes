export type Relationship = 
  | 'best_friend' 
  | 'childhood_friend' 
  | 'colleague' 
  | 'family' 
  | 'mentor' 
  | 'festive_group';

export type ThemeId = 
  | 'royal_saffron' 
  | 'crimson_shakti' 
  | 'shami_gold' 
  | 'midnight_fireworks' 
  | 'ivory_classic';

export type LayoutId = 
  | 'interactive_diya' 
  | 'archery_victory' 
  | 'royal_envelope' 
  | 'festive_scroll';

export type MusicTrack = 
  | 'festive_shehnai' 
  | 'flute_chimes' 
  | 'temple_bells' 
  | 'none';

export interface CardInteraction {
  type: 'diya_lit' | 'arrow_shot' | 'envelope_opened' | 'flowers_showered' | 'music_played' | 'whatsapp_reply_clicked';
  timestamp: string;
  note?: string;
}

export interface CardReply {
  id: string;
  senderName: string;
  message: string;
  reaction: string;
  timestamp: string;
  platform?: 'app' | 'whatsapp' | 'instagram';
}

export interface GreetingCard {
  id: string;
  friendName: string;
  senderName: string;
  senderWhatsApp?: string; // Optional phone number with country code e.g. 919876543210
  relationship: Relationship;
  themeId: ThemeId;
  layoutId: LayoutId;
  headline: string;
  message: string;
  shloka?: string;
  musicTrack: MusicTrack;
  createdAt: string;
  viewCount: number;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
  hasInteracted: boolean;
  interactedAt: string | null;
  interactions: CardInteraction[];
  replies: CardReply[];
}

export interface DussehraTheme {
  id: ThemeId;
  name: string;
  tagline: string;
  imageSrc: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  borderStyle: string;
  sparkleColors: string[];
}
