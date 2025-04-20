import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderResponsiveComponent } from './header-responsive/header-responsive.component';
import { CommonModule } from '@angular/common';
import { MENU } from '../../configs/menu-sidebar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  openMenu = signal<boolean>(false);
  menu = signal(MENU);
  clickMenuOpen(status: boolean) {
    this.openMenu.set(status);
  }
}
