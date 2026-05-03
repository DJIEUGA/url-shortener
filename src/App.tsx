import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  RefreshCcw, 
  Copy, 
  Trash2, 
  ArrowRight,
  History,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TransformedURL, URLStats } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [urls, setUrls] = useState<TransformedURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputUrl, setInputUrl] = useState('');
  const [transformationType, setTransformationType] = useState<'Shorten' | 'Clean'>('Shorten');
  const [isTransforming, setIsTransforming] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const stats: URLStats = {
    totalUrls: urls.length,
    totalClicks: urls.reduce((acc, u) => acc + (u.clicks || 0), 0),
    recentGrowth: '+24%',
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputUrl(value);
    if (value && !validateUrl(value)) {
      setUrlError('Please enter a valid URL (e.g., https://google.com)');
    } else {
      setUrlError(null);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/urls');
      const data = await response.json();
      setUrls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    
    setIsTransforming(true);
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: inputUrl,
          transformationType,
        }),
      });
      if (response.ok) {
        setInputUrl('');
        await fetchUrls();
      }
    } catch (error) {
      console.error('Transformation failed:', error);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this entry?')) return;
    try {
      const response = await fetch(`/api/urls/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setUrls(prev => prev.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans py-12 px-4 selection:bg-gh-blue selection:text-white">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gh-gray-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center">
              <Link2 size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Url shorty</h1>
          </div>
          <p className="text-xs text-gh-gray-text font-medium bg-gh-gray-bg px-2 py-1 border border-gh-gray-border rounded-full">TRANSFORM_PRO / v1.0</p>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-8">
          <div className="gh-card p-4 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] font-bold text-gh-gray-text uppercase tracking-widest mb-1">Total Links</div>
            <div className="text-2xl font-black text-slate-900 leading-none">{stats.totalUrls}</div>
          </div>
          <div className="gh-card p-4 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] font-bold text-gh-gray-text uppercase tracking-widest mb-1">Global Clicks</div>
            <div className="text-2xl font-black text-gh-blue leading-none">{stats.totalClicks.toLocaleString()}</div>
          </div>
        </section>

        <section className="mb-12">
          <div className="gh-card p-6">
            <h2 className="text-sm font-semibold mb-3">Create new link transformation</h2>
            <form onSubmit={handleTransform} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 ml-0.5">Original URL</label>
                <div className="relative">
                  <input 
                    type="url" 
                    placeholder="Enter a long URL to shorten" 
                    className={cn(
                      "w-full gh-input py-2.5 pr-10",
                      urlError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gh-gray-border"
                    )}
                    value={inputUrl}
                    onChange={handleUrlChange}
                    required
                  />
                  <Globe className={cn("absolute right-3 top-1/2 -translate-y-1/2 transition-colors", urlError ? "text-red-400" : "text-slate-300")} size={16} />
                </div>
                {urlError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-red-500 mt-1.5"
                  >
                    <AlertCircle size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{urlError}</span>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex bg-gh-gray-bg border border-gh-gray-border rounded-md p-0.5 flex-1 max-w-sm">
                    {(['Shorten', 'Clean'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTransformationType(type)}
                        className={cn(
                          "flex-1 py-1.5 rounded-md text-xs font-semibold transition-all",
                          transformationType === type ? "bg-white text-gh-blue shadow-sm ring-1 ring-gh-gray-border" : "text-gh-gray-text hover:text-slate-900"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                </div>
                <button 
                  type="submit"
                  disabled={isTransforming || !!urlError || !inputUrl}
                  className={cn(
                    "gh-button-primary flex items-center justify-center gap-2 min-w-[140px] transition-all",
                    (isTransforming || !!urlError || !inputUrl) && "opacity-60 cursor-not-allowed bg-slate-300 hover:bg-slate-300 text-slate-500 border-transparent shadow-none"
                  )}
                >
                  {isTransforming ? <RefreshCcw className="animate-spin size-4" /> : <>Shorten URL <ArrowRight size={14} /></>}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Latest Result (GitHub specific 'New' indicator style) */}
        {urls.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-gh-blue animate-pulse" />
              <h2 className="text-sm font-semibold">Latest transformation</h2>
            </div>
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="gh-card border-gh-blue/30 bg-gh-blue/5 p-4 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-gh-blue uppercase tracking-wider mb-0.5">ALIAS: {urls[0].alias}</div>
                <div className="text-base font-semibold truncate text-gh-blue decoration-gh-blue/20 underline underline-offset-4">{urls[0].transformedUrl}</div>
              </div>
              <button 
                onClick={() => copyToClipboard(urls[0].transformedUrl, urls[0].id)}
                className="gh-button-secondary py-2 hover:border-gh-blue/30"
              >
                {copyStatus === urls[0].id ? <CheckCircle2 size={16} className="text-gh-green" /> : <Copy size={16} />}
              </button>
            </motion.div>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">Activity History</h2>
              <span className="bg-gh-gray-bg border border-gh-gray-border text-[10px] font-bold px-2 py-0.5 rounded-full">{urls.length}</span>
            </div>
            <button onClick={fetchUrls} className="text-gh-gray-text hover:text-gh-blue transition-colors">
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          
          <div className="gh-card overflow-hidden">
            <div className="divide-y divide-gh-gray-border">
              <AnimatePresence mode="popLayout">
                {urls.map((url, idx) => (
                  <motion.div 
                    key={url.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.02 }}
                    className="p-4 flex items-center justify-between gap-4 group hover:bg-[#fafbfc] transition-colors duration-200"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold bg-gh-gray-bg border border-gh-gray-border px-1.5 py-0.5 rounded text-gh-gray-text">{url.transformationType}</span>
                        <span className="text-[10px] font-medium text-gh-gray-text">{new Date(url.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="font-semibold text-sm truncate text-gh-blue hover:underline cursor-pointer">{url.transformedUrl}</div>
                      <div className="text-xs text-gh-gray-text truncate mt-0.5 font-mono opacity-60 group-hover:opacity-100 transition-opacity">{url.originalUrl}</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right pr-4 border-r border-gh-gray-border">
                        <div className="text-[10px] font-semibold text-gh-gray-text uppercase tracking-tight">Clicks</div>
                        <div className="text-sm font-bold leading-none">{url.clicks || 0}</div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-[80px] justify-end">
                        <button 
                          onClick={() => copyToClipboard(url.transformedUrl, url.id)}
                          className="p-2 text-gh-gray-text hover:text-gh-blue transition-all rounded-md hover:bg-gh-gray-bg"
                          title="Copy to clipboard"
                        >
                          {copyStatus === url.id ? <CheckCircle2 size={16} className="text-gh-green" /> : <Copy size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(url.id)}
                          className="p-2 text-gh-gray-text hover:text-red-600 transition-all rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete link"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {urls.length === 0 && !loading && (
              <div className="text-center py-16">
                <Globe className="mx-auto text-gh-gray-border mb-3" size={32} />
                <p className="text-gh-gray-text text-sm font-medium">No links transformed yet.</p>
              </div>
            )}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-gh-gray-border text-center">
        </footer>
      </div>
    </div>
  );
}
