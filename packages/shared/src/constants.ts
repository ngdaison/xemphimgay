export const APP_NAME = 'CineStream';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  UPLOADER: 'uploader',
  EDITOR: 'editor',
  TRANSLATOR: 'translator',
  VIP_USER: 'vip_user',
  USER: 'user',
  BANNED: 'banned_user',
};

export const CONTENT_TYPES = {
  MOVIE: 'MOVIE',
  ANIME: 'ANIME',
  VIDEO: 'VIDEO',
  STORY: 'STORY',
  MANGA: 'MANGA',
};

export const VIDEO_QUALITIES = ['360p', '480p', '720p', '1080p', '1440p', '2160p'];

export const CACHE_TTL = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
