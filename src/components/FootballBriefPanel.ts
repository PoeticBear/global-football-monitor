import type { PanelOptions } from './Panel';
import { Panel } from './Panel';
import type { NewsItem } from '@/types';
import { generateSummary } from '@/services/summarization';
import type { SummarizationResult } from '@/services/summarization';

/**
 * FootballBriefPanel -- AI-generated brief of the latest football news.
 *
 * Receives football news items via setNews(), then generates a summary
 * using the client's LLM pipeline (Ollama -> Groq -> OpenRouter -> Browser T5).
 * 10-minute cooldown prevents excessive regeneration.
 */
export class FootballBriefPanel extends Panel {
  private news: NewsItem[] = [];
  private brief = '';
  private lastUpdate = 0;
  private generation = 0;
  private readonly COOLDOWN_MS = 10 * 60 * 1000;

  constructor() {
    super({
      id: 'football-brief',
      title: 'AI Brief',
      showCount: false,
      trackActivity: false,
      collapsible: true,
      defaultRowSpan: 2,
    } as PanelOptions);

    this.showLoading();
  }

  /**
   * Called by DataLoader via callPanel('football-brief', 'setNews', items).
   * Stores items and triggers summary generation if cooldown has expired.
   */
  public setNews(items: NewsItem[]): void {
    this.news = items;
    void this.maybeRefresh();
  }

  /**
   * Explicit refresh — cancels any in-progress generation and starts fresh.
   */
  public async refresh(): Promise<void> {
    await this.maybeRefresh(true);
  }

  private async maybeRefresh(force = false): Promise<void> {
    const now = Date.now();
    if (!force && now - this.lastUpdate < this.COOLDOWN_MS) {
      // Cooldown active; if we have a cached brief, keep showing it
      if (this.brief) return;
    }

    if (this.news.length < 2) {
      this.setContent('<div class="fb-empty">Not enough news to generate a brief.</div>');
      return;
    }

    this.generation++;
    const thisGen = this.generation;
    this.setProgress('Preparing football news...');

    try {
      const headlines = this.news.map((item) => item.title);
      const result = await generateSummary(
        headlines,
        (_step, _total, msg) => {
          if (thisGen !== this.generation) return;
          this.setProgress(msg);
        },
        'Global football',
      );

      if (thisGen !== this.generation) return;

      if (result?.summary) {
        this.brief = result.summary;
        this.lastUpdate = Date.now();
        this.renderBrief(this.brief, result);
      } else {
        this.renderBrief('Unable to generate brief at this time.');
      }
    } catch (err) {
      if (thisGen !== this.generation) return;
      if (this.isAbortErrorType(err)) {
        // Silently ignore abort — another refresh() was queued
        return;
      }
      console.warn('[FootballBriefPanel] generateSummary failed:', err);
      this.renderBrief('Brief generation failed. Please try again later.');
    }
  }

  private setProgress(message: string): void {
    this.setContent(`<div class="fb-progress">${this.escapeHtml(message)}</div>`);
  }

  private renderBrief(brief: string, result?: SummarizationResult): void {
    const provider = result ? `<span class="fb-provider">via ${result.provider}</span>` : '';
    this.setContent(`<div class="fb-brief">${this.escapeHtml(brief)}</div>${provider}`);
  }

  private isAbortErrorType(err: unknown): boolean {
    return err instanceof Error && err.name === 'AbortError';
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
