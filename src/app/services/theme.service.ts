import { Injectable, signal, inject } from '@angular/core';
import { THEME, COLOR_PRESETS, CHARACTER_STYLES, WEATHER_MODES } from '../configs/theme';
import { AudioService } from './audio.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private audioService = inject(AudioService);

  public isDarkMode = signal<boolean>(true);
  public activeColorPreset = signal<string>(COLOR_PRESETS[0].id);
  public activeCharacterStyle = signal<string>(CHARACTER_STYLES[1].id); // default Robot/Tech
  public activeWeatherMode = signal<string>('snow');

  constructor() {
    this.loadSettings();
  }

  public toggleDarkMode() {
    this.isDarkMode.update(prev => !prev);
    this.applyClasses();
  }

  public setColorPreset(presetId: string) {
    this.activeColorPreset.set(presetId);
    this.applyClasses();
  }

  public setCharacterStyle(styleId: string) {
    this.activeCharacterStyle.set(styleId);
    this.audioService.setStyle(styleId);
    this.applyClasses();
  }

  public setWeatherMode(weatherId: string) {
    this.activeWeatherMode.set(weatherId);
    localStorage.setItem('weather_mode', weatherId);
  }

  // Legacy compatibility methods
  public loadTheme() {
    this.loadSettings();
  }

  public getTheme(): string {
    return this.isDarkMode() ? THEME.DARK_MODE : THEME.LIGHT_MODE;
  }

  public setTheme(theme: string) {
    this.isDarkMode.set(theme === THEME.DARK_MODE);
    this.applyClasses();
  }

  public loadSettings() {
    const savedMode = localStorage.getItem('theme') || THEME.DARK_MODE;
    const savedColor = localStorage.getItem('color_preset') || COLOR_PRESETS[0].id;
    const savedCharacter = localStorage.getItem('character_style') || CHARACTER_STYLES[1].id;
    const savedWeather = localStorage.getItem('weather_mode') || 'snow';

    this.isDarkMode.set(savedMode === THEME.DARK_MODE);
    this.activeColorPreset.set(savedColor);
    this.activeCharacterStyle.set(savedCharacter);
    this.activeWeatherMode.set(savedWeather);

    this.audioService.setStyle(savedCharacter);
    this.applyClasses();
  }

  private applyClasses() {
    const body = document.body;
    const root = document.documentElement;
    
    // Remove old classes
    body.classList.remove('dark-mode', 'light-mode');
    COLOR_PRESETS.forEach(p => body.classList.remove(p.id));
    CHARACTER_STYLES.forEach(c => body.classList.remove(c.id));

    // Add current classes
    const modeClass = this.isDarkMode() ? THEME.DARK_MODE : THEME.LIGHT_MODE;
    body.classList.add(modeClass);
    body.classList.add(this.activeColorPreset());
    body.classList.add(this.activeCharacterStyle());
    body.classList.add('custom-cursor-active');

    // Dynamically apply primary & secondary colors to CSS variables for 100% immediate live updates
    const currentPreset = COLOR_PRESETS.find(p => p.id === this.activeColorPreset()) || COLOR_PRESETS[0];
    root.style.setProperty('--accent-color', currentPreset.primary);
    root.style.setProperty('--accent-secondary', currentPreset.secondary);
    root.style.setProperty('--cursor-trail-color', currentPreset.primary);
    root.style.setProperty('--glow-color', `${currentPreset.primary}66`); // 40% opacity hex
    root.style.setProperty('--border-color', `${currentPreset.primary}40`);

    // Save to localStorage
    localStorage.setItem('theme', modeClass);
    localStorage.setItem('color_preset', this.activeColorPreset());
    localStorage.setItem('character_style', this.activeCharacterStyle());
  }
}