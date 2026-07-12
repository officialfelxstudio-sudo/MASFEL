interface PlatformInfo {
  label: string;
  faviconUrl: string;
  color: string;
  svg?: string;
}

const platformMap: Record<string, PlatformInfo> = {
  'mediafire.com': { label: 'Mediafire', faviconUrl: '', color: '#0072C6', svg: '<svg viewBox="0 0 24 24" fill="%230072C6"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L18.18 7 12 10.82 5.82 7 12 4.18z"/></svg>' },
  'drive.google.com': { label: 'Google Drive', faviconUrl: '', color: '#4285F4' },
  'mega.nz': { label: 'Mega', faviconUrl: '', color: '#D9272E' },
  'mega.co.nz': { label: 'Mega', faviconUrl: '', color: '#D9272E' },
  'youtube.com': { label: 'YouTube', faviconUrl: '', color: '#FF0000' },
  'youtu.be': { label: 'YouTube', faviconUrl: '', color: '#FF0000' },
  'discord.gg': { label: 'Discord', faviconUrl: '', color: '#5865F2' },
  'discord.com': { label: 'Discord', faviconUrl: '', color: '#5865F2' },
  'github.com': { label: 'GitHub', faviconUrl: '', color: '#333' },
  'instagram.com': { label: 'Instagram', faviconUrl: '', color: '#E4405F' },
  'tiktok.com': { label: 'TikTok', faviconUrl: '', color: '#000' },
  'twitter.com': { label: 'Twitter', faviconUrl: '', color: '#1DA1F2' },
  'x.com': { label: 'X', faviconUrl: '', color: '#000' },
  'facebook.com': { label: 'Facebook', faviconUrl: '', color: '#1877F2' },
  'twitch.tv': { label: 'Twitch', faviconUrl: '', color: '#9146FF' },
  'spotify.com': { label: 'Spotify', faviconUrl: '', color: '#1DB954' },
  'telegram.org': { label: 'Telegram', faviconUrl: '', color: '#0088CC' },
  't.me': { label: 'Telegram', faviconUrl: '', color: '#0088CC' },
  'gofile.io': { label: 'Gofile', faviconUrl: '', color: '#396' },
  'catbox.moe': { label: 'Catbox', faviconUrl: '', color: '#1C69D4' },
  'sfile.mobi': { label: 'Sfile', faviconUrl: '', color: '#E67E22' },
  'zippyshare.com': { label: 'Zippyshare', faviconUrl: '', color: '#F5C518' },
};

const faviconCache: Record<string, string> = {};

function getFaviconUrl(domain: string): string {
  if (faviconCache[domain]) return faviconCache[domain];
  const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  faviconCache[domain] = url;
  return url;
}

export function getPlatformInfo(url: string): PlatformInfo {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace('www.', '');

    for (const [key, info] of Object.entries(platformMap)) {
      if (hostname === key || hostname.endsWith('.' + key)) {
        return { ...info, faviconUrl: getFaviconUrl(hostname) };
      }
    }

    return {
      label: hostname.replace(/\.(com|net|org|io|co|id|me|gg|dev|app|cc|xyz|link)$/i, ''),
      faviconUrl: getFaviconUrl(hostname),
      color: '#888',
    };
  } catch {
    return { label: 'Link', faviconUrl: '', color: '#888' };
  }
}
