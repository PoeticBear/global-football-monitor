import type { FootballNewsResponse } from '@/types/football';

/**
 * 足球新闻模拟数据 —— 用于本地开发和测试。
 * 当 VITE_FOOTBALL_API_BASE=mock 时，API 客户端返回此数据。
 */
export const FOOTBALL_MOCK_DATA: FootballNewsResponse = {
  items: [
    {
      id: '1',
      title: 'Barcelona secures dramatic 3-2 victory over Real Madrid in El Clásico',
      summary: 'A thrilling match at Camp Nou saw Barcelona come from behind to beat Real Madrid 3-2, with Lamine Yamal scoring the winner in the 85th minute.',
      source: 'ESPN FC',
      url: 'https://example.com/news/1',
      publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
      location: {
        latitude: 41.3809,
        longitude: 2.1228,
        name: 'Camp Nou, Barcelona, Spain',
      },
      tags: ['La Liga', 'Barcelona', 'Real Madrid'],
    },
    {
      id: '2',
      title: 'Manchester City announces Erling Haaland contract extension until 2029',
      summary: 'The Norwegian striker has committed his future to the Etihad Stadium club, ending speculation about his future.',
      source: 'BBC Sport',
      url: 'https://example.com/news/2',
      publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
      location: {
        latitude: 53.4831,
        longitude: -2.2004,
        name: 'Etihad Stadium, Manchester, England',
      },
      tags: ['Premier League', 'Manchester City', 'Haaland'],
    },
    {
      id: '3',
      title: 'Brazil announces 2026 World Cup squad with surprise selections',
      summary: 'Brazil national team coach has named his 26-man squad for the upcoming World Cup, including several young talents.',
      source: 'Globo Esporte',
      url: 'https://example.com/news/3',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      location: {
        latitude: -23.9618,
        longitude: -46.3322,
        name: 'São Paulo, Brazil',
      },
      tags: ['World Cup', 'Brazil', 'National Team'],
    },
    {
      id: '4',
      title: 'UEFA Champions League Final set for London in 2025',
      summary: 'The final will be held at Wembley Stadium, with ticket applications opening next month.',
      source: 'UEFA Official',
      url: 'https://example.com/news/4',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      location: {
        latitude: 51.5033,
        longitude: -0.1115,
        name: 'Wembley Stadium, London, England',
      },
      tags: ['Champions League', 'UEFA'],
    },
    {
      id: '5',
      title: 'Liverpool 4-0 away win against AC Milan in Champions League',
      summary: 'Mohamed Salah scored twice as Liverpool demolished AC Milan 4-0 at San Siro.',
      source: 'Sky Sports',
      url: 'https://example.com/news/5',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      location: {
        latitude: 45.4780,
        longitude: 9.1242,
        name: 'San Siro, Milan, Italy',
      },
      tags: ['Champions League', 'Liverpool', 'AC Milan'],
    },
    {
      id: '6',
      title: 'Kylian Mbappé scores hat-trick in PSG vs Marseille rivalry match',
      summary: 'The French superstar netted three goals as PSG defeated Marseille 4-1 in Le Classique.',
      source: 'L\'Équipe',
      url: 'https://example.com/news/6',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      location: {
        latitude: 48.8414,
        longitude: 2.2530,
        name: 'Parc des Princes, Paris, France',
      },
      tags: ['Ligue 1', 'PSG', 'Marseille'],
    },
    {
      id: '7',
      title: 'J-League expansion: New stadium to host 2026 Asian Champions League Final',
      summary: 'Japan\'s newest football stadium has been confirmed as venue for next year\'s ACL final.',
      source: 'J.League',
      url: 'https://example.com/news/7',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      location: {
        latitude: 35.6812,
        longitude: 139.7671,
        name: 'Tokyo, Japan',
      },
      tags: ['J-League', 'Asian Champions League'],
    },
    {
      id: '8',
      title: 'Germany vs Spain Euro qualifier postponed due to stadium safety concerns',
      summary: 'The match has been rescheduled after inspections revealed issues with the stadium roof.',
      source: 'DW Sports',
      url: 'https://example.com/news/8',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      location: {
        latitude: 49.2967,
        longitude: 8.6404,
        name: 'Milan, Italy',
      },
      tags: ['Euro Qualifier', 'Germany', 'Spain'],
    },
  ],
  total: 8,
  page: 1,
  pageSize: 20,
};
