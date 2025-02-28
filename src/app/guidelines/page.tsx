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
  const { guideline, loading, error } = useGuideline(selectedType);
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
    } catch (e) {
      console.error("Error saving guidelines:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Content Guidelines</h1>

      <Select 
        value={selectedType || ""} 
        onChange={(e) => setSelectedType(e.target.value as ContentType)}
      >
        <option value="">Select content type</option>
        {Object.entries(contentTypeNames).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading guidelines</div>
      ) : selectedType ? (
        <div className="space-y-6">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="font-medium">Guidelines</label>
                <Textarea
                  value={formData.guideline}
                  onChange={(e) => setFormData({ ...formData, guideline: e.target.value })}
                  className="min-h-[200px]"
                  placeholder="Enter guidelines..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium">Examples</label>
                <Textarea
                  value={formData.examples}
                  onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                  className="min-h-[200px]"
                  placeholder="Enter examples..."
                />
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Guidelines</h2>
                <div className="whitespace-pre-wrap rounded-md border p-4 bg-gray-50">
                  {guideline?.guideline || "No guidelines set"}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Examples</h2>
                <div className="whitespace-pre-wrap rounded-md border p-4 bg-gray-50">
                  {guideline?.examples || "No examples set"}
                </div>
              </div>

              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          Select a content type to view or edit guidelines
        </div>
      )}
    </div>
  );
} 