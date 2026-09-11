import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { LoaderComponent } from './components/loader';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { AudioService } from './services/audio.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, CommonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = signal<boolean>(false);
  public audioService = inject(AudioService);

  // --- THEME EFFECTS ENGINE (GLOBAL) ---
  public activeThemeEffects = signal<{ id: number; type: string; style: Record<string, string> }[]>([]);
  private themeEffectIntervalId: ReturnType<typeof setInterval> | undefined;
  private effectCounter = 0;

  constructor(
    private router: Router,
    private themeService: ThemeService
    ) {
  }

  ngOnInit(): void {
    this.themeService.loadTheme();
    // Loader now tracks real navigation lifecycle (start -> end/cancel/error)
    // instead of a fixed 1.3s timeout that delayed every route change regardless of actual load time.
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationStart | NavigationEnd | NavigationCancel | NavigationError =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe((event) => {
        this.isLoading.set(event instanceof NavigationStart);
      });

    this.startGlobalThemeEffectsEngine();
  }

  ngOnDestroy(): void {
    if (this.themeEffectIntervalId) clearInterval(this.themeEffectIntervalId);
  }

  private startGlobalThemeEffectsEngine(): void {
    if (typeof window === 'undefined') return;
    this.themeEffectIntervalId = setInterval(() => {
      // 40% chance to skip
      if (Math.random() < 0.4) return; 
      
      const theme = this.themeService.activeCharacterStyle();
      if (['style-ninja', 'style-horror', 'style-quan-van-truong', 'style-robot'].includes(theme)) {
        this.triggerEffect(theme);
      }
    }, 4500);
  }

  private triggerEffect(theme: string): void {
    const id = ++this.effectCounter;
    const effectObj: { id: number; type: string; style: Record<string, string> } = { id, type: theme, style: {} };

    if (theme === 'style-ninja') {
      const startX = Math.random() > 0.5 ? -100 : window.innerWidth + 100;
      const startY = Math.random() * window.innerHeight;
      const endX = startX < 0 ? window.innerWidth + 100 : -100;
      const endY = Math.random() * window.innerHeight;
      
      effectObj.style = {
        '--startX': `${startX}px`,
        '--startY': `${startY}px`,
        '--endX': `${endX}px`,
        '--endY': `${endY}px`,
      };
      this.audioService.playNinjaDartSound();
      
    } else if (theme === 'style-horror') {
      effectObj.style = {
        top: `${Math.random() * 60 + 10}%`,
        left: `${Math.random() * 60 + 10}%`,
      };
      this.audioService.playGhostJumpscareSound();
      
    } else if (theme === 'style-quan-van-truong') {
      effectObj.style = {
        transform: `rotate(${Math.random() * 360}deg)`,
        top: `${Math.random() * 60 + 20}%`,
      };
      this.audioService.playSlashSound();
      
    } else if (theme === 'style-robot') {
      effectObj.style = {
        top: `${Math.random() * 70 + 10}%`,
        left: `${Math.random() * 70 + 10}%`,
      };
      this.audioService.playRobotBeepSound();
    }

    this.activeThemeEffects.update(arr => [...arr, effectObj]);
    
    setTimeout(() => {
      this.activeThemeEffects.update(arr => arr.filter(e => e.id !== id));
    }, 1500);
  }
}
