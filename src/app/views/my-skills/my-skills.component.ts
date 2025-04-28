import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import Skills from '../../data/my-skill/skill.json';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-my-skills',
  imports: [MatExpansionModule, MatProgressBarModule],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss',
})
export class MySkillsComponent {
  skills = Skills;
  constructor(){
    
  }
}
