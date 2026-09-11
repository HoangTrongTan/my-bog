import { Injectable, signal } from '@angular/core';
import { getGeminiApiKey, callGeminiAiApi } from '../configs/api.config';

export type TrendRegion = 'all' | 'asia' | 'europe' | 'nam-my' | 'bac-my' | 'vietnam' | 'global';
export type TrendPlatform = 'all' | 'tiktok' | 'douyin' | 'instagram' | 'x-threads' | 'youtube';
export type TrendCategory = 'all' | 'music' | 'parody' | 'meme' | 'challenge' | 'lifestyle';

export interface GenZTrendItem {
  id: string;
  title: string;
  shortSummary: string;
  detailContent: string;
  genzSlangBadge: string;
  region: TrendRegion;
  regionLabel: string;
  platform: TrendPlatform;
  platformLabel: string;
  category: TrendCategory;
  categoryLabel: string;
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  viewsCount: string;
  likeCount: number;
  isLiked: boolean;
  tags: string[];
  viralScore: number;
  hotRank: number;
  updatedAt: string;
}

/** Shape of a single trend item as returned by the Gemini AI JSON response, before defaults are applied. */
interface RawAiTrendItem {
  id?: string;
  title?: string;
  shortSummary?: string;
  detailContent?: string;
  genzSlangBadge?: string;
  region?: TrendRegion;
  regionLabel?: string;
  platform?: TrendPlatform;
  platformLabel?: string;
  category?: TrendCategory;
  categoryLabel?: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  viewsCount?: string;
  likeCount?: number;
  tags?: string[];
  viralScore?: number;
}

const CACHE_KEY = 'genz_trends_ai_only_v4';
const CACHE_TIME_KEY = 'genz_trends_ai_timestamp_v4';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours Cache

@Injectable({ providedIn: 'root' })
export class TrendService {
  public trendsSignal = signal<GenZTrendItem[]>([]);
  public isAiLoading = signal<boolean>(false);
  public aiError = signal<string | null>(null);
  public isMissingKey = signal<boolean>(false);
  public lastCacheTime = signal<string>('');

  private readonly IMAGE_POOL = [
    '/access/imgs/trends/capybara.png',
    '/access/imgs/trends/douyin_dance.png',
    '/access/imgs/trends/meme_cat.png',
    '/access/imgs/trends/latam_football.png',
  ];

  constructor() {
    this.loadTrendsWith24hCache();
  }

