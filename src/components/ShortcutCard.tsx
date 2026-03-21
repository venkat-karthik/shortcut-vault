"use client";

import { useState } from "react";
import { Copy, Check, ThumbsUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ShortcutCardProps {
  id: string;
  action: string;
  keys: string;
  description?: string;
  votes: number;
  category: string;
}

export default function ShortcutCard({ id, action, keys, description, votes: initialVotes, category }: ShortcutCardProps) {
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(keys);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = async () => {
    if (!voted && !loading) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('shortcuts')
          .update({ votes: votes + 1 })
          .eq('id', id);

        if (error) throw error;
        
        setVotes(prev => prev + 1);
        setVoted(true);
      } catch (err) {
        console.error('Error voting:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const keyParts = keys.split("+").map(k => k.trim());

  return (
    <div className="glass-card p-6 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
            {category}
          </span>
          <button 
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors p-1"
            title="Copy shortcut"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{action}</h3>
        {description && <p className="text-slate-400 text-sm mb-6">{description}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {keyParts.map((key, i) => (
            <span key={i} className="flex items-center">
              <kbd className="kdb-key">{key}</kbd>
              {i < keyParts.length - 1 && <span className="text-slate-500 font-bold mx-1">+</span>}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-glass-border pt-4">
          <button 
            onClick={handleVote}
            disabled={voted}
            className={`flex items-center gap-2 text-sm font-medium transition-all ${
              voted ? 'text-primary' : 'text-slate-400 hover:text-white'
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin text-primary" /> : <ThumbsUp size={16} fill={voted ? "currentColor" : "none"} />}
            <span>{votes} helpful</span>
          </button>
        </div>
      </div>
    </div>
  );
}
