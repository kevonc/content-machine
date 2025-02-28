import { useEffect, useState } from 'react';
import { supabase, Database } from './supabase';

type ContentType = Database['public']['Tables']['guidelines']['Row']['content_type'];
type Guideline = Database['public']['Tables']['guidelines']['Row'];

// Hook to fetch guidelines for a specific content type
export function useGuideline(contentType: ContentType | null) {
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGuideline() {
      if (!contentType) {
        setGuideline(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('guidelines')
          .select('*')
          .eq('content_type', contentType)
          .maybeSingle();

        if (error) throw error;
        setGuideline(data);
      } catch (e) {
        console.error('Error fetching guideline:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchGuideline();
  }, [contentType]);

  return { guideline, loading, error };
}

// Hook to fetch all phrases
export function usePhrases() {
  const [phrases, setPhrases] = useState<Database['public']['Tables']['phrases']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPhrases() {
      try {
        const { data, error } = await supabase
          .from('phrases')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPhrases(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhrases();
  }, []);

  return { phrases, loading, error };
} 