import { Component, OnInit, input, output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TRelatedProjectItem, TSkill } from '../skills.type';

@Component({
  selector: 'app-skill-item',
  imports: [MatProgressBarModule, MatRippleModule],
  templateUrl: './skill-item.component.html',
  styleUrl: './skill-item.component.scss',
})
export class SkillItemComponent implements OnInit {
  count = 0;
  item = input<TSkill | undefined>();
  outputEvent = output<TRelatedProjectItem[] | undefined>();

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

  onClick(value: TRelatedProjectItem[] | undefined) {
    this.outputEvent.emit(value);
  }
}
