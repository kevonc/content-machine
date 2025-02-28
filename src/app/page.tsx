"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { contentTypeNames } from "@/lib/utils";
import { processContent } from "@/lib/services";
import type { Database } from "@/lib/supabase";

type ContentType = Database["public"]["Tables"]["guidelines"]["Row"]["content_type"];

export default function Home() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [contentType, setContentType] = useState<ContentType | "">("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!inputText.trim() || !contentType) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setProcessing(true);

    try {
      await processContent(inputText.trim(), contentType);
      router.push("/content"); // Redirect to content page after successful processing
    } catch (e) {
      setError("Error processing content. Please try again.");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create Content</h1>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="font-medium">Content</label>
          <Textarea
            placeholder="Paste your text here..."
            className="min-h-[200px]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Content Type</label>
          <Select 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value as ContentType)}
          >
            <option value="">Select content type</option>
            {Object.entries(contentTypeNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button 
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={handleProcess}
          disabled={processing || !inputText || !contentType}
        >
          {processing ? "Processing..." : "Process"}
        </button>
      </div>
    </div>
  );
} 