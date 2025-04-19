import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { FOLDER_I18N, LANGUAGE_I18N } from '../configs/translate';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, FOLDER_I18N, '.json');

export const provideAppTranslateService = () =>
  provideTranslateService({
    defaultLanguage: LANGUAGE_I18N.English,
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient],
    },
  });
