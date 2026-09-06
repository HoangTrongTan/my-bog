import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrl: './mobile-bottom-nav.component.scss'
})
export class MobileBottomNavComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);

  @Output() openFortune = new EventEmitter<void>();

  public onOpenFortune() {
    this.openFortune.emit();
  }
}