  /**
   * Load trends strictly from 24h cache or trigger dynamic Gemini AI call.
   */
  public async loadTrendsWith24hCache(forceRefresh = false): Promise<void> {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimeStr = localStorage.getItem(CACHE_TIME_KEY);
      const now = Date.now();

      if (!forceRefresh && cachedData && cachedTimeStr) {
        const cachedTime = parseInt(cachedTimeStr, 10);
        if (now - cachedTime < CACHE_DURATION_MS) {
          // Cache is valid (< 24h)!
          const parsed: GenZTrendItem[] = JSON.parse(cachedData);
          if (parsed && parsed.length > 0) {
            this.trendsSignal.set(parsed);
            const dateObj = new Date(cachedTime);
            this.lastCacheTime.set(
              dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                ' (' +
                dateObj.toLocaleDateString() +
                ')'
            );
            this.isMissingKey.set(false);
            return;
          }
        }
      }

      // Cache expired or force refresh: Call Gemini AI API directly!
      await this.fetchTrendsFromGeminiAi(now);
    } catch {
      await this.fetchTrendsFromGeminiAi(Date.now());
    }
  }

  /**
   * Call Gemini AI API directly to generate fresh Gen Z trend news.
   */
  public async fetchTrendsFromGeminiAi(timestamp: number): Promise<void> {
    this.isAiLoading.set(true);
    this.aiError.set(null);
    this.isMissingKey.set(false);
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      this.isAiLoading.set(false);
      this.isMissingKey.set(true);
      this.aiError.set('Chưa tìm thấy Gemini API Key trên Vercel / Trình duyệt. Vui lòng kiểm tra biến môi trường AUTH_API_KEY!');
      return;
    }

    const prompt = `
Bạn là một Hệ Thống AI Chuyên Giám Sát Trends & Tin Tức Hot Giới Trẻ (Gen Z, TikTok, Douyin, Instagram, X, Threads, YouTube).
Hãy sáng tạo 6 bản tin hot trend cực mới, cực hài hước, bựa, ngắn gọn, súc tích, chứa nhiều emoji cho các khu vực (Châu Á & Douyin, Việt Nam, Châu Âu & Mỹ, Nam Mỹ, Toàn Cầu).

CẤU TRÚC MỖI BẢN TIN TRẢ VỀ TRONG MẢNG JSON:
- "id": string unique (ví dụ: "trend-ai-1")
- "title": string (Tiêu đề bựa, giật gân Gen Z kèm icon)
- "shortSummary": string (Tóm tắt cực ngắn gọn, súc tích, hài hước, bựa, có emoji)
- "detailContent": string (Nội dung chi tiết câu chuyện, phản ứng Gen Z, thống kê lượt view)
- "genzSlangBadge": string (ví dụ: "🔥 VÔ TRI CỰC MỊN", "⚡ VISUAL ĐỈNH NÓC", "🤪 MEME BỰA VƯƠNG")
- "region": one of ["asia", "vietnam", "europe", "nam-my", "global"]
- "regionLabel": string (ví dụ: "Châu Á & Douyin", "Việt Nam", "Châu Âu & Mỹ", "Nam Mỹ (Latin)", "Toàn Cầu")
- "platform": one of ["tiktok", "douyin", "instagram", "x-threads", "youtube"]
- "platformLabel": string (ví dụ: "TikTok", "Douyin", "Instagram Reels", "X / Threads", "YouTube Shorts")
- "category": one of ["music", "parody", "meme", "challenge", "lifestyle"]
- "categoryLabel": string (ví dụ: "Nhạc Hot", "Nhạc Chế Parody", "Meme Bựa", "Challenge Đỉnh", "Sống Trẻ")
- "imageUrl": string (URL ảnh minh họa hot trend chất lượng cao từ Unsplash HTTPS hoặc HTTPS image link phù hợp)
- "sourceUrl": string (Đường link URL dẫn trực tiếp đến nguồn tin/chủ đề hot như "https://www.tiktok.com", "https://www.douyin.com", "https://x.com", "https://www.instagram.com")
- "sourceName": string (Tên kênh nguồn tin tức, ví dụ: "TikTok Viral Trend Hub", "Douyin Trending #1", "X (Twitter) Global Trends", "Instagram Reels Daily")
- "viewsCount": string (ví dụ: "1.5B Views", "920M Views")
- "likeCount": number (từ 200000 đến 900000)
- "tags": array of 4 hashtag strings (ví dụ: ["#GenZTrend", "#TikTokViral", "#BuaBao", "#HotMusic"])
- "viralScore": number (từ 92 đến 99)
- "hotRank": number (1 đến 6)

YÊU CẦU BẮT BUỘC: Trả về KẾT QUẢ ĐÚNG MẢNG JSON HỢP LỆ (Không bọc trong markdown code block \`\`\`json, không thêm bất kỳ văn bản thừa nào).
`;

    try {
      const rawText = await callGeminiAiApi(prompt);
      const cleanJson = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed: RawAiTrendItem[] = JSON.parse(cleanJson);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const formattedTrends: GenZTrendItem[] = parsed.map((item, idx) => {
          let img = this.IMAGE_POOL[idx % this.IMAGE_POOL.length];
          if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim().startsWith('http')) {
            img = item.imageUrl.trim();
          }

          const srcUrl = this.buildDeepSourceUrl(item);

          return {
            id: item.id || `trend_ai_${Date.now()}_${idx}`,
            title: item.title || `🔥 Hot Trend Gen Z ${idx + 1}`,
            shortSummary: item.shortSummary || '🔥 Trend cực hot đang gây bão mạng xã hội!',
            detailContent: item.detailContent || 'Bản tin chi tiết đang được Gen Z bàn tán xôn xao.',
            genzSlangBadge: item.genzSlangBadge || '🔥 AI HOT TREND',
            region: item.region || 'global',
            regionLabel: item.regionLabel || 'Toàn Cầu',
            platform: item.platform || 'tiktok',
            platformLabel: item.platformLabel || 'TikTok',
            category: item.category || 'challenge',
            categoryLabel: item.categoryLabel || 'Challenge Đỉnh',
            imageUrl: img,
            sourceUrl: srcUrl,
            sourceName: item.sourceName || (item.platformLabel ? `${item.platformLabel} Trend Channel` : 'Nguồn Mạng Xã Hội'),
            viewsCount: item.viewsCount || '990M Views',
            likeCount: item.likeCount || 350000 + idx * 50000,
            isLiked: false,
            tags: Array.isArray(item.tags) ? item.tags : ['#GenZTrend', '#AiGenerated'],
            viralScore: item.viralScore || 98,
            hotRank: idx + 1,
            updatedAt: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });

        this.saveTrendsToCache(formattedTrends, timestamp);
        this.isAiLoading.set(false);
        this.isMissingKey.set(false);
        return;
      }
    } catch (err) {
      console.error('Gemini AI Trends generation error:', err);
      if (err instanceof Error && err.message === 'MISSING_API_KEY') {
        this.isMissingKey.set(true);
        this.aiError.set('Chưa cấu hình API Key trên Vercel / Trình duyệt.');
      } else {
        this.aiError.set('Không thể kết nối tới Google Gemini AI. Vui lòng kiểm tra lại kết nối hoặc API Key!');
      }
    } finally {
      this.isAiLoading.set(false);
    }
  }



  private saveTrendsToCache(trends: GenZTrendItem[], timestamp: number): void {
    this.trendsSignal.set(trends);
    const dateObj = new Date(timestamp);
    this.lastCacheTime.set(
      dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' (' +
        dateObj.toLocaleDateString() +
        ')'
    );

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(trends));
      localStorage.setItem(CACHE_TIME_KEY, timestamp.toString());
    } catch {
      // Ignore storage error
    }
  }

  public forceRefreshTrends(): void {
    this.loadTrendsWith24hCache(true);
  }

  public incrementLikeCountOnly(trendId: string): number {
    let updatedLikes = 0;
    this.trendsSignal.update((current) =>
      current.map((t) => {
        if (t.id === trendId) {
          updatedLikes = t.likeCount + 1;
          return {
            ...t,
            isLiked: true,
            likeCount: updatedLikes,
          };
        }
        return t;
      })
    );

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.trendsSignal()));
    } catch {
      // Ignore
    }

    return updatedLikes;
  }

  private buildDeepSourceUrl(item: RawAiTrendItem): string {
    const rawUrl = item?.sourceUrl;
    if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().startsWith('http')) {
      const trimmed = rawUrl.trim();
      try {
        const u = new URL(trimmed);
        if (u.search.length > 0 || (u.pathname !== '/' && u.pathname !== '')) {
          return trimmed;
        }
      } catch {
        // Ignore invalid URL
      }
    }

    const platform = item?.platform || 'tiktok';
    const title = item?.title || 'Hot Trend Gen Z';
    const tags: string[] = Array.isArray(item?.tags) ? item.tags : [];
    const queryStr = encodeURIComponent(title.replace(/[^\w\s\u00C0-\u024F]/gi, ' ').trim());
    const firstTag = tags[0] ? encodeURIComponent(tags[0].replace('#', '').trim()) : '';

    if (platform === 'tiktok') {
      return firstTag
        ? `https://www.tiktok.com/tag/${firstTag}`
        : `https://www.tiktok.com/search?q=${queryStr}`;
    } else if (platform === 'douyin') {
      return `https://www.douyin.com/search/${queryStr}`;
    } else if (platform === 'instagram') {
      return firstTag
        ? `https://www.instagram.com/explore/tags/${firstTag}/`
        : `https://www.google.com/search?q=site:instagram.com+${queryStr}`;
    } else if (platform === 'x-threads') {
      return `https://x.com/search?q=${queryStr}&src=typed_query`;
    } else if (platform === 'youtube') {
      return `https://www.youtube.com/results?search_query=${queryStr}`;
    }

    return `https://www.google.com/search?q=${queryStr}`;
  }
}
