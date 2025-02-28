"use client";

import { useState } from "react";
import { useGuideline } from "@/lib/hooks";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contentTypeNames } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type ContentType = Database["public"]["Tables"]["guidelines"]["Row"]["content_type"];

export default function GuidelinesPage() {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { guideline, loading, error, refetch } = useGuideline(selectedType);
  const [formData, setFormData] = useState({
    guideline: "",
    examples: "",
  });

  const handleEdit = () => {
    setFormData({
      guideline: guideline?.guideline || "",
      examples: guideline?.examples || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedType) return;

    try {
      const { error } = await supabase
        .from("guidelines")
        .upsert({
          content_type: selectedType,
          guideline: formData.guideline,
          examples: formData.examples,
        });

      if (error) throw error;
      
      setIsEditing(false);
      await refetch();
      
    } catch (e) {
      console.error("Error saving guidelines:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Content Guidelines</h1>

      <div className="bg-card rounded-lg shadow-card p-6 space-y-6">
        <Select 
          value={selectedType || ""} 
          onChange={(e) => setSelectedType(e.target.value as ContentType)}
          className="bg-white"
        >
          <option value="">Select content type</option>
          {Object.entries(contentTypeNames).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        {loading ? (
          <div className="text-muted">Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error loading guidelines</div>
        ) : selectedType ? (
          <div className="space-y-6">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guidelines</label>
                  <Textarea
                    value={formData.guideline}
                    onChange={(e) => setFormData({ ...formData, guideline: e.target.value })}
                    className="min-h-[200px]"
                    placeholder="Enter guidelines..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Examples</label>
                  <Textarea
                    value={formData.examples}
                    onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                    className="min-h-[200px]"
                    placeholder="Enter examples..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <h2 className="text-lg font-medium">Guidelines</h2>
                  <div className="whitespace-pre-wrap rounded-lg border border-border p-4 bg-gray-50/50">
                    {guideline?.guideline || "No guidelines set"}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-medium">Examples</h2>
                  <div className="whitespace-pre-wrap rounded-lg border border-border p-4 bg-gray-50/50">
                    {guideline?.examples || "No examples set"}
                  </div>
                </div>

                <button 
                  onClick={handleEdit}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-muted py-8">
            Select a content type to view or edit guidelines
          </div>
        )}
      </div>
    </div>
  );
} 