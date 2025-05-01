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

  relatedProjects: TRelatedProjectItem[] | undefined = []

  onReceiveRelatedProject(value: TRelatedProjectItem[] | undefined){
    this.relatedProjects = value;
  }

  onBack(){
    this.relatedProjects = undefined;
  }
}
