"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, X, Image as ImageIcon, FileText, 
  Type, Save, Loader2, Trash2, ArrowUp, ArrowDown 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type ContentBlock = {
  id: string;
  type: 'text' | 'image' | 'document';
  value: string | File | null;
  previewUrl?: string;
};

export default function BlogEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);

  const addBlock = (type: 'text' | 'image' | 'document') => {
    setBlocks([...blocks, { id: Math.random().toString(36), type, value: "" }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const handleFileChange = (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setBlocks(blocks.map(b => b.id === id ? { ...b, value: file, previewUrl } : b));
  };

  const handleTextChange = (id: string, text: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value: text } : b));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || blocks.length === 0) return alert("Please add a title and at least one content block");
    
    setLoading(true);
    try {
      // 1. Create the Blog
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .insert([{ title, description }])
        .select()
        .single();
      
      if (blogError) throw blogError;

      // 2. Process and Upload Media Blocks
      const contentEntries = [];
      
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        let contentValue = "";

        if (block.type === 'text') {
          contentValue = block.value as string;
        } else if (block.value instanceof File) {
          const file = block.value;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${blogData.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('blog-media')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('blog-media')
            .getPublicUrl(filePath);
          
          contentValue = publicUrl;
        }

        contentEntries.push({
          blog_id: blogData.id,
          type: block.type,
          content: contentValue,
          order_index: i
        });
      }

      // 3. Batch Insert Blog Contents
      const { error: contentError } = await supabase
        .from('blog_contents')
        .insert(contentEntries);
      
      if (contentError) throw contentError;

      router.push(`/blogs/${blogData.id}`);
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Failed to save blog. Ensure the "blog-media" storage bucket exists and is public.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Header */}
        <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md sticky top-4 p-4 rounded-2xl z-40 border border-glass-border">
          <h1 className="text-xl font-bold px-4">New Topic Editor</h1>
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Publish
            </button>
          </div>
        </div>

        {/* Blog Metadata */}
        <div className="space-y-6 pt-8">
          <input 
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-5xl font-extrabold outline-none placeholder:text-slate-700"
          />
          <textarea 
            placeholder="Introduction or summary..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent text-xl text-slate-400 outline-none resize-none placeholder:text-slate-800"
            rows={2}
          />
        </div>

        {/* Content Blocks */}
        <div className="space-y-8 min-h-[40vh] border-y border-glass-border py-12">
          {blocks.length === 0 && (
            <div className="text-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
              Add your first content block below to get started
            </div>
          )}
          {blocks.map((block, index) => (
            <div key={block.id} className="group relative glass-card p-6 animate-in slide-in-from-right-4 duration-300">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => moveBlock(index, 'up')} className="p-1 hover:text-primary"><ArrowUp size={16} /></button>
                <button type="button" onClick={() => moveBlock(index, 'down')} className="p-1 hover:text-primary"><ArrowDown size={16} /></button>
              </div>
              <button 
                type="button"
                onClick={() => removeBlock(block.id)}
                className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>

              {block.type === 'text' && (
                <textarea 
                  placeholder="Share your thoughts..."
                  value={block.value as string}
                  onChange={(e) => handleTextChange(block.id, e.target.value)}
                  className="w-full bg-transparent text-slate-300 outline-none resize-none leading-relaxed min-h-[100px]"
                />
              )}

              {block.type === 'image' && (
                <div className="space-y-4">
                  {block.previewUrl ? (
                    <img src={block.previewUrl} className="w-full h-auto rounded-xl" alt="Preview" />
                  ) : (
                    <label className="flex flex-col items-center justify-center py-12 cursor-pointer border-2 border-dashed border-slate-700 rounded-xl hover:border-primary transition-colors">
                      <ImageIcon className="text-slate-500 mb-2" size={32} />
                      <span className="text-slate-400">Click to upload image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleFileChange(block.id, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              )}

              {block.type === 'document' && (
                <div className="space-y-4">
                  {block.value instanceof File ? (
                    <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl text-primary font-bold">
                      <FileText size={24} />
                      {block.value.name}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-8 cursor-pointer border-2 border-dashed border-slate-700 rounded-xl hover:border-primary transition-colors">
                      <FileText className="text-slate-500 mb-2" size={32} />
                      <span className="text-slate-400">Click to upload document (PDF, Word, etc.)</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleFileChange(block.id, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Block Actions */}
        <div className="flex justify-center gap-6">
          <button 
            type="button" 
            onClick={() => addBlock('text')}
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-primary transition-all p-4"
          >
            <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-primary">
              <Type size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Text</span>
          </button>
          <button 
            type="button" 
            onClick={() => addBlock('image')}
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-primary transition-all p-4"
          >
            <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-primary">
              <ImageIcon size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Photo</span>
          </button>
          <button 
            type="button" 
            onClick={() => addBlock('document')}
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-primary transition-all p-4"
          >
            <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-primary">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Doc</span>
          </button>
        </div>
      </form>
    </div>
  );
}
