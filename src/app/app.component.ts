import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import translationsEN from "../../public/i18n/en.json";
import { NgxImageZoomModule } from 'ngx-image-zoom';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    // translate.setTranslation('en', translationsEN);
    // translate.setDefaultLang('en');
}
}
