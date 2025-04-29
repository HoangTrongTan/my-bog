import { Injectable, signal } from '@angular/core';
import { TRelatedProjectItem } from './skills.type';

@Injectable({
  providedIn: 'root',
})
export class SkillServiceService {
  private relatedProject = signal<TRelatedProjectItem[] | undefined>(undefined);
  constructor() {}
  setRelatedProject(value: TRelatedProjectItem[] | undefined) {
    this.relatedProject.set(value);
  }
  get relatedProjectsValue(): TRelatedProjectItem[] | undefined {
    return this.relatedProject();
  }
  refreshRelatedProject() {
    this.relatedProject.set([]);
  }
}
