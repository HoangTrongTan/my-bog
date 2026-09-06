import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';
import { FortuneService, FortuneRequest, FortuneResponse } from '../../services/fortune.service';

@Component({
  selector: 'app-fortune-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  template: `
    <!-- Backdrop Overlay -->
    <div
      *ngIf="isOpen()"
      class="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      (click)="closeModal()"
    >
      <!-- Main Modal Card (Adapts style based on active character theme) -->
      <div
        class="relative w-full max-w-3xl my-8 p-6 md:p-8 rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden flex flex-col gap-6"
        [ngClass]="modalThemeClass"
        (click)="$event.stopPropagation()"
      >

        <!-- Decorative Theme Emblems -->
        <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-30 bg-theme-accent pointer-events-none"></div>

        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-theme-accent/20 border border-theme-accent flex items-center justify-center text-theme-accent text-2xl shadow-[0_0_15px_var(--glow-color)]">
              <mat-icon class="!w-7 !h-7 !text-2xl">{{ headerIcon }}</mat-icon>
            </div>
            <div>
              <span class="text-xs uppercase font-bold text-theme-accent tracking-widest">{{ themeBadgeTitle }}</span>
              <h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{{ modalTitle }}</h2>
            </div>
          </div>
          <button (click)="closeModal()" class="text-slate-400 hover:text-white p-2 transition-colors">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Input Form Section -->
        <div *ngIf="!response() && !isLoading()" class="flex flex-col gap-5 relative z-10">
          <p class="text-slate-300 text-sm leading-relaxed">
            Nhập thông tin cá nhân của bạn để Trí Tuệ Nhân Tạo (AI Gemini & Thần Số Học) phân tích vận mệnh, con đường sự nghiệp, tình duyên và tính cách đặc trưng.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Full Name -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-300 uppercase tracking-wider">Họ và tên đầy đủ *</label>
              <input
                type="text"
                [(ngModel)]="formData.fullName"
                placeholder="Ví dụ: Hoàng Trọng Tấn"
                class="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/20 text-white placeholder-slate-500 text-sm focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            <!-- Date of Birth -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-300 uppercase tracking-wider">Ngày tháng năm sinh *</label>
              <input
                type="date"
                [(ngModel)]="formData.birthDate"
                class="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/20 text-white text-sm focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            <!-- Birth Time -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-300 uppercase tracking-wider">Giờ sinh (Tùy chọn)</label>
              <input
                type="time"
                [(ngModel)]="formData.birthTime"
                class="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/20 text-white text-sm focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            <!-- Gender -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-300 uppercase tracking-wider">Giới tính</label>
              <select
                [(ngModel)]="formData.gender"
                class="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/20 text-white text-sm focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              >
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
                <option value="khac">Khác</option>
              </select>
            </div>
          </div>

          <!-- Focus Area -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-300 uppercase tracking-wider">Khía cạnh muốn luận giải sâu nhất</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button
                *ngFor="let focus of focusOptions"
                type="button"
                (click)="formData.focusArea = focus.id; audioService.playClickSound()"
                class="p-2.5 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                [ngClass]="{
                  'border-theme-accent bg-theme-accent/25 text-theme-accent shadow-lg': formData.focusArea === focus.id,
                  'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/30': formData.focusArea !== focus.id
                }"
              >
                <span>{{ focus.icon }}</span>
                <span>{{ focus.label }}</span>
              </button>
            </div>
          </div>

          <!-- Action Submit Button -->
          <button
            (click)="submitFortune()"
            [disabled]="!formData.fullName || !formData.birthDate"
            class="mt-2 w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="submitButtonClass"
          >
            <mat-icon class="!w-5 !h-5 !text-lg">auto_awesome</mat-icon>
            <span>Luận Giải Vận Mệnh AI Gemini</span>
          </button>
        </div>

        <!-- Loading State Animation -->
        <div *ngIf="isLoading()" class="flex flex-col items-center justify-center py-12 gap-5 text-center relative z-10">
          <div class="relative w-20 h-20 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-theme-accent/30 border-t-theme-accent animate-spin"></div>
            <mat-icon class="text-4xl text-theme-accent animate-pulse">{{ headerIcon }}</mat-icon>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Đang Quét Dữ Liệu Thần Số Học & Tử Vi...</h3>
            <p class="text-xs text-slate-400 mt-1">Trí tuệ nhân tạo Gemini đang tổng hợp lá số và phân tích triết lý vận mệnh</p>
          </div>
        </div>

        <!-- Result View Section -->
        <div *ngIf="response() && !isLoading()" class="flex flex-col gap-6 relative z-10 max-h-[65vh] overflow-y-auto pr-2">
          
          <!-- Numerology Life Path Banner -->
          <div class="glass-card p-5 !rounded-2xl border border-theme-accent/50 bg-theme-accent/10 flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
              <span class="text-xs uppercase font-bold text-theme-accent tracking-wider">Con Số Chủ Đạo Thần Số Học</span>
              <p class="text-slate-200 text-sm leading-relaxed">{{ response()?.numerologySummary }}</p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-theme-accent text-slate-950 font-black text-3xl flex items-center justify-center shrink-0 shadow-[0_0_20px_var(--glow-color)]">
              #{{ response()?.lifePathNumber }}
            </div>
          </div>

          <!-- Personality Traits -->
          <div class="glass-card p-5 !rounded-2xl border border-white/10 bg-slate-950/60 flex flex-col gap-3">
            <h4 class="text-sm font-bold text-theme-accent uppercase tracking-wider flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-sm">psychology</mat-icon>
              Tính Cách Đặc Trưng & Điểm Mạnh / Yếu
            </h4>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let t of response()?.personality?.traits" class="px-3 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-200">
                ✦ {{ t }}
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-bold text-emerald-400 uppercase">Điểm Mạnh Nổi Bật:</span>
                <ul class="text-xs text-slate-300 flex flex-col gap-1">
                  <li *ngFor="let s of response()?.personality?.strengths">✓ {{ s }}</li>
                </ul>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-bold text-amber-400 uppercase">Điểm Cần Lưu Ý:</span>
                <ul class="text-xs text-slate-300 flex flex-col gap-1">
                  <li *ngFor="let w of response()?.personality?.weaknesses">⚠️ {{ w }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Career & Wealth -->
          <div class="glass-card p-5 !rounded-2xl border border-white/10 bg-slate-950/60 flex flex-col gap-3">
            <h4 class="text-sm font-bold text-theme-accent uppercase tracking-wider flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-sm">work_outline</mat-icon>
              Sự Nghiệp & Con Đường Tài Lộc
            </h4>
            <p class="text-xs text-slate-200 leading-relaxed"><strong class="text-white">Sự nghiệp:</strong> {{ response()?.careerAndWealth?.careerOutlook }}</p>
            <p class="text-xs text-slate-200 leading-relaxed"><strong class="text-white">Tài lộc:</strong> {{ response()?.careerAndWealth?.wealthOutlook }}</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <span *ngFor="let sec of response()?.careerAndWealth?.favorableSectors" class="px-2.5 py-1 rounded-md bg-theme-accent/20 border border-theme-accent/40 text-theme-accent text-xs font-bold">
                💼 {{ sec }}
              </span>
            </div>
          </div>

          <!-- Love & Relationship -->
          <div class="glass-card p-5 !rounded-2xl border border-white/10 bg-slate-950/60 flex flex-col gap-2">
            <h4 class="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-sm">favorite_border</mat-icon>
              Tình Duyên & Mối Quan Hệ
            </h4>
            <p class="text-xs text-slate-200 leading-relaxed">{{ response()?.loveAndRelationships }}</p>
          </div>

          <!-- Destiny Advice & Lucky Elements -->
          <div class="glass-card p-5 !rounded-2xl border border-amber-500/40 bg-amber-500/10 flex flex-col gap-3">
            <h4 class="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <mat-icon class="!w-4 !h-4 !text-sm">auto_stories</mat-icon>
              Lời Khuyên Vận Mệnh & Yếu Tố May Mắn
            </h4>
            <p class="text-xs text-amber-100 italic leading-relaxed">"{{ response()?.destinyAdvice }}"</p>
            <div class="flex flex-wrap gap-4 text-xs text-slate-300 border-t border-white/10 pt-3">
              <div><strong class="text-amber-300">Màu may mắn:</strong> {{ response()?.luckyElements?.luckyColors?.join(', ') }}</div>
              <div><strong class="text-amber-300">Số đại cát:</strong> {{ response()?.luckyElements?.luckyNumbers?.join(', ') }}</div>
              <div><strong class="text-amber-300">Hướng phong thủy:</strong> {{ response()?.luckyElements?.fengShuiDirection }}</div>
            </div>
          </div>

          <!-- Re-try Button -->
          <button
            (click)="response.set(null); audioService.playClickSound()"
            class="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <mat-icon class="!w-4 !h-4 !text-sm">refresh</mat-icon>
            <span>Luận Giải Người Khác / Nhập Lại</span>
          </button>

        </div>

      </div>
    </div>
  `
})
export class FortuneModalComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);
  private fortuneService = inject(FortuneService);

  public isOpen = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public response = signal<FortuneResponse | null>(null);

  public formData: FortuneRequest = {
    fullName: '',
    birthDate: '',
    birthTime: '',
    gender: 'nam',
    focusArea: 'tong-quan'
  };

  public focusOptions: Array<{
    id: 'tong-quan' | 'su-nghiep' | 'tai-loc' | 'tinh-duyen' | 'than-so-hoc';
    label: string;
    icon: string;
  }> = [
    { id: 'tong-quan', label: 'Vận Mệnh Tổng Quan', icon: '🔮' },
    { id: 'su-nghiep', label: 'Sự Nghiệp', icon: '🚀' },
    { id: 'tai-loc', label: 'Tài Lộc & Tiền Bạc', icon: '💰' },
    { id: 'tinh-duyen', label: 'Tình Duyên Gia Đạo', icon: '❤️' },
    { id: 'than-so-hoc', label: 'Thần Số Học', icon: '🔢' }
  ];

  public openModal() {
    this.isOpen.set(true);
    this.audioService.playClickSound();
  }

  public closeModal() {
    this.isOpen.set(false);
    this.audioService.playClickSound();
  }

  public async submitFortune() {
    if (!this.formData.fullName || !this.formData.birthDate) return;
    this.isLoading.set(true);
    this.audioService.playClickSound();

    try {
      const res = await this.fortuneService.generateFortune(this.formData);
      this.response.set(res);
    } catch (err) {
      console.error('Fortune generation error:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Dynamic Modal Classes matching 5 Character Styles
  public get modalThemeClass(): string {
    const style = this.themeService.activeCharacterStyle();
    if (style === 'style-ninja') {
      return 'bg-gradient-to-b from-stone-950 via-slate-950 to-red-950/90 border-2 border-red-600/60 shadow-[0_0_50px_rgba(239,68,68,0.4)]';
    } else if (style === 'style-robot') {
      return 'bg-gradient-to-b from-slate-950 via-cyan-950/80 to-slate-950 border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(6,182,212,0.4)]';
    } else if (style === 'style-quantum') {
      return 'bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950 border-2 border-purple-500/60 shadow-[0_0_50px_rgba(168,85,247,0.4)]';
    } else if (style === 'style-quan-van-truong') {
      return 'bg-gradient-to-b from-emerald-950/90 via-slate-950 to-amber-950/60 border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.4)]';
    } else {
      return 'bg-gradient-to-b from-slate-950 via-pink-950/80 to-purple-950/80 border-2 border-pink-500/60 shadow-[0_0_50px_rgba(236,72,153,0.4)]';
    }
  }

  public get headerIcon(): string {
    const style = this.themeService.activeCharacterStyle();
    if (style === 'style-ninja') return 'visibility_off';
    if (style === 'style-robot') return 'smart_toy';
    if (style === 'style-quantum') return 'code';
    if (style === 'style-quan-van-truong') return 'shield';
    return 'auto_awesome';
  }

  public get themeBadgeTitle(): string {
    const style = this.themeService.activeCharacterStyle();
    if (style === 'style-ninja') return '🥷 THẦN SỐ SHINOBI PHONG THỦY';
    if (style === 'style-robot') return '🤖 CYBER ORACLE HUD SCANNER';
    if (style === 'style-quantum') return '⚡ QUANTUM CODE DESTINY READER';
    if (style === 'style-quan-van-truong') return '🐉 BÁT QUÁI KINH DỊCH VÕ TƯỚNG';
    return '🌌 ASTROLOGY HOROSCOPE ORACLE';
  }

  public get modalTitle(): string {
    return 'Bói Vận Mệnh & Thần Số Học AI';
  }

  public get submitButtonClass(): string {
    const style = this.themeService.activeCharacterStyle();
    if (style === 'style-ninja') return 'bg-red-600 hover:bg-red-500 text-white';
    if (style === 'style-robot') return 'bg-cyan-500 hover:bg-cyan-400 text-slate-950';
    if (style === 'style-quantum') return 'bg-purple-600 hover:bg-purple-500 text-white';
    if (style === 'style-quan-van-truong') return 'bg-emerald-600 hover:bg-emerald-500 text-white';
    return 'bg-pink-600 hover:bg-pink-500 text-white';
  }
}
