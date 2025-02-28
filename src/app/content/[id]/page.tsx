"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { contentTypeNames, formatDate } from "@/lib/utils";
import type { Database } from "@/lib/supabase";

type Content = Database["public"]["Tables"]["content"]["Row"];

export default function ContentViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from("content")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setContent(data);
      } catch (e) {
        console.error("Error fetching content:", e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [params.id]);

  const handleTogglePosted = async () => {
    try {
      const { error } = await supabase
        .from("content")
        .update({ is_posted: !content?.is_posted })
        .eq("id", params.id);

      if (error) throw error;

      // Update local state
      setContent(content => content ? { ...content, is_posted: !content.is_posted } : null);
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this content?")) return;

    try {
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("id", params.id);

      if (error) throw error;

      // Redirect back to content list
      router.push("/content");
    } catch (e) {
      console.error("Error removing content:", e);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-6 text-center text-muted">Loading...</div>;
  if (error) return <div className="max-w-4xl mx-auto p-6 text-center text-red-500">Error loading content</div>;
  if (!content) return <div className="max-w-4xl mx-auto p-6 text-center text-muted">Content not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{content.title}</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-muted hover:text-black transition-colors"
        >
          ← Back to list
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted">
            <span>{formatDate(content.created_at)}</span>
            <span>•</span>
            <span>{contentTypeNames[content.content_type]}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium
            ${content.is_posted 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {content.is_posted ? "Posted" : "Unposted"}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Input</h2>
            <div className="whitespace-pre-wrap rounded-lg border border-border p-4 bg-gray-50/50">
              {content.input_text}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">Output for {contentTypeNames[content.content_type]}</h2>
            <div className="whitespace-pre-wrap rounded-lg border border-border p-4 bg-gray-50/50">
              {(() => {
                // First, split into sections
                const sections = content.output_text.split('**Adaptation for');
                
                // Find the relevant section based on content type
                const sectionMap = {
                  'small_schools_article': 'a Parenting Blog',
                  'kevons_newsletter': 'a Newsletter',
                  'kevons_personal_essay': 'a Personal Essay',
                  'kevons_social_posts': 'a Social Media Post'
                };

                const relevantSection = sections.find(s => 
                  s.includes(sectionMap[content.content_type as keyof typeof sectionMap])
                );
                
                if (!relevantSection) return content.output_text; // Fallback to full content
                
                // Clean up the section
                return relevantSection
                  .replace(/\*\*.*?\*\*/g, '')  // Remove **text**
                  .replace(/---/g, '\n')        // Replace --- with newlines
                  .trim();                      // Clean up whitespace
              })()}
            </div>
          </div>

          {content.content_type === "kevons_social_posts" && content.is_posted && (
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Posted to</h2>
              <div className="flex space-x-4 text-sm text-muted">
                <span>Twitter/X</span>
                <span>•</span>
                <span>Threads</span>
                <span>•</span>
                <span>LinkedIn</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          onClick={handleTogglePosted}
          className={`px-4 py-2 rounded-lg transition-colors ${
            content.is_posted
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          {content.is_posted ? "Mark as Unposted" : "Mark as Posted"}
        </button>
        <button
          onClick={handleRemove}
          className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
} 