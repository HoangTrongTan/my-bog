import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FoodItem } from '../../../services/food-ai.service';

@Component({
  selector: 'app-food-wheel-result-modal',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './food-wheel-result-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodWheelResultModalComponent {
  public winningDish  = input.required<FoodItem>();
  public close        = output<void>();
  public applyToToday = output<void>();
}
