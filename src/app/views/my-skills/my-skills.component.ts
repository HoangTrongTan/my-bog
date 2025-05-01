import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import Skills from '../../data/my-skill/skill.json';
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
import { SkillBox3dComponent } from "./skill-box3d/skill-box3d.component";
import { SumaryItemComponent } from "./sumary-item/sumary-item.component";
import { listAnimation } from '../../common/listAnimation';

@Component({
  selector: 'app-my-skills',
  imports: [
    MatExpansionModule,
    FontAwesomeModule,
    SkillBox3dComponent,
    SumaryItemComponent
],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss',
  animations: [listAnimation]
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
