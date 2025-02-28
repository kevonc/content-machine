import { supabase } from './supabase';
import { aiService } from './ai';
import type { Database } from './supabase';

type ContentType = Database['public']['Tables']['guidelines']['Row']['content_type'];

export async function processContent(
  inputText: string,
  contentType: ContentType
) {
  try {
    // First, fetch the guidelines for this content type
    const { data: guidelineData, error: guidelineError } = await supabase
      .from("guidelines")
      .select("*")
      .eq("content_type", contentType)
      .maybeSingle();

    if (guidelineError) throw guidelineError;

    // Fetch all phrases
    const { data: phrases, error: phrasesError } = await supabase
      .from('phrases')
      .select('phrase');

    if (phrasesError) throw phrasesError;

    // Format the prompt with guidelines, examples, and phrases
    const prompt = formatPrompt(
      inputText,
      contentType,
      guidelineData?.guideline || '',
      guidelineData?.examples || '',
      phrases?.map(p => p.phrase) || []
    );

    // Get the AI response
    const outputText = await aiService.generateContent(prompt, contentType);

    // Generate a title from the first few words of the input
    const title = generateTitle(inputText);

    // Save the content to the database
    const { data, error } = await supabase
      .from('content')
      .insert({
        title,
        input_text: inputText,
        output_text: outputText,
        content_type: contentType,
        is_posted: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error processing content:', error);
    throw error;
  }
}

function formatPrompt(
  inputText: string,
  contentType: ContentType,
  guideline: string,
  examples: string,
  phrases: string[]
) {
  return `
Content Type: ${contentType}

Guidelines:
${guideline}

Examples:
${examples}

Common Phrases:
${phrases.join('\n')}

Input Text:
${inputText}

Please generate content following the guidelines and examples above, incorporating the common phrases where appropriate.
${contentType === 'kevons_social_posts' ? '\nPlease generate three versions: one for Twitter/X (280 chars), one for Threads, and one for LinkedIn.' : ''}
`;
}

// Mock processing function - replace with actual AI processing later
async function mockProcessContent(prompt: string, contentType: ContentType): Promise<string> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (contentType === 'kevons_social_posts') {
    return `Twitter/X Version:
This is a sample tweet that would be generated based on the input text and guidelines. #sample #tweet

Threads Version:
1/5 This is the first part of a thread that would be generated based on the input text.
2/5 It continues with more detailed information spread across multiple posts.
3/5 Each post builds on the previous one while maintaining engagement.
4/5 The thread incorporates relevant phrases from your library naturally.
5/5 Finally, it ends with a clear call to action or conclusion.

LinkedIn Version:
[Professional version of the content formatted for LinkedIn's audience and style...]`;
  }

  return `This is a sample output that would be generated based on the input text, following the guidelines and examples provided, and incorporating common phrases where appropriate.

The actual implementation would use an AI model to generate proper content based on the specific content type and guidelines.`;
}

function generateTitle(text: string): string {
  // Take first 50 characters and find the last complete word
  const excerpt = text.slice(0, 50).split(' ').slice(0, -1).join(' ');
  return excerpt + (text.length > 50 ? '...' : '');
} 