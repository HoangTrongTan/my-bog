import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { SkillBox3dComponent } from './skill-box3d/skill-box3d.component';
import { SumaryItemComponent } from './sumary-item/sumary-item.component';
import { listAnimation } from '../../common/listAnimation';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-my-skills',
  imports: [
    MatExpansionModule,
    FontAwesomeModule,
    SkillBox3dComponent,
    SumaryItemComponent,
  ],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss',
  animations: [
    listAnimation,
    trigger('fadeSlideIn', [
      state('hidden', style({ opacity: 0, transform: 'translateY(30px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('600ms ease-out')),
    ]),
  ],
})
// https://app.spline.design/file/4581af86-fad5-41f1-ae31-5c96d3d092cf
export class MySkillsComponent implements OnInit, AfterViewInit {
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

  visibleItems: boolean[] = [];

  ngAfterViewInit() {
    const items = document.querySelectorAll('.wrap');
    items.forEach((el, index) => {
      this.visibleItems[index] = false;

      const observer = new IntersectionObserver(
        ([entry]) => {
          this.visibleItems[index] = entry.isIntersecting;
        },
        { threshold: 0.2, root: document.querySelector('.wrapper') } //ngưỡng hiển thị,
      );

      observer.observe(el);
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
