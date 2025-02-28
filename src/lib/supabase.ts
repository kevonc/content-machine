import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Database = {
  public: {
    Tables: {
      guidelines: {
        Row: {
          id: string;
          content_type: 'small_schools_article' | 'kevons_newsletter' | 'kevons_personal_essay' | 'kevons_social_posts';
          guideline: string;
          examples: string;
          created_at: string;
          updated_at: string;
        };
      };
      phrases: {
        Row: {
          id: string;
          phrase: string;
          created_at: string;
        };
      };
      content: {
        Row: {
          id: string;
          title: string;
          input_text: string;
          output_text: string;
          content_type: 'small_schools_article' | 'kevons_newsletter' | 'kevons_personal_essay' | 'kevons_social_posts';
          is_posted: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}; 