import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-my-skills',
  imports: [MatExpansionModule, MatProgressBarModule, FontAwesomeModule],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss',
})
// https://app.spline.design/file/4581af86-fad5-41f1-ae31-5c96d3d092cf
export class MySkillsComponent implements OnInit {
  icons = {
    focus: faArrowsToCircle,
    research: faBookAtlas,
    teamWork: faPeopleGroup,
    shareKnolage: faSquareShareNodes,
    update: faPenToSquare,
    target: faBullseye,
  };

  skills = Skills;
  urlModel3D = 'https://prod.spline.design/pqGs5qvPsVf8OLjV/scene.splinecode';
  ngOnInit(): void {
    // make sure you have a canvas in the body
    const canvas: any = document.getElementById('canvas3d');
    const spline = new Application(canvas);
    spline.load(this.urlModel3D);
  }
}
