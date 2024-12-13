export const fetcher = async (url: string) => {
    if (!url || url.includes('undefined')) return null;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  };