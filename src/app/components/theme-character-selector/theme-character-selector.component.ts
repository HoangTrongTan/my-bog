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
  templateUrl: './theme-character-selector.component.html'
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
