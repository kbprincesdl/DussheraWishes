export interface MessageTemplate {
  id: string;
  category: 'heartfelt' | 'friends' | 'traditional' | 'mentor' | 'poetic' | 'regional';
  title: string;
  language: string;
  headline: string;
  shloka?: string;
  message: string;
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'msg-triumph-1',
    category: 'heartfelt',
    title: 'Triumph of Virtue & New Beginnings',
    language: 'English',
    headline: 'Happy Vijayadashami & Dussehra!',
    shloka: 'यतो धर्मस्ततो जयः (Where there is Righteousness, there is Victory)',
    message: 'May this auspicious day of Dussehra illuminate your path with courage, joy, and boundless prosperity. Just as Lord Rama conquered negativity and Goddess Durga vanquished the shadows, may all your dreams triumph this year. Wishing you and your loved ones a blessed celebration!'
  },
  {
    id: 'msg-bestie-1',
    category: 'friends',
    title: 'Witty & Warm for Best Friends',
    language: 'English / Hinglish',
    headline: 'To My Favorite Human this Dussehra! 🏹✨',
    shloka: 'अधर्म पर धर्म की विजय, असत्य पर सत्य की जीत!',
    message: 'Happy Dussehra, buddy! May all the lazy habits, bad vibes, and Monday morning alarms get burnt like Ravana today, leaving only good food, endless laughs, and big wins for us! Sending you the warmest festive hugs.'
  },
  {
    id: 'msg-hindi-traditional',
    category: 'traditional',
    title: 'पावन विजयदशमी शुभकामनाएँ',
    language: 'Hindi',
    headline: 'शुभ विजयदशमी एवं दशहरा की हार्दिक शुभकामनाएँ!',
    shloka: 'राम रामेति रामेति रमे रामे मनोरमे। सहस्त्रनाम तत्तुल्यं रामनाम वरानने॥',
    message: 'बुराई पर अच्छाई और असत्य पर सत्य की विजय के महापर्व विजयादशमी की आपको और आपके समस्त परिवार को हार्दिक बधाई। प्रभु श्री राम और माँ जगदम्बा की कृपा से आपके जीवन में सुख, शांति, समृद्धि और सफलता का सदा वास रहे।'
  },
  {
    id: 'msg-shami-prosperity',
    category: 'poetic',
    title: 'Golden Shami Leaves of Prosperity',
    language: 'English / Marathi tradition',
    headline: 'Sonu Ghya, Sonyasarkhe Raha! 🍃✨',
    shloka: 'शमी शमयते पापम् शमी लोहितकण्टका। धारिण्यर्जुनबाणानाम् रामस्य प्रियवादिनी॥',
    message: 'As we exchange the sacred golden Apta and Shami leaves today, I send you heartfelt wishes for abundant health, prosperity, and golden moments that last a lifetime. May your life be as radiant and pure as gold!'
  },
  {
    id: 'msg-colleague-mentor',
    category: 'mentor',
    title: 'Respectful for Mentors & Colleagues',
    language: 'English',
    headline: 'Wishing You a Joyous & Prosperous Dussehra',
    shloka: 'धर्मो रक्षति रक्षितः',
    message: 'On this auspicious occasion of Dussehra, wishing you and your family abundant peace, wisdom, and professional milestones. Thank you for your inspiring guidance and warmth. May the festive season usher in great triumph and prosperity.'
  },
  {
    id: 'msg-telugu-tamil',
    category: 'regional',
    title: 'Vijayadashami Subhakankshalu',
    language: 'Telugu / English',
    headline: 'Happy Dussehra & Vijayadashami Subhakankshalu! 🪔',
    shloka: 'సర్వే జనాః సుఖినో భవన్తు (May all beings be happy and peaceful)',
    message: 'Wishing you a grand celebration filled with divine blessings, sweet delicacies, and triumph over every hurdle. May Goddess Durga bless you and your family with health, harmony, and grand prosperity!'
  }
];
