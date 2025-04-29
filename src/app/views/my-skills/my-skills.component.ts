import { Component, OnInit, effect } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import Skills from '../../data/my-skill/skill.json';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Application } from '@splinetool/runtime';
import {
  faArrowsToCircle,
  faBookAtlas,
  faPeopleGroup,
  faSquareShareNodes,
  faPenToSquare,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { listAnimation } from '../../common/listAnimation';
import { SkillItemComponent } from './skill-item/skill-item.component';
import { SkillServiceService } from './skill-service.service';

@Component({
  selector: 'app-my-skills',
  imports: [
    MatExpansionModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
    SkillItemComponent,
  ],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss',
  providers: [SkillServiceService],
  animations: [listAnimation],
})
// https://app.spline.design/file/4581af86-fad5-41f1-ae31-5c96d3d092cf
export class MySkillsComponent implements OnInit {
  shouldAnimate = false;

  icons = {
    focus: faArrowsToCircle,
    research: faBookAtlas,
    teamWork: faPeopleGroup,
    shareKnolage: faSquareShareNodes,
    update: faPenToSquare,
    target: faBullseye,
  };

  platform = [
    {
      title: 'Platform',
      percent: 80,
    },
    {
      title: 'Clean code',
      percent: 60,
    },
    {
      title: 'Problem solving',
      percent: 50,
    },
    {
      title: 'Creativity',
      percent: 70,
    },
    {
      title: 'TeamWork',
      percent: 75,
    },
  ];

  skills = Skills;
  urlModel3D = 'https://prod.spline.design/pqGs5qvPsVf8OLjV/scene.splinecode';

  constructor(private skillService: SkillServiceService) {
    effect(() => {
      console.log(this.skillService.relatedProjectsValue);
    });
  }

  ngOnInit(): void {
    // make sure you have a canvas in the body
    const canvas: any = document.getElementById('canvas3d');
    const spline = new Application(canvas);
    spline.load(this.urlModel3D);

    setTimeout(() => {
      this.shouldAnimate = true;
    }, 1600);
  }
}
