import { Component, input } from '@angular/core';

type ButtonSizeConfig = {
  fontSize?: string;
  padding?: string;
  roundBorder?: string;
  borderSize?: string;
  spanPd?: string;
};

export const BUTTON_SIZES: Record<'sm' | 'md' | 'lg', ButtonSizeConfig> = {
  sm: {
    fontSize: '12px',
    padding: '6px 12px',
    roundBorder: '4px',
    borderSize: '1px',
    spanPd: '0px 1.5px',
  },
  md: {
    fontSize: '16px',
    padding: '10px 20px',
    roundBorder: '6px',
    borderSize: '2px',
  },
  lg: {
    fontSize: '20px',
    padding: '14px 28px',
    roundBorder: '8px',
    borderSize: '3px',
  }
}

@Component({
  selector: 'app-button-custom',
  imports: [],
  standalone: true,
  templateUrl: './button-custom.component.html',
  styleUrl: './button-custom.component.scss',
})
export class ButtonCustomComponent {
  text = input<string>('');
  iconLeft = input();
  iconRight = input();
  color = input<'green' | 'red' | 'orange'>();
  small = input<boolean>(false);
  customeSize = input<'sm' | 'md' | 'lg'>('md');
  large = input<boolean>(false);

  get getTextArr() {
    return this.text().split('');
  }

  get SlsBtn() {
    return BUTTON_SIZES[this.customeSize()];
  }
}
