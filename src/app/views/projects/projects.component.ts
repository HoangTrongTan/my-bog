import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PROJECTS_TIMELINE_DATA, WORK_STAGES, ProjectItem } from '../../data/my-projects/projects-timeline.data';
import { AudioService } from '../../services/audio.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  public audioService = inject(AudioService);
  public themeService = inject(ThemeService);

  public activeFilter = signal<'all' | 'real-world' | 'academic'>('all');
  public selectedProject = signal<ProjectItem | null>(null);
  public stages = WORK_STAGES;
  public projects = PROJECTS_TIMELINE_DATA;

  ngOnInit() {}

  public get filteredProjects(): ProjectItem[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.projects;
    return this.projects.filter(p => p.category === filter);
  }

  public get realWorldCount(): number {
    return this.projects.filter(p => p.category === 'real-world').length;
  }

  public get academicCount(): number {
    return this.projects.filter(p => p.category === 'academic').length;
  }

  public setFilter(filter: 'all' | 'real-world' | 'academic') {
    this.activeFilter.set(filter);
    this.audioService.playClickSound();
  }

  public openDetail(project: ProjectItem) {
    this.selectedProject.set(project);
    this.audioService.playClickSound();
  }

  public closeDetail() {
    this.selectedProject.set(null);
    this.audioService.playClickSound();
  }
}
