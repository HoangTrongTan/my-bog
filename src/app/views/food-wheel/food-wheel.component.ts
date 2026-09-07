import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { FoodAiService, FoodItem, DailyMealPlan, PRESET_MENUS } from '../../services/food-ai.service';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-food-wheel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './food-wheel.component.html',
  styleUrl: './food-wheel.component.scss',
})
export class FoodWheelComponent implements OnInit, OnDestroy {
  public weatherService = inject(WeatherService);
  public foodAiService = inject(FoodAiService);
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);

  @ViewChild('wheelCanvas', { static: false }) wheelCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('confettiCanvas', { static: false }) confettiCanvas!: ElementRef<HTMLCanvasElement>;

  public activeTab = signal<'wheel' | 'planner' | 'dishes'>('wheel');
  public presetMenus = PRESET_MENUS;
  public selectedPresetId = signal<string>('ai');

  // 10 Dishes Signal State
  public dishes = signal<FoodItem[]>(PRESET_MENUS[0].dishes);

  // Weekly Meal Plan Signal State
  public weeklyPlan = signal<DailyMealPlan[]>([]);
  public aiEventNote = signal<string>('');

  // Wheel Animation State
  public isSpinning = signal<boolean>(false);
  public winningDish = signal<FoodItem | null>(null);
  public showResultModal = signal<boolean>(false);
  public copiedToast = signal<boolean>(false);

  private currentAngle = 0; // In Radians
  private spinVelocity = 0;
  private animFrameId: number | null = null;
  private lastTickIndex = -1;

  // Particle systems for win fireworks
  private particles: { x: number; y: number; vx: number; vy: number; color: string; radius: number; alpha: number }[] = [];
  private confettiAnimId: number | null = null;

  // Current Character Style Pointer Config
  public characterPointer = computed(() => {
    const style = this.themeService.activeCharacterStyle();
    switch (style) {
      case 'style-ninja':
        return { name: 'Kunai Phong Đao', icon: 'visibility_off', color: '#ec4899' };
      case 'style-robot':
        return { name: 'Laser Mecha', icon: 'smart_toy', color: '#06b6d4' };
      case 'style-quantum':
        return { name: 'Vòng Định Vị Quantum', icon: 'code', color: '#10b981' };
      case 'style-quan-van-truong':
        return { name: 'Thanh Long Đao', icon: 'shield', color: '#eab308' };
      case 'style-cosmic':
        return { name: 'Sao Băng Tinh Vân', icon: 'auto_awesome', color: '#a855f7' };
      case 'style-sports':
        return { name: 'Sét Tốc Độ Dynamic', icon: 'bolt', color: '#f97316' };
      case 'style-horror':
        return { name: 'Lưỡi Hái Tử Thần', icon: 'skull', color: '#ef4444' };
      default:
        return { name: 'Kim Chỉ Món Ngon', icon: 'navigation', color: '#3b82f6' };
    }
  });

  ngOnInit(): void {
    // Generate initial AI food suggestions & weekly plan based on current weather
    this.fetchAiSuggestions();
  }

  ngOnDestroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.drawWheel(), 100);
  }

  /**
   * Fetch AI suggestions based on weather and date
   */
  public async fetchAiSuggestions(): Promise<void> {
    const weather = this.weatherService.weatherSignal();
    const res = await this.foodAiService.generateAiFoodSuggestions(weather);
    if (res) {
      this.dishes.set(res.dishes);
      this.weeklyPlan.set(res.weeklyPlan);
      this.aiEventNote.set(res.aiEventNote);
      this.drawWheel();
    }
  }

  /**
   * Refresh weather data
   */
  public async refreshWeather(): Promise<void> {
    await this.weatherService.fetchWeather();
    await this.fetchAiSuggestions();
  }

  /**
   * Load Preset Menu
   */
  public loadPreset(presetId: string): void {
    this.selectedPresetId.set(presetId);
    this.audioService.playClickSound();

    if (presetId === 'ai') {
      this.fetchAiSuggestions();
      return;
    }

    const found = PRESET_MENUS.find((p) => p.id === presetId);
    if (found) {
      this.dishes.set([...found.dishes]);
      this.drawWheel();
    }
  }

  /**
   * Update dish item at index
   */
  public updateDish(index: number, field: keyof FoodItem, value: any): void {
    const list = [...this.dishes()];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      this.dishes.set(list);
      this.drawWheel();
    }
  }

  /**
   * Spin Lucky Wheel Physics Engine
   */
  public spinWheel(): void {
    if (this.isSpinning()) return;
    const currentDishes = this.dishes();
    if (!currentDishes || currentDishes.length === 0) return;

    this.isSpinning.set(true);
    this.showResultModal.set(false);
    this.winningDish.set(null);
    this.audioService.playClickSound();

    // Initial spin speed (radians per frame): 0.35 to 0.55 rad/frame (~ 20-30 RPM)
    this.spinVelocity = Math.random() * 0.2 + 0.35;
    this.lastTickIndex = -1;

    let totalDecelerationDuration = Math.random() * 2000 + 3500; // 3.5s - 5.5s
    let startTime = performance.now();

    const animate = (now: number) => {
      let elapsed = now - startTime;
      let progress = Math.min(elapsed / totalDecelerationDuration, 1);

      // Ease out cubic deceleration factor
      let friction = 1 - Math.pow(progress, 3);
      let currentSpeed = this.spinVelocity * friction;

      this.currentAngle += currentSpeed;
      this.drawWheel();

      // Check tick sound on slice crossing
      const sliceAngle = (2 * Math.PI) / currentDishes.length;
      // Pointer is located at TOP (3PI/2 or 270 deg)
      const normalizedAngle = (2 * Math.PI - (this.currentAngle % (2 * Math.PI))) % (2 * Math.PI);
      const activeSliceIndex = Math.floor(normalizedAngle / sliceAngle);

      if (activeSliceIndex !== this.lastTickIndex) {
        this.lastTickIndex = activeSliceIndex;
        this.audioService.playWheelTickSound();
      }

      if (progress < 1 && currentSpeed > 0.002) {
        this.animFrameId = requestAnimationFrame(animate);
      } else {
        // Wheel stopped! Determine winner
        this.isSpinning.set(false);
        const winner = currentDishes[activeSliceIndex % currentDishes.length];
        this.winningDish.set(winner);
        this.showResultModal.set(true);
        this.audioService.playWinFanfareSound();
        this.launchConfetti();
      }
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  /**
   * Draw Wheel on HTML5 Canvas
   */
  public drawWheel(): void {
    if (!this.wheelCanvas) return;
    const canvas = this.wheelCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const outerRadius = size / 2 - 15;
    const innerRadius = 35;
    const list = this.dishes();
    const count = list.length;
    if (count === 0) return;

    ctx.clearRect(0, 0, size, size);

    const sliceAngle = (2 * Math.PI) / count;

    // 1. Draw Outer Glow Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, outerRadius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = this.characterPointer().color;
    ctx.lineWidth = 6;
    ctx.shadowColor = this.characterPointer().color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // 2. Draw Slices
    for (let i = 0; i < count; i++) {
      const item = list[i];
      const startAngle = this.currentAngle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, outerRadius, startAngle, endAngle);
      ctx.closePath();

      // Gradient Fill for Premium Aesthetic
      const midAngle = startAngle + sliceAngle / 2;
      const gradX = center + Math.cos(midAngle) * outerRadius;
      const gradY = center + Math.sin(midAngle) * outerRadius;
      const grad = ctx.createLinearGradient(center, center, gradX, gradY);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(0.4, item.color || '#3b82f6');
      grad.addColorStop(1, this.adjustBrightness(item.color || '#3b82f6', -30));

      ctx.fillStyle = grad;
      ctx.fill();

      // Slice Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Dish Text + Emoji
      ctx.translate(center, center);
      ctx.rotate(midAngle);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;

      // Truncate long dish name
      const maxTextLen = 14;
      const displayName = item.name.length > maxTextLen ? item.name.substring(0, maxTextLen) + '...' : item.name;
      ctx.fillText(`${item.emoji || '🍲'} ${displayName}`, outerRadius - 20, 5);

      ctx.restore();
    }

    // 3. Draw Center Hub Cap
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(center, center, 5, center, center, innerRadius);
    hubGrad.addColorStop(0, '#ffffff');
    hubGrad.addColorStop(0.7, '#0f172a');
    hubGrad.addColorStop(1, '#020617');
    ctx.fillStyle = hubGrad;
    ctx.shadowColor = this.characterPointer().color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.strokeStyle = this.characterPointer().color;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center Emoji or Icon
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '20px sans-serif';
    ctx.fillText('🍱', center, center);
    ctx.restore();
  }

  /**
   * Confetti Celebration FX
   */
  private launchConfetti(): void {
    if (!this.confettiCanvas) return;
    const canvas = this.confettiCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#38bdf8'];
    this.particles = [];

    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 5 + 3,
        alpha: 1,
      });
    }

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (let p of this.particles) {
        if (p.alpha <= 0) continue;
        aliveCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha -= 0.015;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }

      if (aliveCount > 0) {
        this.confettiAnimId = requestAnimationFrame(renderParticles);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);
    this.confettiAnimId = requestAnimationFrame(renderParticles);
  }

  /**
   * Apply winning dish to Today's Meal Plan
   */
  public applyWinningToToday(): void {
    const winner = this.winningDish();
    if (!winner) return;

    const plan = [...this.weeklyPlan()];
    if (plan.length > 0) {
      // Apply to Monday / first day dinner
      plan[0] = { ...plan[0], dinner: `${winner.emoji} ${winner.name}` };
      this.weeklyPlan.set(plan);
    }

    this.showResultModal.set(false);
    this.activeTab.set('planner');
    this.showCopiedToast('Đã thêm món thắng cuộc vào Thực Đơn Hôm Nay!');
  }

  /**
   * Copy Weekly Meal Plan to Clipboard
   */
  public copyWeeklyPlanToClipboard(): void {
    const plan = this.weeklyPlan();
    if (plan.length === 0) return;

    const weather = this.weatherService.weatherSignal();
    let text = `🍱 THỰC ĐƠN TUẦN THÔNG MINH AI (${weather.locationName} - ${weather.temperature}°C - ${weather.conditionText})\n`;
    text += `--------------------------------------------------\n`;

    plan.forEach((d) => {
      text += `📅 ${d.dayName} (${d.dateStr}):\n`;
      text += `  🌅 Sáng: ${d.breakfast}\n`;
      text += `  ☀️ Trưa: ${d.lunch}\n`;
      text += `  🌙 Tối: ${d.dinner}\n`;
      text += `  🍡 Ăn vặt: ${d.snack}\n`;
      text += `  💡 Tip: ${d.healthTip}\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      this.showCopiedToast('Đã sao chép Thực Đơn Tuần vào bộ nhớ tạm!');
    });
  }

  /**
   * Helper to show temporary toast
   */
  public showCopiedToast(msg?: string): void {
    this.copiedToast.set(true);
    setTimeout(() => this.copiedToast.set(false), 2500);
  }

  /**
   * Color brightness helper
   */
  private adjustBrightness(hex: string, percent: number): string {
    let num = parseInt(hex.replace('#', ''), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;

    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}
