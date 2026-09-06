import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed pointer-events-none z-[100000] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
      [style.left.px]="cursorX()"
      [style.top.px]="cursorY()"
    >
      <!-- Cursor Dot / Ring Base -->
      <div 
        class="relative flex items-center justify-center transition-all duration-200 pointer-events-none"
        [ngClass]="{ 'scale-150': isHovered(), 'scale-100': !isHovered() }"
      >
        <!-- Ninja Kunai Style -->
        <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-ninja'">
          <div class="relative w-8 h-8 flex items-center justify-center drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] pointer-events-none">
            <svg class="w-7 h-7 text-red-500 transform -rotate-45" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15 9L13 11L13 18L11 18L11 11L9 9L12 2Z"/>
              <circle cx="12" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </ng-container>

        <!-- Robot Laser Crosshair Style -->
        <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-robot'">
          <div class="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center animate-spin-slow drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] pointer-events-none">
            <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
            <div class="absolute -top-1 w-0.5 h-2 bg-cyan-400"></div>
            <div class="absolute -bottom-1 w-0.5 h-2 bg-cyan-400"></div>
            <div class="absolute -left-1 h-0.5 w-2 bg-cyan-400"></div>
            <div class="absolute -right-1 h-0.5 w-2 bg-cyan-400"></div>
          </div>
        </ng-container>

        <!-- Quantum Hologram Style -->
        <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-quantum'">
          <div class="w-7 h-7 rotate-45 border-2 border-purple-500 bg-purple-500/20 flex items-center justify-center drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] pointer-events-none">
            <div class="w-2 h-2 bg-purple-400 rotate-45 animate-ping"></div>
          </div>
        </ng-container>

        <!-- Quan Van Truong Dragon Blade Style -->
        <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-quan-van-truong'">
          <div class="relative w-8 h-8 flex items-center justify-center drop-shadow-[0_0_12px_rgba(16,185,129,0.9)] pointer-events-none">
            <svg class="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 15 5 15 9C15 12 13 14 13 22H11C11 14 9 12 9 9C9 5 12 2 12 2Z" />
              <path d="M7 10L17 10" stroke="#f59e0b" stroke-width="2"/>
            </svg>
          </div>
        </ng-container>

        <!-- Cosmic Galaxy Style -->
        <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-cosmic'">
          <div class="w-8 h-8 rounded-full border-2 border-dashed border-pink-500 animate-spin flex items-center justify-center drop-shadow-[0_0_12px_rgba(236,72,153,0.8)] pointer-events-none">
            <div class="w-2.5 h-2.5 rounded-full bg-pink-400"></div>
          </div>
        </ng-container>

        <!-- Dynamic Glow Halo -->
        <div class="absolute inset-0 rounded-full bg-theme-accent/20 blur-md -z-10 transform scale-150 pointer-events-none"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      pointer-events: none !important;
    }
  `]
})
export class CustomCursorComponent implements OnInit {
  public themeService = inject(ThemeService);

  public cursorX = signal<number>(-100);
  public cursorY = signal<number>(-100);
  public isHovered = signal<boolean>(false);

  private targetX = -100;
  private targetY = -100;
  private animId: number = 0;

  ngOnInit() {
    this.smoothCursorLoop();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.targetX = e.clientX;
    this.targetY = e.clientY;

    const targetEl = e.target as HTMLElement;
    if (targetEl) {
      const isInteractive = !!targetEl.closest('button, a, input, select, textarea, .glass-card, [cdkDrag], [routerLink]');
      this.isHovered.set(isInteractive);
    }
  }

  private smoothCursorLoop = () => {
    // Lerp smooth movement
    const currentX = this.cursorX();
    const currentY = this.cursorY();

    const nextX = currentX + (this.targetX - currentX) * 0.35;
    const nextY = currentY + (this.targetY - currentY) * 0.35;

    this.cursorX.set(nextX);
    this.cursorY.set(nextY);

    this.animId = requestAnimationFrame(this.smoothCursorLoop);
  };
}
