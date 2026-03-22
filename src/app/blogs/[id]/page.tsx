"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, FileText, Image as ImageIcon, File } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BlogDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  async function fetchBlogDetails() {
    try {
      setLoading(true);
      // Fetch blog metadata
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (blogError) throw blogError;
      setBlog(blogData);

      // Fetch blog contents
      const { data: contentData, error: contentError } = await supabase
        .from('blog_contents')
        .select('*')
        .eq('blog_id', id)
        .order('order_index', { ascending: true });
      
      if (contentError) throw contentError;
      setContents(contentData || []);
    } catch (err) {
      console.error('Error fetching blog details:', err);
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

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
        <Link href="/blogs" className="text-primary hover:underline">Return to all blogs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-12">
      <Link 
        href="/blogs" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-4"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Blogs
      </Link>

      <div className="space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">{blog.title}</h1>
        <div className="flex items-center gap-6 text-slate-400 text-sm border-y border-glass-border py-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(blog.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} />
            {contents.length} sections
          </div>
        </div>
        {blog.description && (
          <p className="text-xl text-slate-300 italic leading-relaxed">
            {blog.description}
          </p>
        )}
      </div>

      <div className="space-y-12 mt-12">
        {contents.map((item) => (
          <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {item.type === 'text' && (
              <div className="prose prose-invert max-w-none text-lg text-slate-300 leading-loose whitespace-pre-wrap">
                {item.content}
              </div>
            )}
            {item.type === 'image' && (
              <div className="space-y-2 group">
                <div className="rounded-2xl overflow-hidden glass-card p-2">
                  <img 
                    src={item.content} 
                    alt="Blog supplement" 
                    className="w-full h-auto rounded-xl hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              </div>
            )}
            {item.type === 'document' && (
              <a 
                href={item.content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 glass-card border-dashed hover:border-primary/50 transition-all hover:bg-primary/5"
              >
                <div className="bg-primary/20 p-3 rounded-lg text-primary">
                  <File size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Attached Document</h4>
                  <p className="text-slate-500 text-sm">Click to view or download file</p>
                </div>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
