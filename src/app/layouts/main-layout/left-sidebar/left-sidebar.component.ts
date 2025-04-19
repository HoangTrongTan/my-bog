import { Component, signal } from '@angular/core';
import { IconBarsToggle } from '../../../components/icon-bars-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MENU } from '../../../configs/menu-sidebar';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PATH_CONFIG } from '../../../configs/path';

@Component({
  selector: 'app-left-sidebar',
  imports: [
    IconBarsToggle,
    MatTooltipModule,
    MatIconModule,
    RouterLink,
    RouterModule,
    CommonModule,
    FontAwesomeModule
  ],
  standalone: true,
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss',
})
export class LeftSidebarComponent {
  openMenu = signal<boolean>(false);
  menu = signal(MENU);
  faHouseChimney = faHouseChimney
  path = PATH_CONFIG
  constructor(private route: Router) {}

  onClick() {
    this.openMenu.update((prev) => !prev);
  }
  
  onBlur(){
    this.openMenu.set(false);
  }
}
