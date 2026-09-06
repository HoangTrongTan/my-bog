import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AudioService } from '../../../services/audio.service';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-sidebar',
  imports: [CommonModule, NgxImageZoomModule, MatMenuModule, MatIconModule, MatTooltipModule],
  standalone: true,
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {
  public audioService = inject(AudioService);
  public themeService = inject(ThemeService);

  @Output() openFortune = new EventEmitter<void>();
  @Output() openStudio = new EventEmitter<void>();
  @Output() openTodoList = new EventEmitter<void>();

  public onFortuneClick() {
    this.openFortune.emit();
    this.audioService.playClickSound();
  }

  public onStudioClick() {
    this.openStudio.emit();
    this.audioService.playClickSound();
  }

  public onTodoListClick() {
    this.openTodoList.emit();
    this.audioService.playClickSound();
  }
}
