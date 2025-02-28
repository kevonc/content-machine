"use client";

import { useState, useEffect } from "react";
import { usePhrases } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Phrase = Database["public"]["Tables"]["phrases"]["Row"];

export default function LibraryPage() {
  const { phrases: initialPhrases, loading, error } = usePhrases();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [hoveredPhraseId, setHoveredPhraseId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update local state when initial phrases load
  useEffect(() => {
    if (initialPhrases) {
      setPhrases(initialPhrases);
    }
  }, [initialPhrases]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleAddPhrase = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhrase = newPhrase.trim();
    if (!trimmedPhrase) return;
    
    // Check for duplicates
    const isDuplicate = phrases.some(
      p => (p.phrase || p.text || "").toLowerCase() === trimmedPhrase.toLowerCase()
    );
    
    if (isDuplicate) {
      setErrorMessage("This phrase already exists in your library.");
      return;
    }
    
    setIsAdding(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase
        .from("phrases")
        .insert({ phrase: trimmedPhrase })
        .select()
        .single();

      if (error) throw error;
      
      // Update local state instead of reloading
      if (data) {
        setPhrases(prevPhrases => [data, ...prevPhrases]);
        setNewPhrase("");
      }
    } catch (e) {
      console.error("Error adding phrase:", e);
      setErrorMessage("Failed to add phrase. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeletePhrase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this phrase?")) return;
    
    try {
      const { error } = await supabase
        .from("phrases")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Update local state instead of reloading
      setPhrases(prevPhrases => prevPhrases.filter(phrase => phrase.id !== id));
    } catch (e) {
      console.error("Error deleting phrase:", e);
      setErrorMessage("Failed to delete phrase. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">
        {loading 
          ? "Phrase Library" 
          : `Phrase Library (${phrases.length})`
        }
      </h1>
      
      <form onSubmit={handleAddPhrase} className="flex flex-col space-y-2">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            placeholder="Add a new phrase..."
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            type="submit"
            disabled={isAdding || !newPhrase.trim()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? "Adding..." : "Add Phrase"}
          </button>
        </div>
        
        {errorMessage && (
          <div className="text-red-500 text-sm px-1">
            {errorMessage}
          </div>
        )}
      </form>

      {loading ? (
        <div className="text-center text-muted py-8">Loading phrases...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">Error loading phrases</div>
      ) : phrases.length === 0 ? (
        <div className="text-center text-muted py-8">No phrases added yet</div>
      ) : (
        <ul className="space-y-2">
          {phrases.map((phrase) => (
            <li 
              key={phrase.id} 
              className="text-lg flex items-center group relative pl-5"
              onMouseEnter={() => setHoveredPhraseId(phrase.id)}
              onMouseLeave={() => setHoveredPhraseId(null)}
            >
              <span className="absolute left-0">•</span>
              <span>{phrase.text || phrase.phrase}</span>
              
              {hoveredPhraseId === phrase.id && (
                <button
                  onClick={() => handleDeletePhrase(phrase.id)}
                  className="ml-3 text-red-500 hover:text-red-700 transition-colors text-sm"
                  aria-label="Delete phrase"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 