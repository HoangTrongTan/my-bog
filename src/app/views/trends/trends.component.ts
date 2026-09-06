import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenZTrendItem, TrendCategory, TrendPlatform, TrendRegion, TrendService } from '../../services/trend.service';
import { AudioService } from '../../services/audio.service';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.scss',
})
export class TrendsComponent {
  public trendService = inject(TrendService);
  public audioService = inject(AudioService);

  public selectedRegion = signal<TrendRegion>('all');
  public selectedPlatform = signal<TrendPlatform>('all');
  public selectedCategory = signal<TrendCategory>('all');
  public searchQuery = signal<string>('');
  public selectedTrend = signal<GenZTrendItem | null>(null);

  // TikTok Floating Heart Burst Animation State
  public floatingHearts = signal<FloatingHeart[]>([]);
  private heartIdCounter = 0;

  public regions = [
    { id: 'all', label: '🌐 Tất Cả Khu Vực' },
    { id: 'asia', label: '🏮 Châu Á & Douyin' },
    { id: 'vietnam', label: '🇻🇳 Việt Nam' },
    { id: 'europe', label: '🏰 Châu Âu & Mỹ' },
    { id: 'nam-my', label: '🕺 Nam Mỹ (Latin)' },
    { id: 'global', label: '🚀 Toàn Cầu' },
  ];

  public platforms = [
    { id: 'all', label: '📱 Tất Cả Nền Tảng' },
    { id: 'tiktok', label: '🎵 TikTok' },
    { id: 'douyin', label: '💃 Douyin' },
    { id: 'instagram', label: '📸 Instagram' },
    { id: 'x-threads', label: '🐦 X / Threads' },
    { id: 'youtube', label: '▶️ YouTube Shorts' },
  ];

  public categories = [
    { id: 'all', label: '🔥 Tất Cả Trend' },
    { id: 'music', label: '🎧 Nhạc Hot' },
    { id: 'parody', label: '🎶 Nhạc Chế Parody' },
    { id: 'meme', label: '🤪 Meme Bựa' },
    { id: 'challenge', label: '🕺 Challenge' },
    { id: 'lifestyle', label: '⚡ Sống Trẻ' },
  ];

  public get filteredTrends(): GenZTrendItem[] {
    const query = this.searchQuery().toLowerCase().trim();
    const region = this.selectedRegion();
    const platform = this.selectedPlatform();
    const category = this.selectedCategory();

    return this.trendService.trendsSignal().filter((item) => {
      const matchRegion = region === 'all' || item.region === region;
      const matchPlatform = platform === 'all' || item.platform === platform;
      const matchCat = category === 'all' || item.category === category;
      const matchSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.shortSummary.toLowerCase().includes(query) ||
        item.detailContent.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query));

      return matchRegion && matchPlatform && matchCat && matchSearch;
    });
  }

  public setRegion(regionId: string) {
    this.selectedRegion.set(regionId as TrendRegion);
    this.audioService.playClickSound();
  }

  public setPlatform(platformId: string) {
    this.selectedPlatform.set(platformId as TrendPlatform);
    this.audioService.playClickSound();
  }

  public setCategory(catId: string) {
    this.selectedCategory.set(catId as TrendCategory);
    this.audioService.playClickSound();
  }

  public openDetailModal(trend: GenZTrendItem) {
    this.selectedTrend.set(trend);
    this.audioService.playClickSound();
  }

  public closeDetailModal() {
    this.selectedTrend.set(null);
    this.audioService.playClickSound();
  }

  public forceRefreshTrends() {
    this.trendService.forceRefreshTrends();
    this.audioService.playClickSound();
  }



  /**
   * Ultra High Quality TikTok-Style Heart Button Handler ("Nút Thả Tym Cực Xịn")
   */
  public triggerTikTokHeart(event: MouseEvent, trendId: string) {
    event.stopPropagation();
    this.audioService.playClickSound();

    this.trendService.incrementLikeCountOnly(trendId);

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    const heartIcons = ['💖', '❤️', '🔥', '✨', '💘', '💗', '💕', '😍'];
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#06b6d4'];

    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 6; i++) {
      const id = ++this.heartIdCounter;
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 30;

      newHearts.push({
        id,
        x: clickX + offsetX,
        y: clickY + offsetY,
        size: Math.floor(Math.random() * 16) + 20,
        icon: heartIcons[Math.floor(Math.random() * heartIcons.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    this.floatingHearts.update((current) => [...current, ...newHearts]);

    setTimeout(() => {
      const idsToRemove = new Set(newHearts.map((h) => h.id));
      this.floatingHearts.update((current) => current.filter((h) => !idsToRemove.has(h.id)));
    }, 1200);
  }

  public onDoubleTapImage(event: MouseEvent, trendId: string) {
    this.triggerTikTokHeart(event, trendId);
  }

  public onImageError(event: Event, trendId: string): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      const fallbacks = [
        '/access/imgs/trends/capybara.png',
        '/access/imgs/trends/douyin_dance.png',
        '/access/imgs/trends/meme_cat.png',
        '/access/imgs/trends/latam_football.png',
      ];
      let hash = 0;
      for (let i = 0; i < trendId.length; i++) {
        hash = (hash << 5) - hash + trendId.charCodeAt(i);
        hash |= 0;
      }
      target.src = fallbacks[Math.abs(hash) % fallbacks.length];
    }
  }

  public onModalImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/access/imgs/trends/capybara.png';
    }
  }
}
