import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { THEME } from '../../configs/theme';

@Component({
  selector: 'toggle-theme',
  imports: [],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.scss',
})
export class ToggleThemeComponent implements OnInit {
  @Input() isActive?: boolean = false;
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    const currentTheme = this.themeService.getTheme();
    this.isActive = currentTheme === THEME.LIGHT_MODE;
  }

  toggleTheme() {
    this.themeService.setTheme(this.isActive ? THEME.LIGHT_MODE : THEME.DARK_MODE);
  }
  onToggle() {
    this.isActive = !this.isActive;
    this.toggleTheme();
  }
}
