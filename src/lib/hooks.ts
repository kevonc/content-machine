import { useEffect, useState, useCallback } from 'react';
import { supabase, Database } from './supabase';

type ContentType = Database['public']['Tables']['guidelines']['Row']['content_type'];
type Guideline = Database['public']['Tables']['guidelines']['Row'];

// Hook to fetch guidelines for a specific content type
export function useGuideline(contentType: ContentType | null) {
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGuideline = useCallback(async () => {
    if (!contentType) {
      setGuideline(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null); // Reset error state
      
      const { data, error } = await supabase
        .from("guidelines")
        .select("*")
        .eq("content_type", contentType)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) throw error;
      setGuideline(data); // data will be null if no record found
      
    } catch (e) {
      console.error("Error fetching guideline:", e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [contentType]);

  useEffect(() => {
    fetchGuideline();
  }, [fetchGuideline]);

  return {
    guideline,
    loading,
    error,
    setGuideline,
    refetch: fetchGuideline
  };
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
        console.log('Fetched phrases:', data); // Debug log
        setPhrases(data);
      } catch (e) {
        console.error('Error fetching phrases:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhrases();
  }, []);

  return { phrases, loading, error };
} 