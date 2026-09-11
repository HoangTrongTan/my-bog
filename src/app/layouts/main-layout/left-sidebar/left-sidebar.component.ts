import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { IconBarsToggle } from '../../../components/icon-bars-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MENU } from '../../../configs/menu-sidebar';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PATH_CONFIG } from '../../../configs/path';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThemeService } from '../../../services/theme.service';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [
    IconBarsToggle,
    MatTooltipModule,
    MatIconModule,
    RouterLink,
    RouterModule,
    CommonModule,
    FontAwesomeModule,
    DragDropModule
  ],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftSidebarComponent {
  public themeService = inject(ThemeService);
  public audioService = inject(AudioService);

  openMenu = signal<boolean>(false);
  menu = signal([...MENU]);
  faHouseChimney = faHouseChimney;
  path = PATH_CONFIG;

  constructor(private route: Router) {}

  onClick() {
    this.openMenu.update((prev) => !prev);
    this.audioService.playClickSound();
  }

  onBlur() {
    this.openMenu.set(false);
  }

  drop(event: CdkDragDrop<any[]>) {
    const currentMenu = [...this.menu()];
    moveItemInArray(currentMenu, event.previousIndex, event.currentIndex);
    this.menu.set(currentMenu);
    this.audioService.playClickSound();
  }
}
