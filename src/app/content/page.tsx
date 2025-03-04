"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { contentTypeNames, formatDate } from "@/lib/utils";
import type { Database } from "@/lib/supabase";

type Content = Database["public"]["Tables"]["content"]["Row"];
type ContentType = Database["public"]["Tables"]["content"]["Row"]["content_type"];

export default function ContentPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "posted" | "unposted">("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchContent() {
      try {
        let query = supabase.from("content").select("*").order("created_at", { ascending: false });
        
        // Apply status filter
        if (statusFilter === "posted") {
          query = query.eq("is_posted", true);
        } else if (statusFilter === "unposted") {
          query = query.eq("is_posted", false);
        }
        
        // Apply content type filter
        if (typeFilter !== "all") {
          query = query.eq("content_type", typeFilter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setContents(data || []);
      } catch (e) {
        console.error("Error fetching content:", e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [statusFilter, typeFilter]);

  const togglePosted = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("content")
        .update({ is_posted: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setContents(contents.map(item => 
        item.id === id ? { ...item, is_posted: !currentStatus } : item
      ));
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Content</h1>
        <div className="flex space-x-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "posted" | "unposted")}
            className="px-3 py-2 border border-border rounded-lg bg-white"
          >
            <option value="all">All Status</option>
            <option value="posted">Posted</option>
            <option value="unposted">Unposted</option>
          </select>
          
          {/* Content Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ContentType | "all")}
            className="px-3 py-2 border border-border rounded-lg bg-white"
          >
            <option value="all">All Types</option>
            {Object.entries(contentTypeNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-card divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">Error loading content</div>
        ) : contents.length === 0 ? (
          <div className="p-6 text-center text-muted">No content found</div>
        ) : (
          contents.map((content) => (
            <div key={content.id} className="p-6 space-y-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <h2 className="font-medium">{content.title}</h2>
                  <div className="flex items-center space-x-2 text-sm text-muted">
                    <span>{formatDate(content.created_at)}</span>
                    <span>•</span>
                    <span>{contentTypeNames[content.content_type]}</span>
                  </div>
                </div>
                <button
                  onClick={() => togglePosted(content.id, content.is_posted)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${content.is_posted 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                >
                  {content.is_posted ? "Posted" : "Unposted"}
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => router.push(`/content/${content.id}`)}
                  className="text-sm text-muted hover:text-black transition-colors"
                >
                  View Content →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 