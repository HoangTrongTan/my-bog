import { Component } from '@angular/core';
import { IconBarsToggle } from '../../../components/icon-bars-toggle';
import { NgxImageZoomComponent, NgxImageZoomModule } from 'ngx-image-zoom';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-right-sidebar',
  imports: [NgxImageZoomModule],
  standalone: true,
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {}
