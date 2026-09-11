import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TrendCategory, TrendPlatform, TrendRegion } from '../../../services/trend.service';

export interface FilterOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-trends-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './trends-filter-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendsFilterBarComponent {
  public regions          = input<FilterOption[]>([]);
  public platforms        = input<FilterOption[]>([]);
  public selectedRegion   = input<TrendRegion>('all');
  public selectedPlatform = input<TrendPlatform>('all');
  public searchQuery      = input<string>('');
  public totalCount       = input<number>(0);

  public regionChange      = output<string>();
  public platformChange    = output<string>();
  public searchQueryChange = output<string>();
}
