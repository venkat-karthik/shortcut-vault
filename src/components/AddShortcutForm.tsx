"use client";

import { useEffect, useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AddShortcutForm({ onFinish }: { onFinish: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    } else {
      setIsNewCategory(false);
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    let categoryId = formData.get("category_id") as string;
    const newCategoryName = formData.get("new_category") as string;

    try {
      // Create new category if needed
      if (isNewCategory && newCategoryName) {
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .insert([{ name: newCategoryName }])
          .select()
          .single();
        
        if (catError) throw catError;
        categoryId = catData.id;
      }

      const data = {
        action: formData.get("action") as string,
        keys: formData.get("keys") as string,
        description: formData.get("description") as string,
        category_id: categoryId,
      };

      const { error } = await supabase.from('shortcuts').insert([data]);
      if (error) throw error;
      
      setIsOpen(false);
      onFinish();
    } catch (err) {
      console.error('Error submitting shortcut:', err);
      alert('Failed to add shortcut. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50"
      >
        <Plus size={28} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 gradient-text">Add New Shortcut</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select 
              name="category_id"
              required={!isNewCategory}
              value={isNewCategory ? "new" : undefined}
              onChange={(e) => setIsNewCategory(e.target.value === "new")}
              className="w-full bg-surface border border-glass-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none text-white"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="new" className="text-primary font-bold">+ Create New Category...</option>
            </select>
          </div>

          {isNewCategory && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-slate-400 mb-1">New Category Name</label>
              <input 
                name="new_category"
                required
                placeholder="e.g., Photoshop, Notion"
                className="w-full bg-surface border border-glass-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Action</label>
            <input 
              name="action"
              required
              placeholder="e.g., Save File, Create Component"
              className="w-full bg-surface border border-glass-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Keys</label>
            <input 
              name="keys"
              required
              placeholder="e.g., Ctrl + S"
              className="w-full bg-surface border border-glass-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
            <textarea 
              name="description"
              rows={3}
              placeholder="What does this do?"
              className="w-full bg-surface border border-glass-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-white"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Adding...
              </>
            ) : "Add to Vault"}
          </button>
        </form>
      </div>
    </div>
  );
}
