import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';
import { PATH_CONFIG } from '../../configs/path';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrl: './mobile-bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomNavComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);

  // Deliberately a curated subset (not the full MENU list) so the thumb-reachable
  // dock stays to 4 destinations + the Fortune action; paths still come from
  // PATH_CONFIG so a route rename here can't silently drift from app.routes.ts.
  public path = PATH_CONFIG;

  @Output() openFortune = new EventEmitter<void>();

  public onOpenFortune() {
    this.openFortune.emit();
  }
}
