export type ContentType = 'MOVIE' | 'ANIME' | 'VIDEO' | 'STORY' | 'MANGA';
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'uploader' | 'editor' | 'translator' | 'vip_user' | 'user' | 'banned_user';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type MediaType = 'video' | 'image' | 'text';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: ContentType;
  posterUrl?: string;
  backgroundUrl?: string;
  releaseYear?: number;
  releaseStatus?: string;
  ratingAvg?: number;
  viewCount?: number;
  genres?: ContentGenre[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentGenre {
  genreId: string;
  genre: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Episode {
  id: string;
  episodeNum: number;
  title?: string;
  thumbnailUrl?: string;
  duration?: number;
  sources?: VideoSource[];
  hlsUrl?: string;
  content?: Content;
}

export interface Chapter {
  id: string;
  chapterNum: number;
  title?: string;
  pages?: string[];
  content?: string;
  contentId: string;
}

export interface VideoSource {
  url: string;
  quality: string;
  type: string;
}

export interface Comment {
  id: string;
  text: string;
  user?: User;
  contentId: string;
  likes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type?: string;
  createdAt: string;
}

export interface Follow {
  contentId: string;
  content: Content;
  createdAt: string;
}

export interface WatchHistory {
  id: string;
  episodeId: string;
  progress: number;
  episode?: Episode;
  createdAt: string;
}

export interface ReadHistory {
  id: string;
  chapterId: string;
  progress: number;
  mangaChapter?: Chapter;
  storyChapter?: Chapter;
  createdAt: string;
}
