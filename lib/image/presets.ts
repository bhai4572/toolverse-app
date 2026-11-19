/** Lightweight preset data (no image libraries) so pages can import it without pulling browser-image-compression. */
export const SOCIAL_PRESETS = [
  { id: 'insta-square', name: 'Instagram Square Post', width: 1080, height: 1080, platform: 'Instagram' },
  { id: 'insta-portrait', name: 'Instagram Portrait Post', width: 1080, height: 1350, platform: 'Instagram' },
  { id: 'insta-story', name: 'Instagram Story / Reel', width: 1080, height: 1920, platform: 'Instagram' },
  { id: 'yt-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'YouTube' },
  { id: 'yt-banner', name: 'YouTube Channel Banner', width: 2560, height: 1440, platform: 'YouTube' },
  { id: 'fb-cover', name: 'Facebook Page Cover', width: 1200, height: 628, platform: 'Facebook' },
  { id: 'fb-profile', name: 'Facebook Profile Picture', width: 600, height: 600, platform: 'Facebook' },
  { id: 'linkedin-banner', name: 'LinkedIn Company Banner', width: 1584, height: 396, platform: 'LinkedIn' },
  { id: 'linkedin-profile', name: 'LinkedIn Profile Picture', width: 400, height: 400, platform: 'LinkedIn' },
  { id: 'twitter-header', name: 'X / Twitter Header', width: 1500, height: 500, platform: 'X / Twitter' },
  { id: 'twitter-post', name: 'X / Twitter Post Image', width: 1200, height: 675, platform: 'X / Twitter' },
  { id: 'tiktok-profile', name: 'TikTok Profile Picture', width: 200, height: 200, platform: 'TikTok' },
];

export const PASSPORT_PRESETS = [
  { id: 'us-2x2', name: 'US passport / visa (2×2 in)', widthPx: 600, heightPx: 600, aspect: '1:1' },
  { id: 'uk-35x45', name: 'UK passport (35×45 mm)', widthPx: 413, heightPx: 531, aspect: '35:45' },
  { id: 'ca-50x70', name: 'Canada passport (50×70 mm)', widthPx: 590, heightPx: 826, aspect: '50:70' },
  { id: 'au-35x45', name: 'Australia passport (35×45 mm)', widthPx: 413, heightPx: 531, aspect: '35:45' },
  { id: 'schengen-35x45', name: 'EU / Schengen (35×45 mm)', widthPx: 413, heightPx: 531, aspect: '35:45' },
  { id: 'pk-2x2', name: 'Pakistan / common 2×2 in', widthPx: 600, heightPx: 600, aspect: '1:1' },
  { id: 'india-passport', name: 'India passport (35×35 mm)', widthPx: 413, heightPx: 413, aspect: '1:1' },
];
