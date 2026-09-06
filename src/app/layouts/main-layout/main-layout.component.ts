import {
  Component,
  signal,
  ViewChild
} from '@angular/core';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderResponsiveComponent } from './header-responsive/header-responsive.component';
import { CommonModule } from '@angular/common';
import { MENU } from '../../configs/menu-sidebar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ParticleWeatherComponent } from '../../components/particle-weather/particle-weather.component';
import { CustomCursorComponent } from '../../components/custom-cursor/custom-cursor.component';
import { ThemeCharacterSelectorComponent } from '../../components/theme-character-selector/theme-character-selector.component';
import { FortuneModalComponent } from '../../components/fortune-modal/fortune-modal.component';
import { MobileBottomNavComponent } from '../../components/mobile-bottom-nav/mobile-bottom-nav.component';
import { TodoListModalComponent } from '../../components/todo-list-modal/todo-list-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RightSidebarComponent,
    LeftSidebarComponent,
    HeaderResponsiveComponent,
    CommonModule,
    RouterLink,
    RouterModule,
    MatTooltipModule,
    MatIconModule,
    ParticleWeatherComponent,
    CustomCursorComponent,
    ThemeCharacterSelectorComponent,
    FortuneModalComponent,
    MobileBottomNavComponent,
    TodoListModalComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  @ViewChild('fortuneModal') fortuneModal!: FortuneModalComponent;
  @ViewChild('studioSelector') studioSelector!: ThemeCharacterSelectorComponent;
  @ViewChild('todoModal') todoModal!: TodoListModalComponent;

  openMenu = signal<boolean>(false);
  menu = signal(MENU);

  clickMenuOpen(status: boolean) {
    this.openMenu.set(status);
  }

  openFortuneModal() {
    if (this.fortuneModal) {
      this.fortuneModal.openModal();
    }
  }

  openStudioSelector() {
    if (this.studioSelector) {
      this.studioSelector.openPanel();
    }
  }

  openTodoListModal() {
    if (this.todoModal) {
      this.todoModal.openModal();
    }
  }
}
