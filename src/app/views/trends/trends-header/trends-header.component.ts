import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trends-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './trends-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendsHeaderComponent {
  public lastCacheTime    = input<string>('');
  public forceRefresh     = output<void>();
}
