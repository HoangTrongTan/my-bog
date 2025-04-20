import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button-custom',
  imports: [],
  templateUrl: './button-custom.component.html',
  styleUrl: './button-custom.component.scss',
})
export class ButtonCustomComponent {
  text = input<string>('');
  iconLeft = input();
  iconRight = input();
  color = input<'green' | 'red' | 'orange'>();
  small = input<boolean>(false);
  large = input<boolean>(false);

  get getTextArr(){
    return this.text().split('');
  }
}
