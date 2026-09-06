import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';
import { FortuneService, FortuneRequest, FortuneResponse } from '../../services/fortune.service';

export interface FortuneSlip {
  grade: '🌟 ĐẠI CÁT' | '💫 TRUNG CÁT' | '🌸 TIỂU CÁT' | '🍀 CÁT TƯỜNG';
  hexagram: string;
  poem: string[];
  oracleAdvice: string;
  luckyColors: string[];
  luckyNumbers: number[];
}

@Component({
  selector: 'app-fortune-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './fortune-modal.component.html'
})
export class FortuneModalComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);
  private fortuneService = inject(FortuneService);

  public isOpen = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public activeTab = signal<'draw' | 'numerology'>('draw');

  // Lucky Draw State
  public isShaking = signal<boolean>(false);
  public drawFocus: 'su-nghiep' | 'tai-loc' | 'tinh-duyen' | 'tong-quan' = 'su-nghiep';
  public drawnFortune = signal<FortuneSlip | null>(null);

  // Numerology Form State
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

  public async drawFortuneSlip() {
    if (this.isShaking()) return;

    this.isShaking.set(true);
    this.audioService.playClickSound();
    this.drawnFortune.set(null);

    setTimeout(async () => {
      const req: FortuneRequest = {
        fullName: 'Quý Khách Cát Tường',
        birthDate: '2000-01-01',
        gender: 'nam',
        focusArea: this.drawFocus === 'su-nghiep' ? 'su-nghiep' : this.drawFocus === 'tai-loc' ? 'tai-loc' : 'tong-quan'
      };

      try {
        const res = await this.fortuneService.generateFortune(req);
        this.drawnFortune.set({
          grade: res.lifePathNumber >= 8 ? '🌟 ĐẠI CÁT' : res.lifePathNumber >= 5 ? '💫 TRUNG CÁT' : '🌸 TIỂU CÁT',
          hexagram: `Quẻ Số ${res.lifePathNumber}: Linh Sơ Thần Sổ (Thời Vận Hanh Thông)`,
          poem: [
            'Càn Khôn Vũ Trụ Ngút Trời Mây,',
            'Sự Nghiệp Công Danh Vẫn Vững Dày.',
            'Kiên Trì Khai Lối Rồng Rẽ Sóng,',
            'Cát Tường Như Ý Vượng Lộc Này.'
          ],
          oracleAdvice: res.destinyAdvice || res.numerologySummary,
          luckyColors: res.luckyElements?.luckyColors || ['Cyan', 'Emerald'],
          luckyNumbers: res.luckyElements?.luckyNumbers || [3, 8, 9]
        });
      } catch {
        this.drawnFortune.set({
          grade: '🌟 ĐẠI CÁT',
          hexagram: 'Quẻ Số 08: Càn Vi Thiên (Khai Sơn Lập Địa)',
          poem: [
            'Rồng Vàng Vươn Cánh Vượt Mây Xanh,',
            'Sự Nghiệp Hanh Thông Chí Lớn Thành.',
            'Tài Lộc Đong Đầy Theo Giáp Tý,',
            'Vạn Sự Cát Tường Bình An Nhanh.'
          ],
          oracleAdvice: 'Thời vận hội tụ, quý nhân trợ lực. Hãy tự tin thực hiện các kế hoạch dự án lớn, thành công rực rỡ đang chờ đón bạn.',
          luckyColors: ['Xanh Cyan', 'Vàng Hoàng Kim'],
          luckyNumbers: [6, 8, 9]
        });
      } finally {
        this.isShaking.set(false);
        this.audioService.playClickSound();
      }
    }, 1200);
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

  public get modalThemeClass(): string {
    const style = this.themeService.activeCharacterStyle();
    if (style === 'style-ninja') {
      return 'bg-stone-950 border-2 border-red-600/60 shadow-[0_0_50px_rgba(239,68,68,0.4)]';
    } else if (style === 'style-robot') {
      return 'bg-slate-950 border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(6,182,212,0.4)]';
    } else if (style === 'style-quantum') {
      return 'bg-slate-950 border-2 border-purple-500/60 shadow-[0_0_50px_rgba(168,85,247,0.4)]';
    } else if (style === 'style-quan-van-truong') {
      return 'bg-emerald-950/90 border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.4)]';
    } else if (style === 'style-sports') {
      return 'bg-amber-950/90 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.4)]';
    } else if (style === 'style-horror') {
      return 'bg-neutral-955 border-2 border-red-700/80 shadow-[0_0_60px_rgba(220,38,38,0.5)]';
    } else {
      return 'bg-slate-950 border-2 border-pink-500/60 shadow-[0_0_50px_rgba(236,72,153,0.4)]';
    }
  }

  public get headerIcon(): string {
    return 'wb_twilight';
  }

  public get themeBadgeTitle(): string {
    return '⛩️ CÁT TƯỜNG CẦU QUẺ & TỬ VI';
  }

  public get modalTitle(): string {
    return 'Linh Quẻ Cát Tường & Vận Mệnh';
  }

  public get submitButtonClass(): string {
    return 'bg-accent-gradient text-slate-950 font-bold';
  }
}
