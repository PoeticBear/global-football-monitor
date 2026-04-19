import type { FootballNewsResponse } from '@/types/football';
import { FOOTBALL_MOCK_DATA } from '@/data/football-mock-data';

/** 足球新闻 API 基地址，从环境变量读取，默认为空（使用相对路径/同源部署） */
const FOOTBALL_API_BASE = import.meta.env?.VITE_FOOTBALL_API_BASE || '';

/** 是否使用模拟数据（本地开发/测试用） */
const USE_MOCK = FOOTBALL_API_BASE === 'mock' || FOOTBALL_API_BASE === '';

/** 请求超时（毫秒） */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * 从后端 REST API 获取足球新闻列表。
 * 当 VITE_FOOTBALL_API_BASE=mock 或为空时，返回模拟数据。
 */
export async function fetchFootballNews(params?: {
  page?: number;
  pageSize?: number;
  lang?: string;
}): Promise<FootballNewsResponse> {
  // 本地开发模式：返回模拟数据
  if (USE_MOCK) {
    // 模拟 300ms 网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300));
    return FOOTBALL_MOCK_DATA;
  }

  const url = new URL(`${FOOTBALL_API_BASE}/api/football/news`, location.origin);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.pageSize) url.searchParams.set('pageSize', String(params.pageSize));
  if (params?.lang) url.searchParams.set('lang', params.lang);

  const resp = await fetch(url.toString(), {
    cache: 'no-cache',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!resp.ok) {
    throw new Error(`Football API error: HTTP ${resp.status}`);
  }

  return resp.json() as Promise<FootballNewsResponse>;
}
