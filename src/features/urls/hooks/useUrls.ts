import { useState, useEffect, useCallback } from 'react';
import type { TransformedURL } from '@/shared/types';
import { fetchUrls, createUrl, deleteUrl } from '../api/urls.api';

export function useUrls() {
  const [urls, setUrls] = useState<TransformedURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransforming, setIsTransforming] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setUrls(await fetchUrls());
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const transform = useCallback(async (originalUrl: string, type: 'Shorten' | 'Clean') => {
    setIsTransforming(true);
    try {
      await createUrl(originalUrl, type);
      await refresh();
    } catch (err) {
      console.error('Transformation failed:', err);
    } finally {
      setIsTransforming(false);
    }
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    if (!confirm('Permanently remove this entry?')) return;
    try {
      await deleteUrl(id);
      setUrls(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, []);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  }, []);

  return { urls, loading, isTransforming, copyStatus, refresh, transform, remove, copyToClipboard };
}
