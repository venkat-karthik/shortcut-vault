"use client";

import { useState, useEffect } from "react";
import ShortcutCard from "@/components/ShortcutCard";
import AddShortcutForm from "@/components/AddShortcutForm";
import { Search, Zap, Layout, FileText, Table } from "lucide-react";



import { supabase } from "@/lib/supabase";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [shortcuts, setShortcuts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // Fetch shortcuts with category info
      const { data: shortData } = await supabase
        .from('shortcuts')
        .select(`
          *,
          categories (name)
        `);
      
      if (shortData) {
        const formatted = shortData.map(s => ({
          ...s,
          category: s.categories?.name || 'Uncategorized'
        }));
        setShortcuts(formatted);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = 
      shortcut.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shortcut.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      shortcut.keys.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || shortcut.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.votes - a.votes);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] -z-10 animate-pulse" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Master Your <span className="gradient-text">Workflow</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          The community-driven vault for time-saving shortcuts and software tricks.
          Stop searching, start creating.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search shortcuts (e.g., 'save', 'figma')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/50 backdrop-blur-md border border-glass-border rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all text-lg"
          />
        </div>
      </section>

      {/* Category Tabs */}
      <section className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => setSelectedCategory("All")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${
            selectedCategory === "All" 
              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
              : "border-glass-border hover:border-primary/50 text-slate-400 hover:text-white"
          }`}
        >
          <Zap size={18} />
          <span className="font-medium">All</span>
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${
              cat.name === selectedCategory 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                : "border-glass-border hover:border-primary/50 text-slate-400 hover:text-white"
            }`}
          >
            <Layout size={18} />
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}
      </section>

      {/* Shortcuts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShortcuts.map((shortcut) => (
          <ShortcutCard 
            key={shortcut.id}
            {...shortcut}
          />
        ))}
        {filteredShortcuts.length === 0 && (
          <div className="col-span-full text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-glass-border">
            <p className="text-slate-500 text-lg">No shortcuts found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-4 text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      <AddShortcutForm onFinish={fetchData} />

      {/* Footer */}
      <footer className="text-center pt-20 pb-10 border-t border-glass-border">
        <p className="text-slate-500 text-sm">
          Built for pros by <span className="text-primary font-semibold italic">Antigravity</span>
        </p>
      </footer>
    </div>
  );
}
