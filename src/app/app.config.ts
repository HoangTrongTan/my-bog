import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideAppTranslateService } from './services/translate.service';
import { NgxImageZoomComponent, NgxImageZoomModule } from 'ngx-image-zoom';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({})),
    provideClientHydration(),
    provideHttpClient(),
    provideAppTranslateService(),
    provideStore(),
    NgxImageZoomModule,
    provideAnimations()
  ],
};
