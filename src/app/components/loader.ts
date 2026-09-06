import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'loader',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex items-center justify-center p-8">
      
      <!-- 🥷 Style 1: Ninja / Shadow Shinobi Shuriken Loader -->
      <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-ninja'">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-20 h-20 flex items-center justify-center animate-spin">
            <svg class="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-red-600/60 animate-ping"></div>
          </div>
          <span class="text-xs font-black tracking-widest text-red-500 uppercase animate-pulse">🥷 SHINOBI SHADOW SCANNING...</span>
        </div>
      </ng-container>

      <!-- 🤖 Style 2: Robot / Sci-Fi Mecha HUD Radar Scanner Loader -->
      <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-robot'">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-20 h-20 rounded-full border-2 border-cyan-500/40 p-1 flex items-center justify-center drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
            <div class="w-full h-full rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <div class="absolute w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
            <mat-icon class="absolute text-cyan-400 !w-8 !h-8 !text-3xl">smart_toy</mat-icon>
          </div>
          <span class="text-xs font-black tracking-widest text-cyan-400 uppercase animate-pulse">🤖 MECHA SYSTEM LOADING...</span>
        </div>
      </ng-container>

      <!-- ⚡ Style 3: High-Tech / Quantum Code Matrix Loader -->
      <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-quantum'">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-20 h-20 flex items-center justify-center">
            <div class="w-14 h-14 rotate-45 border-2 border-purple-500 bg-purple-500/10 animate-spin flex items-center justify-center drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              <div class="w-6 h-6 border-2 border-cyan-400 rotate-45"></div>
            </div>
            <mat-icon class="absolute text-purple-400 !w-6 !h-6 !text-2xl animate-pulse">code</mat-icon>
          </div>
          <span class="text-xs font-black tracking-widest text-purple-400 uppercase animate-pulse">⚡ QUANTUM CODE INITIALIZING...</span>
        </div>
      </ng-container>

      <!-- 🐉 Style 4: Quan Vân Trường / Guan Yu Dragon Blade Loader -->
      <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-quan-van-truong'">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-20 h-20 rounded-full border-2 border-emerald-500/50 p-2 flex items-center justify-center drop-shadow-[0_0_25px_rgba(16,185,129,0.9)]">
            <div class="w-full h-full rounded-full border-4 border-emerald-400 border-b-amber-400 animate-spin"></div>
            <mat-icon class="absolute text-emerald-400 !w-8 !h-8 !text-3xl">shield</mat-icon>
          </div>
          <span class="text-xs font-black tracking-widest text-emerald-400 uppercase animate-pulse">🐉 BÁT QUÁI LONG VŨ Đang Quét...</span>
        </div>
      </ng-container>

      <!-- 🌌 Style 5: Cosmic / Galaxy Stardust Portal Loader -->
      <ng-container *ngIf="themeService.activeCharacterStyle() === 'style-cosmic'">
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-20 h-20 rounded-full border-2 border-dashed border-pink-500 animate-spin flex items-center justify-center drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
            <div class="w-12 h-12 rounded-full border-2 border-violet-400 border-t-pink-500 animate-spin"></div>
            <mat-icon class="absolute text-pink-400 !w-6 !h-6 !text-2xl">auto_awesome</mat-icon>
          </div>
          <span class="text-xs font-black tracking-widest text-pink-400 uppercase animate-pulse">🌌 COSMIC STARDUST LOADING...</span>
        </div>
      </ng-container>

    </div>
  `
})
export class LoaderComponent {
  public themeService = inject(ThemeService);
}
