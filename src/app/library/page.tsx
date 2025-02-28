"use client";

import { useState } from "react";
import { usePhrases } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export default function LibraryPage() {
  const { phrases, loading, error } = usePhrases();
  const [newPhrase, setNewPhrase] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAdd = async () => {
    if (!newPhrase.trim()) return;

    const { error } = await supabase
      .from("phrases")
      .insert({ phrase: newPhrase.trim() });

    if (error) {
      console.error("Error adding phrase:", error);
      return;
    }

    setNewPhrase("");
  };

  const handleEdit = async (id: string) => {
    if (!editingText.trim()) return;

    const { error } = await supabase
      .from("phrases")
      .update({ phrase: editingText.trim() })
      .eq("id", id);

    if (error) {
      console.error("Error updating phrase:", error);
      return;
    }

    setEditingId(null);
    setEditingText("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this phrase?")) return;

    const { error } = await supabase
      .from("phrases")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting phrase:", error);
    }
  };

  const startEditing = (id: string, currentPhrase: string) => {
    setEditingId(id);
    setEditingText(currentPhrase);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Phrase Library</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          Add Phrase
        </button>
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Add a new phrase..."
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd}>
          Add Phrase
        </Button>
      </div>

      {loading ? (
        <div>Loading phrases...</div>
      ) : error ? (
        <div className="text-red-500">Error loading phrases</div>
      ) : phrases.length === 0 ? (
        <div className="text-center text-gray-500">
          No phrases added yet. Add your first phrase above!
        </div>
      ) : (
        <div className="space-y-4">
          {phrases.map((phrase) => (
            <div
              key={phrase.id}
              className="flex items-start justify-between border rounded-lg p-4"
            >
              {editingId === phrase.id ? (
                <div className="flex-1 flex space-x-4">
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleEdit(phrase.id)}
                  />
                  <div className="space-x-2">
                    <Button onClick={() => handleEdit(phrase.id)}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{phrase.phrase}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Added {formatDate(phrase.created_at)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(phrase.id, phrase.phrase)}
                      className="p-2 text-gray-500 hover:text-blue-500 rounded-md hover:bg-gray-100"
                      title="Edit phrase"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(phrase.id)}
                      className="p-2 text-gray-500 hover:text-red-500 rounded-md hover:bg-gray-100"
                      title="Delete phrase"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 