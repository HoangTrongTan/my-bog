import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DailyMealPlan } from '../../../services/food-ai.service';

@Component({
  selector: 'app-food-wheel-planner-tab',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './food-wheel-planner-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodWheelPlannerTabComponent {
  public weeklyPlan        = input<DailyMealPlan[]>([]);
  public selectedPlannerDay = input<number>(-1);
  public isAiLoading       = input<boolean>(false);

  public daySelected        = output<number>();
  public fetchAiSuggestions = output<void>();
  public copyToClipboard    = output<void>();
}
