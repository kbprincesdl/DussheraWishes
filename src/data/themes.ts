import { DussehraTheme, ThemeId, LayoutId } from '../types/greeting';

import bowArrowImg from '../assets/images/dussehra_golden_bow_arrow_1792504742995.jpg';
import durgaImg from '../assets/images/dussehra_durga_shakti_blessings_1792504744061.jpg';
import shamiLeavesImg from '../assets/images/dussehra_shami_apta_leaves_1792504744609.jpg';
import fireworksImg from '../assets/images/dussehra_fireworks_celebration_1792504744848.jpg';

export const THEMES: Record<ThemeId, DussehraTheme> = {
  royal_saffron: {
    id: 'royal_saffron',
    name: 'Royal Ayodhya & Golden Arrow',
    tagline: 'Triumph of virtue, valor, and golden light',
    imageSrc: bowArrowImg,
    bgGradient: 'from-amber-950 via-orange-950 to-neutral-950',
    cardBg: 'bg-amber-950/80 backdrop-blur-xl border border-amber-500/30 text-amber-50',
    textColor: 'text-amber-100',
    accentColor: 'from-amber-400 to-orange-500',
    borderStyle: 'border-amber-400/40',
    sparkleColors: ['#fbbf24', '#f59e0b', '#f97316', '#ffffff']
  },
  crimson_shakti: {
    id: 'crimson_shakti',
    name: 'Durga Shakti & Divine Radiance',
    tagline: 'Courage, victory over darkness, and sacred blessings',
    imageSrc: durgaImg,
    bgGradient: 'from-rose-950 via-red-950 to-neutral-950',
    cardBg: 'bg-red-950/80 backdrop-blur-xl border border-rose-500/30 text-rose-50',
    textColor: 'text-rose-100',
    accentColor: 'from-rose-400 to-amber-500',
    borderStyle: 'border-rose-400/40',
    sparkleColors: ['#f43f5e', '#fbbf24', '#f59e0b', '#ffffff']
  },
  shami_gold: {
    id: 'shami_gold',
    name: 'Auspicious Shami Gold & Prosperity',
    tagline: 'Traditional Apta gold leaves for wealth, harmony, and joy',
    imageSrc: shamiLeavesImg,
    bgGradient: 'from-emerald-950 via-teal-950 to-neutral-950',
    cardBg: 'bg-emerald-950/80 backdrop-blur-xl border border-emerald-500/30 text-emerald-50',
    textColor: 'text-emerald-100',
    accentColor: 'from-emerald-400 to-amber-400',
    borderStyle: 'border-emerald-400/40',
    sparkleColors: ['#10b981', '#34d399', '#fbbf24', '#ffffff']
  },
  midnight_fireworks: {
    id: 'midnight_fireworks',
    name: 'Ravana Dahan & Midnight Fireworks',
    tagline: 'Celebratory night sky, temple silhouettes, and joy',
    imageSrc: fireworksImg,
    bgGradient: 'from-indigo-950 via-purple-950 to-neutral-950',
    cardBg: 'bg-indigo-950/80 backdrop-blur-xl border border-indigo-500/30 text-indigo-50',
    textColor: 'text-indigo-100',
    accentColor: 'from-amber-400 to-indigo-400',
    borderStyle: 'border-indigo-400/40',
    sparkleColors: ['#818cf8', '#c084fc', '#fbbf24', '#ffffff']
  },
  ivory_classic: {
    id: 'ivory_classic',
    name: 'Ivory Temple & Golden Marigold',
    tagline: 'Pure, timeless elegance with warm glow and brass lamps',
    imageSrc: shamiLeavesImg,
    bgGradient: 'from-stone-900 via-amber-950/60 to-neutral-900',
    cardBg: 'bg-stone-900/85 backdrop-blur-xl border border-amber-400/30 text-stone-100',
    textColor: 'text-stone-100',
    accentColor: 'from-amber-300 to-yellow-500',
    borderStyle: 'border-amber-300/40',
    sparkleColors: ['#fef08a', '#f59e0b', '#d97706', '#ffffff']
  }
};

export interface LayoutOption {
  id: LayoutId;
  name: string;
  description: string;
  badge: string;
  iconName: string;
}

export const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: 'interactive_diya',
    name: 'Light the Sacred Diya',
    description: 'Recipient touches to light the auspicious brass lamp, triggering radiant blessings and sound.',
    badge: 'Most Popular',
    iconName: 'Flame'
  },
  {
    id: 'archery_victory',
    name: 'Golden Bow & Victory Arrow',
    description: 'Recipient taps Rama’s bow to shoot the golden arrow of virtue, exploding into festive fireworks.',
    badge: 'Heroic & Fun',
    iconName: 'Sparkles'
  },
  {
    id: 'royal_envelope',
    name: 'Royal Wax-Sealed Envelope',
    description: 'An elegant traditional envelope that breaks its golden seal and unfolds a heartfelt letter.',
    badge: 'Heartfelt & Classic',
    iconName: 'Mail'
  },
  {
    id: 'festive_scroll',
    name: 'Auspicious Vijayadashami Scroll',
    description: 'An opulent golden parchment scroll with sacred shlokas, marigold garlands, and warm note.',
    badge: 'Poetic & Traditional',
    iconName: 'Scroll'
  }
];
