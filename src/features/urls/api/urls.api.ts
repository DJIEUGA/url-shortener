import type { TransformedURL } from '@/shared/types';

export async function fetchUrls(): Promise<TransformedURL[]> {
  const res = await fetch('/api/urls');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createUrl(
  originalUrl: string,
  transformationType: 'Shorten' | 'Clean'
): Promise<TransformedURL> {
  const res = await fetch('/api/urls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl, transformationType }),
  });
  if (!res.ok) throw new Error('Failed to create URL');
  return res.json();
}

export async function deleteUrl(id: string): Promise<void> {
  const res = await fetch(`/api/urls/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete URL');
}
