import { Component, OnInit, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sumary-item',
  imports: [MatProgressSpinnerModule],
  templateUrl: './sumary-item.component.html',
  styleUrl: './sumary-item.component.scss',
})
export class SumaryItemComponent implements OnInit {
  count = 0;
  item = input<{ title: string; percent: number }>();

  ngOnInit(): void {
    setTimeout(() => {
      const intervalCount = setInterval(() => {
        this.count += 1;
        if (this.count === this.item()?.percent) {
          clearInterval(intervalCount);
        }
      }, 70);
    }, 80);
  }
}
