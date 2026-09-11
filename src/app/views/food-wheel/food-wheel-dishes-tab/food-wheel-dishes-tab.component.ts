import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FoodItem, PresetMenu } from '../../../services/food-ai.service';

export interface DishUpdateEvent {
  index: number;
  field: keyof FoodItem;
  value: FoodItem[keyof FoodItem];
}

@Component({
  selector: 'app-food-wheel-dishes-tab',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './food-wheel-dishes-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodWheelDishesTabComponent {
  public dishes          = input<FoodItem[]>([]);
  public presetMenus     = input<PresetMenu[]>([]);
  public selectedPresetId = input<string>('ai');

  public loadPreset      = output<string>();
  public updateDish      = output<DishUpdateEvent>();
  public randomizeDishes = output<void>();
  public save            = output<void>();

  public onUpdate<K extends keyof FoodItem>(index: number, field: K, value: FoodItem[K]): void {
    this.updateDish.emit({ index, field, value });
  }
}
