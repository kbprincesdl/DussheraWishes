import { GoogleGenAI } from '@google/genai';
import { Relationship } from '../types/greeting';

export interface GenerateGreetingParams {
  friendName: string;
  senderName: string;
  relationship: Relationship;
  tone: 'heartfelt' | 'witty' | 'spiritual' | 'poetic' | 'professional';
  language: 'English' | 'Hindi' | 'Hinglish' | 'Marathi' | 'Telugu';
  specialMention?: string;
}

export interface GeneratedGreetingResult {
  headline: string;
  shloka: string;
  message: string;
}

export async function generateFestiveGreeting(params: GenerateGreetingParams): Promise<GeneratedGreetingResult> {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a warm, thoughtful Indian festive writer specializing in Dussehra (Vijayadashami) greetings.
Generate a personalized Dussehra greeting for:
- Recipient Name: ${params.friendName}
- Sender Name: ${params.senderName}
- Relationship: ${params.relationship}
- Tone: ${params.tone}
- Language: ${params.language}
${params.specialMention ? `- Special memory/mention: ${params.specialMention}` : ''}

Dussehra symbols: victory of good over evil, Lord Rama's golden arrow, Goddess Durga's courage, distributing golden Shami/Apta leaves for prosperity, joy, and light.

Respond STRICTLY in valid JSON matching this schema:
{
  "headline": "A short, radiant festive title (e.g. 'Shubh Vijayadashami, [Name]!')",
  "shloka": "A meaningful short Sanskrit shloka or traditional Hindi couplet relevant to Dussehra with English meaning in parentheses",
  "message": "A warm, personal 3-4 sentence message celebrating victory, happiness, and mutual affection."
}
Do NOT include markdown formatting or backticks around the json.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.headline && parsed.message) {
        return {
          headline: parsed.headline,
          shloka: parsed.shloka || 'यतो धर्मस्ततो जयः',
          message: parsed.message
        };
      }
    } catch (err) {
      console.warn('Gemini AI generation failed, falling back to smart local template', err);
    }
  }

  // Smart local template fallback based on relationship and tone
  return getLocalTemplateWish(params);
}

function getLocalTemplateWish(params: GenerateGreetingParams): GeneratedGreetingResult {
  const { friendName, senderName, relationship, tone, language } = params;

  if (language === 'Hindi') {
    return {
      headline: `प्रिय ${friendName}, शुभ विजयदशमी! 🪔`,
      shloka: 'अधर्म पर धर्म की विजय, असत्य पर सत्य की जीत!',
      message: `विजयादशमी के इस पावन अवसर पर प्रभु श्री राम और माँ जगदम्बा की कृपा से आपके जीवन से समस्त बाधाएं दूर हों और सफलता, सुख एवं समृद्धि के नए द्वार खुलें। ${senderName} की ओर से आपको एवं आपके परिवार को दशहरा की अशेष शुभकामनाएँ!`
    };
  }

  if (tone === 'witty' || relationship === 'best_friend' || relationship === 'childhood_friend') {
    return {
      headline: `Happy Dussehra to my Partner-in-Crime, ${friendName}! 🏹🎉`,
      shloka: 'यतो धर्मस्ततो जयः (Where there is Goodness, there is Victory)',
      message: `May this Dussehra burn away all self-doubt, overthinking, and diet plans like Ravana's effigy, leaving only sweets, triumph, and endless memorable adventures for us! Wishing you boundless joy and happiness from ${senderName}.`
    };
  }

  if (relationship === 'mentor' || tone === 'professional') {
    return {
      headline: `Warm Vijayadashami Greetings to ${friendName}`,
      shloka: 'धर्मो रक्षति रक्षितः (Dharma protects those who uphold it)',
      message: `On the auspicious celebration of Vijayadashami, wishing you and your loved ones everlasting wisdom, peace, and triumphant accomplishments. Thank you for your continued mentorship and inspiration. Warmest regards, ${senderName}.`
    };
  }

  if (relationship === 'family') {
    return {
      headline: `Happy & Blessed Dussehra, Dearest ${friendName}! 🪔🍃`,
      shloka: 'शमी शमयते पापम् शमी लोहितकण्टका। धारिण्यर्जुनबाणानाम् रामस्य प्रियवादिनी॥',
      message: `Sending you the sacred golden Shami leaves of affection, good health, and abundant prosperity. May our family bonds grow even stronger and our home always resonate with laughter and divine blessings. With love, ${senderName}.`
    };
  }

  return {
    headline: `Wishing You a Glorious Dussehra, ${friendName}! ✨🏹`,
    shloka: 'यतो धर्मस्ततो जयः (Truth & Righteousness Always Triumph)',
    message: `May the auspicious festival of Dussehra fill your days ahead with boundless positivity, courageous spirit, and sweet triumphs. May all your noble aspirations be fulfilled with divine grace! Warmest festive wishes from ${senderName}.`
  };
}
