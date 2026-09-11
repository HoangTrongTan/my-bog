import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WeatherData } from '../../../services/weather.service';

export interface CharacterPointer {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-food-wheel-header',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './food-wheel-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodWheelHeaderComponent {
  public aiEventNote   = input<string>('');
  public characterPointer = input.required<CharacterPointer>();
  public weather       = input.required<WeatherData>();
  public isAiLoading   = input<boolean>(false);

  public refreshWeather     = output<void>();
  public fetchAiSuggestions = output<void>();
}
