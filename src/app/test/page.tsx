"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { aiService } from "@/lib/ai";

export default function TestPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.generateContent(
        input,
        "kevons_social_posts" // Testing with social posts to see all formats
      );
      setOutput(result);
    } catch (e) {
      console.error("Error testing Grok:", e);
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatOutput = (text: string) => {
    // Split the output into sections based on platform headers
    const sections = text.split(/(?=Twitter\/X Version:|Threads Version:|LinkedIn Version:|Blog Post:|Social Media Post:|Podcast Script:)/);
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      const isTwitter = section.includes("Twitter/X Version:");
      const isThreads = section.includes("Threads Version:");
      const isLinkedIn = section.includes("LinkedIn Version:");
      
      return (
        <div key={index} className="mb-6">
          <h3 className="font-bold text-lg mb-2">
            {isTwitter && "Twitter/X"}
            {isThreads && "Threads"}
            {isLinkedIn && "LinkedIn"}
            {!isTwitter && !isThreads && !isLinkedIn && "Output"}
          </h3>
          <div className={`p-4 rounded-lg ${
            isTwitter ? "bg-gray-100 border border-gray-200" :
            isThreads ? "bg-gray-50 border border-gray-200" :
            isLinkedIn ? "bg-blue-50 border border-blue-200" :
            "bg-white border border-gray-200"
          }`}>
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {section.replace(/Twitter\/X Version:|Threads Version:|LinkedIn Version:|Blog Post:|Social Media Post:|Podcast Script:/, "").trim()}
            </pre>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Test Grok Integration</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="font-medium">Input Text</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter some text to test..."
            className="min-h-[100px]"
          />
        </div>

        <button
          onClick={handleTest}
          disabled={loading || !input}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Test Grok"}
        </button>

        {error && (
          <div className="text-red-500 p-4 rounded-lg bg-red-50 border border-red-200">
            Error: {error}
          </div>
        )}

        {output && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Generated Content</h2>
            <div className="space-y-4">
              {formatOutput(output)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 