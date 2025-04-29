import { Component, OnInit, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkillServiceService } from '../skill-service.service';
import { TRelatedProjectItem } from '../skills.type';

@Component({
  selector: 'app-skill-item',
  imports: [MatProgressBarModule, MatRippleModule],
  templateUrl: './skill-item.component.html',
  styleUrl: './skill-item.component.scss',
})
export class SkillItemComponent implements OnInit {
  count = 0;
  item = input<
    | {
        type: string;
        img: string;
        relatedProject?: TRelatedProjectItem[];
        percent: number;
      }
    | undefined
  >();

  constructor(private skillService: SkillServiceService) {}

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

  onSetRelatedProjectClick(relatedProject: TRelatedProjectItem[] | undefined) {
    this.skillService.setRelatedProject(relatedProject);
  }
}
