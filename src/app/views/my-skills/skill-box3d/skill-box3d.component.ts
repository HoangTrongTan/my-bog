import { Component, input } from '@angular/core';
import { SkillRelatedComponent } from "../skill-related/skill-related.component";
import { TRelatedProjectItem, TSkill } from '../skills.type';
import { CommonModule } from '@angular/common';
import { SkillItemComponent } from "../skill-item/skill-item.component";
import { listAnimation } from '../../../common/listAnimation';

@Component({
  selector: 'app-skill-box3d',
  imports: [SkillRelatedComponent, CommonModule, SkillItemComponent],
  templateUrl: './skill-box3d.component.html',
  styleUrl: './skill-box3d.component.scss',
  animations: [listAnimation],

})
export class SkillBox3dComponent {
  items = input<TSkill[]>([]);

  skills: TSkill | undefined = undefined;

  onReceiveRelatedProject(value: TSkill | undefined){
    this.skills = value;
  }

  onBack(){
    this.skills = undefined;
  }
}
