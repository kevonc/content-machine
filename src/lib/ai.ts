import type { Database } from './supabase';

type ContentType = Database['public']['Tables']['guidelines']['Row']['content_type'];

export interface AIService {
  generateContent(prompt: string, contentType: ContentType): Promise<string>;
}

export class GrokService implements AIService {
  async generateContent(prompt: string, contentType: ContentType): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_XAI_API_KEY;
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "You are a professional content writer who specializes in adapting content for different platforms while maintaining the author's voice and style."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || '';
  }
}

// Export Grok as the current AI service implementation
export const aiService = new GrokService(); 