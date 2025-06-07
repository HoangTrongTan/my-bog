import { Component, input, output } from '@angular/core';
import { TRelatedProjectItem, TSkill } from '../skills.type';
import { faSquareCaretLeft } from '@fortawesome/free-regular-svg-icons'
import { faGitAlt } from '@fortawesome/free-brands-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-skill-related',
  imports: [FontAwesomeModule],
  templateUrl: './skill-related.component.html',
  styleUrl: './skill-related.component.scss'
})
export class SkillRelatedComponent {
  relatedProjects = input<TSkill | undefined>();
  btnBack = output();
  icons = {
    faSquareCaretLeft,
    faGitAlt,
    faLink
  }

  onBack(){
    this.btnBack.emit();
  }
}
