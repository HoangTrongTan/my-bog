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
      {
        path: PATH_CONFIG.EXPRESSION,
        loadComponent: () =>
          import('./views/expression/expression.component').then(
            (mod) => mod.ExpressionComponent
          ),
      },
      {
        path: PATH_CONFIG.TECH_KNOWLEDGE,
        loadComponent: () =>
          import('./views/tech-knowledge/tech-knowledge.component').then(
            (mod) => mod.TechKnowledgeComponent
          ),
      },
      {
        path: PATH_CONFIG.PRIZES,
        loadComponent: () =>
          import('./views/prizes/prizes.component').then(
            (mod) => mod.PrizesComponent
          ),
      },
      {
        path: PATH_CONFIG.TRENDS,
        loadComponent: () =>
          import('./views/trends/trends.component').then(
            (mod) => mod.TrendsComponent
          ),
      },
      {
        path: PATH_CONFIG.FOOD_WHEEL,
        loadComponent: () =>
          import('./views/food-wheel/food-wheel.component').then(
            (mod) => mod.FoodWheelComponent
          ),
      },
      {
        path: PATH_CONFIG.ADMIN_FEEDBACK,
        loadComponent: () =>
          import('./views/admin-feedback/admin-feedback.component').then(
            (mod) => mod.AdminFeedbackComponent
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
