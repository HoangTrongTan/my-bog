import { Injectable } from "@angular/core";
import { THEME } from "../configs/theme";

@Injectable({ providedIn: 'root' })
export class ThemeService {

  setTheme(theme: string) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }

  getTheme(): string {
    return localStorage.getItem('theme') || THEME.LIGHT_MODE;
  }

  loadTheme() {
    const theme = localStorage.getItem('theme') || THEME.LIGHT_MODE;
    document.body.className = theme;
  }
}