import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'icon-bar-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="toggle" [ngClass]="{ touched: active }" (click)="onClick()">
      <div class="bars" id="bar1"></div>
      <div class="bars" id="bar2"></div>
      <div class="bars" id="bar3"></div>
    </label>
  `,
  styles: [
    `
      .toggle {
        position: relative;
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        transition-duration: 0.5s;
      }

      .bars {
        width: 100%;
        height: 2px;
        background-color: var(--text-light-in-button);
        border-radius: 4px;
      }

      #bar2 {
        transition-duration: 0.8s;
      }

      #bar1,
      #bar3 {
        width: 70%;
      }

      .touched .bars {
        position: absolute;
        transition-duration: 0.5s;
      }

      .touched #bar2 {
        transform: scaleX(0);
        transition-duration: 0.5s;
      }

      .touched #bar1 {
        width: 80%;
        transform: rotate(45deg);
        transition-duration: 0.5s;
      }

      .touched #bar3 {
        width: 80%;
        transform: rotate(-45deg);
        transition-duration: 0.5s;
      }

      .touched {
        transition-duration: 0.5s;
        transform: rotate(180deg);
      }
    `,
  ],
})
export class IconBarsToggle {
  @Input() active = false;

  @Output() toggle = new EventEmitter();

  onClick(){
    this.toggle.emit();
  }
}
