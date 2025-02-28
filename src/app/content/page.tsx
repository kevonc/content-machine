"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { contentTypeNames, formatDate } from "@/lib/utils";
import type { Database } from "@/lib/supabase";

type Content = Database["public"]["Tables"]["content"]["Row"];

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showUnpostedOnly, setShowUnpostedOnly] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      let query = supabase
        .from("content")
        .select("*")
        .order("created_at", { ascending: false });

      if (showUnpostedOnly) {
        query = query.eq("is_posted", false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContent(data || []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostedStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("content")
        .update({ is_posted: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      await fetchContent();
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content</h1>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="unposted"
            checked={showUnpostedOnly}
            onChange={(e) => {
              setShowUnpostedOnly(e.target.checked);
              fetchContent();
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="unposted">Show unposted only</label>
        </div>
      </div>

      {loading ? (
        <div>Loading content...</div>
      ) : error ? (
        <div className="text-red-500">Error loading content</div>
      ) : content.length === 0 ? (
        <div className="text-center text-gray-500">
          No content found. Create some content from the homepage!
        </div>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">
                    {contentTypeNames[item.content_type]} • {formatDate(item.created_at)}
                  </p>
                </div>
                <button
                  className={`px-4 py-2 rounded-md ${
                    item.is_posted 
                      ? "border border-gray-300 hover:bg-gray-50" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => togglePostedStatus(item.id, item.is_posted)}
                >
                  {item.is_posted ? "Mark as Unposted" : "Mark as Posted"}
                </button>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <h3 className="font-medium">Input</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {item.input_text}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Output</h3>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-md p-3">
                    {item.output_text}
                  </div>
                </div>
              </div>

              {item.content_type === "kevons_social_posts" && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Posted to:</p>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>Twitter/X</span>
                    <span>Threads</span>
                    <span>LinkedIn</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 