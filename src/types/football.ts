import type { NewsItem } from './index';

/**
 * 足球新闻原始数据类型 —— 对应后端 REST API 响应。
 */
export interface FootballNewsRaw {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  source: string;
  url: string;
  publishedAt: string;          // ISO 8601
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  tags?: string[];
}

/**
 * 足球新闻 API 列表响应。
 */
export interface FootballNewsResponse {
  items: FootballNewsRaw[];
  total?: number;
  page?: number;
  pageSize?: number;
}

/**
 * 对应 data/latest_football_news.json 的数据结构
 */
export interface LatestFootballNewsJson {
  timestamp: string;
  total_items: number;
  news: FootballNewsItemJson[];
}

/**
 * JSON 文件中的新闻项结构
 */
export interface FootballNewsItemJson {
  title: string;
  summary?: string;
  url: string;
  image_url: string | null;
  published: string;
  source: string;
  source_priority: number;
  region: string;
  language: string;
  fetched_at: string;
  priority_score: number;
  categories?: string[];
  processed_at: string;
  title_tr?: string;
  summary_tr?: string;
}

/**
 * 将 FootballNewsItemJson 转换为项目内部的 NewsItem 类型。
 */
export function toNewsItemFromJson(raw: FootballNewsItemJson): NewsItem {
  return {
    source: raw.source,
    title: raw.title,
    link: raw.url,
    pubDate: new Date(raw.published),
    isAlert: false,
    lat: undefined,
    lon: undefined,
    locationName: undefined,
    imageUrl: raw.image_url ?? undefined,
  };
}

/**
 * 将 FootballNewsRaw 转换为项目内部的 NewsItem 类型。
 * 复用现有类型体系，使足球新闻可以接入地图标注、面板展示等已有管道。
 */
export function toNewsItem(raw: FootballNewsRaw): NewsItem {
  return {
    source: raw.source,
    title: raw.title,
    link: raw.url,
    pubDate: new Date(raw.publishedAt),
    isAlert: false,
    lat: raw.location?.latitude,
    lon: raw.location?.longitude,
    locationName: raw.location?.name,
    imageUrl: raw.imageUrl,
  };
}
