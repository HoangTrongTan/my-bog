import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ToggleThemeComponent } from '../../../components/toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-right-sidebar',
  imports: [NgxImageZoomModule, MatMenuModule, ToggleThemeComponent],
  standalone: true,
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {}
