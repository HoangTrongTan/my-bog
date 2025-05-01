import { Routes } from '@angular/router';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './views/home/home.component';
import { ViewMyCvComponent } from './views/view-my-cv/view-my-cv.component';
import { PATH_CONFIG } from './configs/path';
import { AboutMeComponent } from './views/about-me/about-me.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: PATH_CONFIG.HOME,
        loadComponent: () =>
          import('./views/home/home.component').then(
            (mod) => mod.HomeComponent
          ),
      },
      {
        path: PATH_CONFIG.VIEW_MY_CV,
        loadComponent: () =>
          import('./views/view-my-cv/view-my-cv.component').then(
            (mod) => mod.ViewMyCvComponent
          ),
      },
      {
        path: PATH_CONFIG.ABOUT_ME,
        component: AboutMeComponent,
      },
      {
        path: PATH_CONFIG.CERTIFICATIONS,
        loadComponent: () =>
          import('./views/certifications/certifications.component').then(
            (mod) => mod.CertificationsComponent
          ),
      },
      {
        path: PATH_CONFIG.SKILLS,
        loadComponent: () =>
          import('./views/my-skills/my-skills.component').then(
            (mod) => mod.MySkillsComponent
          ),
      },
      {
        path: PATH_CONFIG.PROJECTS,
        loadComponent: () =>
          import('./views/projects/projects.component').then(
            (mod) => mod.ProjectsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
