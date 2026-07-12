interface PlatformInfo {
  label: string;
  faviconUrl: string;
  color: string;
}

const platformMap: Record<string, PlatformInfo> = {
  'mediafire.com': { label: 'Mediafire', faviconUrl: '', color: '#0072C6' },
  'drive.google.com': { label: 'Google Drive', faviconUrl: '', color: '#4285F4' },
  'mega.nz': { label: 'Mega', faviconUrl: '', color: '#D9272E' },
  'mega.co.nz': { label: 'Mega', faviconUrl: '', color: '#D9272E' },
  'youtube.com': { label: 'YouTube', faviconUrl: '', color: '#FF0000' },
  'youtu.be': { label: 'YouTube', faviconUrl: '', color: '#FF0000' },
  'discord.gg': { label: 'Discord', faviconUrl: '', color: '#5865F2' },
  'discord.com': { label: 'Discord', faviconUrl: '', color: '#5865F2' },
  'github.com': { label: 'GitHub', faviconUrl: '', color: '#333' },
};

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
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
      label: hostname,
      faviconUrl: getFaviconUrl(hostname),
      color: '#888',
    };
  } catch {
    return { label: 'Link', faviconUrl: '', color: '#888' };
  }
}
