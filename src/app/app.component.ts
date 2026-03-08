import { Component, OnInit, signal } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import translationsEN from '../../public/i18n/en.json';
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import { filter } from 'rxjs';
import { LoaderComponent } from './components/loader';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isLoading = signal<boolean>(false);

  constructor(
    private translate: TranslateService, 
    private router: Router,
    private themeService: ThemeService
    ) {
    // translate.setTranslation('en', translationsEN);
    // translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    this.themeService.loadTheme();
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.isLoading.set(true);
        setTimeout(() => {
          this.isLoading.set(false);
        }, 1300);
      });
  }
}
