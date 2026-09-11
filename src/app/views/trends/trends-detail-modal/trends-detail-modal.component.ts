import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenZTrendItem } from '../../../services/trend.service';

@Component({
  selector: 'app-trends-detail-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './trends-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendsDetailModalComponent {
  public trend          = input.required<GenZTrendItem>();
  public close          = output<void>();
  public tiktokHeart    = output<MouseEvent>();
  public modalImageError = output<Event>();
}
