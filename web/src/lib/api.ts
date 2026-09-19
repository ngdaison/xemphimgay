import axios from 'axios';

const API_URL = '/api/v1';

console.log(`[Frontend] API proxy at: ${API_URL}`);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
          localStorage.setItem('access_token', data.access_token);
          if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth/login';
          }
        }
      }
      // No refresh token — just reject, don't redirect
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const fetchHomeContent = async () => {
  const { data } = await api.get('/contents/home');
  return data;
};

export const fetchContentBySlug = async (slug: string) => {
  const { data } = await api.get(`/contents/${slug}`);
  return data;
};

export const fetchStoryChapter = async (chapterId: string) => {
  const { data } = await api.get(`/stories/chapter/${chapterId}`);
  return data;
};

export const fetchMangaChapter = async (chapterId: string) => {
  const { data } = await api.get(`/mangas/chapter/${chapterId}`);
  return data;
};

export const fetchVideoEpisode = async (episodeId: string) => {
  const { data } = await api.get(`/videos/episode/${episodeId}`);
  return data;
};

export const toggleFavorite = async (contentId: string) => {
  const { data } = await api.post(`/interaction/favorite/${contentId}`);
  return data;
};

export const addComment = async (contentId: string, text: string) => {
  const { data } = await api.post('/interaction/comments', { contentId, text });
  return data;
};

export const rateContent = async (contentId: string, score: number) => {
  const { data } = await api.post('/interaction/rate', { contentId, score });
  return data;
};

export const saveHistory = async (type: 'WATCH' | 'READ', chapterOrEpisodeId: string, progress: number = 0) => {
  const { data } = await api.post('/history', { type, chapterOrEpisodeId, progress });
  return data;
};
