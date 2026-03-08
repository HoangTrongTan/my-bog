import { Component, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { THEME } from '../../configs/theme';

@Component({
  selector: 'toggle-theme',
  imports: [],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.scss',
})
export class ToggleThemeComponent {
  @Input() isActive?: boolean = false;
  constructor(private themeService: ThemeService) {}
  toggleTheme() {
    this.themeService.setTheme(this.isActive ? THEME.LIGHT_MODE : THEME.DARK_MODE);
  }
  onToggle() {
    this.isActive = !this.isActive;
    this.toggleTheme();
  }
}
