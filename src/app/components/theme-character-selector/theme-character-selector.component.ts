import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';
import { COLOR_PRESETS, CHARACTER_STYLES, WEATHER_MODES } from '../../configs/theme';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-theme-character-selector',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <!-- Customization Drawer Panel -->
    <div
      *ngIf="isOpen()"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9995] flex justify-end transition-opacity duration-300"
      (click)="togglePanel()"
    >
      <div
        class="w-full max-w-md h-full bg-slate-955 text-white border-l border-slate-800 p-6 overflow-y-auto flex flex-col gap-6 shadow-2xl"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <mat-icon class="text-theme-accent">auto_awesome</mat-icon>
            <h2 class="text-xl font-bold text-white tracking-wide">Tùy Chỉnh Studio</h2>
          </div>
          <button (click)="togglePanel()" class="text-slate-400 hover:text-white transition-colors">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Section 1: Mode Light/Dark & Sound BGM -->
        <div class="flex flex-col gap-3">
          <label class="text-xs uppercase font-semibold tracking-wider text-slate-400">Giao diện cơ bản & Âm thanh</label>
          <div class="grid grid-cols-2 gap-3">
            <!-- Dark / Light Toggle -->
            <button
              (click)="themeService.toggleDarkMode(); audioService.playClickSound()"
              class="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-900/90 text-white text-sm font-medium hover:border-theme-accent transition-all cursor-pointer"
              [ngClass]="{ 'border-theme-accent bg-theme-accent/20 text-theme-accent font-bold': themeService.isDarkMode() }"
            >
              <mat-icon>{{ themeService.isDarkMode() ? 'dark_mode' : 'light_mode' }}</mat-icon>
              <span>{{ themeService.isDarkMode() ? 'Dark Mode' : 'Light Mode' }}</span>
            </button>

            <!-- Sound BGM Toggle -->
            <button
              (click)="audioService.toggleSound()"
              class="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-900/90 text-white text-sm font-medium hover:border-theme-accent transition-all cursor-pointer"
              [ngClass]="{ 'border-theme-accent bg-theme-accent/20 text-theme-accent font-bold': audioService.soundEnabled() }"
            >
              <mat-icon>{{ audioService.soundEnabled() ? 'volume_up' : 'volume_off' }}</mat-icon>
              <span>{{ audioService.soundEnabled() ? 'Nhạc Nền ON' : 'Nhạc Nền OFF' }}</span>
            </button>
          </div>
        </div>

        <!-- Section 2: 5 Character Style Presets -->
        <div class="flex flex-col gap-3">
          <label class="text-xs uppercase font-semibold tracking-wider text-slate-400">5 Phong Cách Nhân Vật</label>
          <div class="flex flex-col gap-2">
            <button
              *ngFor="let style of characterStyles"
              (click)="themeService.setCharacterStyle(style.id); audioService.playClickSound()"
              class="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/90 text-white hover:scale-[1.02] hover:border-theme-accent transition-all text-left cursor-pointer"
              [ngClass]="{ 'border-theme-accent bg-theme-accent/15 border-2 shadow-[0_0_15px_var(--glow-color)]': themeService.activeCharacterStyle() === style.id }"
            >
              <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-theme-accent shrink-0">
                <mat-icon>{{ style.icon }}</mat-icon>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-sm text-white">{{ style.name }}</span>
                <span class="text-xs text-slate-400">Con trỏ {{ style.cursor }} & Hiệu ứng âm thanh</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Section 3: 5 Custom Color Theme Presets -->
        <div class="flex flex-col gap-3">
          <label class="text-xs uppercase font-semibold tracking-wider text-slate-400">5 Preset Màu Chủ Đạo</label>
          <div class="grid grid-cols-1 gap-2">
            <button
              *ngFor="let color of colorPresets"
              (click)="themeService.setColorPreset(color.id); audioService.playClickSound()"
              class="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 text-white hover:border-theme-accent transition-all cursor-pointer"
              [ngClass]="{ 'border-theme-accent bg-theme-accent/20 ring-2 ring-theme-accent/50': themeService.activeColorPreset() === color.id }"
            >
              <span class="text-sm font-bold text-white">{{ color.name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full border border-white/40 shadow" [style.backgroundColor]="color.primary"></div>
                <div class="w-5 h-5 rounded-full border border-white/40 shadow" [style.backgroundColor]="color.secondary"></div>
              </div>
            </button>
          </div>
        </div>

        <!-- Section 4: Weather Environment Overlay -->
        <div class="flex flex-col gap-3">
          <label class="text-xs uppercase font-semibold tracking-wider text-slate-400">Hiệu Ứng Môi Trường (Weather)</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              *ngFor="let weather of weatherModes"
              (click)="themeService.setWeatherMode(weather.id); audioService.playClickSound()"
              class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-white text-xs font-medium hover:border-theme-accent transition-all cursor-pointer"
              [ngClass]="{ 'border-theme-accent bg-theme-accent/20 text-theme-accent font-bold': themeService.activeWeatherMode() === weather.id }"
            >
              <mat-icon class="!w-5 !h-5 !text-lg text-theme-accent">{{ weather.icon }}</mat-icon>
              <span class="truncate text-white">{{ weather.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ThemeCharacterSelectorComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);

  public isOpen = signal<boolean>(false);

  public colorPresets = COLOR_PRESETS;
  public characterStyles = CHARACTER_STYLES;
  public weatherModes = WEATHER_MODES;

  public togglePanel() {
    this.isOpen.update(prev => !prev);
    this.audioService.playClickSound();
  }

  public openPanel() {
    this.isOpen.set(true);
    this.audioService.playClickSound();
  }
}
