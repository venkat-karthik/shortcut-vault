"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BlogListing() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end border-b border-glass-border pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold gradient-text tracking-tight">Community Vault Blogs</h1>
          <p className="text-slate-400">Deep dives into developer workflows and knowledge sharing.</p>
        </div>
        <Link 
          href="/blogs/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Create Blog
        </Link>
      </header>

      {blogs.length === 0 ? (
        <div className="text-center py-24 glass-card bg-surface/30">
          <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-300">No blogs yet</h2>
          <p className="text-slate-500 mb-8">Be the first to share your knowledge with the community!</p>
          <Link 
            href="/blogs/new"
            className="text-primary hover:underline font-bold"
          >
            Start your first topic
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link 
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="glass-card p-8 group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                  {blog.description}
                </p>
              </div>
              
              <div className="mt-8 flex items-center justify-between border-t border-glass-border pt-6">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Clock size={14} />
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read More
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
