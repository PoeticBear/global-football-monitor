import type { PanelOptions } from './Panel';
import { Panel } from './Panel';
import type { NewsItem } from '@/types';

export class FootballNewsPanel extends Panel {
  private items: NewsItem[] = [];
  private activeIndex = -1;

  /** 由 PanelLayoutManager 设置，点击地图按钮时调用 */
  public onLocationRequest: ((lat: number, lon: number) => void) | null = null;

  constructor() {
    super({
      id: 'football-news',
      title: 'Football News',
      showCount: true,
      trackActivity: true,
      collapsible: true,
      defaultRowSpan: 2,
    } as PanelOptions);

    this.content.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // 点击地图定位按钮
      const mapBtn = target.closest<HTMLElement>('.fn-map-btn');
      if (mapBtn) {
        const idx = parseInt(mapBtn.dataset.index ?? '-1', 10);
        const item = this.items[idx];
        if (item?.lat != null && item?.lon != null && this.onLocationRequest) {
          this.onLocationRequest(item.lat, item.lon);
        }
        return;
      }

      // 点击新闻项本身
      const itemEl = target.closest<HTMLElement>('.fn-item');
      if (!itemEl) return;
      const idx = parseInt(itemEl.dataset.index ?? '-1', 10);
      if (idx < 0) return;
      this.activeIndex = idx;
      this.render();
      const item = this.items[idx];
      if (item?.link) {
        window.open(item.link, '_blank', 'noopener');
      }
    });
  }

  /**
   * DataLoader 通过 callPanel('football-news', 'setData', items) 调用此方法。
   */
  public setData(items: NewsItem[]): void {
    this.items = items;
    this.setCount(items.length);
    this.setDataBadge('live');
    this.render();
  }

  private render(): void {
    if (!this.items.length) {
      this.setContent(`<div class="fn-empty">No football news available.</div>`);
      return;
    }

    const html = this.items.map((item, i) => {
      const time = this.formatTime(item.pubDate);
      const locationName = item.locationName ? this.escapeHtml(item.locationName) : '';
      const hasLocation = item.lat != null && item.lon != null;
      const isActive = i === this.activeIndex ? ' active' : '';
      const mapBtn = hasLocation
        ? `<button class="fn-map-btn" data-index="${i}" title="Show on map">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
               <circle cx="12" cy="10" r="3"/>
             </svg>
           </button>`
        : '';
      const locationHtml = locationName
        ? `<div class="fn-location">
             <span class="fn-location-icon">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                 <circle cx="12" cy="10" r="3" fill="var(--panel-bg)"/>
               </svg>
             </span>
             <span class="fn-location-name">${locationName}</span>
             ${mapBtn}
           </div>`
        : '';
      const imageHtml = `<div class="fn-image-placeholder">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>`;
      return `
        <div class="fn-item${isActive}" data-index="${i}">
          ${imageHtml}
          <div class="fn-content">
            <div class="fn-item-header">
              <span class="fn-source">${this.escapeHtml(item.source)}</span>
              <span class="fn-time">${time}</span>
            </div>
            <div class="fn-title">${this.escapeHtml(item.title)}</div>
            ${locationHtml}
          </div>
        </div>`;
    }).join('');

    this.setContent(`<div class="fn-list" translate="no">${html}</div>`);
  }

  private formatTime(date: Date): string {
    const now = Date.now();
    const diff = now - date.getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return date.toLocaleDateString();
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
