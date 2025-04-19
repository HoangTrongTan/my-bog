import { Component } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { LoaderComponent } from '../../components/loader';
import { TextRenderComponent } from '../../components/text-render/text-render.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGitAlt,
  faGratipay,
  faFacebookMessenger,
  faTiktok,
  faDocker,
  faInstagram,
  faInvision,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { faEye, faFaceGrinHearts } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { PATH_CONFIG } from '../../configs/path';

@Component({
  selector: 'app-home',
  imports: [
    FontAwesomeModule,
    // TranslatePipe,
    // LoaderComponent,
    TextRenderComponent,
    MatTooltipModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  textRuns = [
    "I AM A DEVELOPER !",
    `I AM ${new Date().getFullYear() - 2002} YEARS OLD 🔥.`,
    'I LOVE CODING! 💻🔥',
    "I WANT TO BE FRIENDS WITH EVERYONE! 😊🌍"
  ]

  knolages = [
    {
      count: `${new Date().getFullYear() - 2023} +`,
      text: 'Years Experience'
    },
    {
      count: `5 >`,
      text: 'Completed Projects'
    },
    {
      count: `1`,
      text: 'Projects In Progress'
    },
    {
      count: `3`,
      text: 'real project'
    },
  ]

  PATH = PATH_CONFIG

  constructor() {
  }
  faEye = faEye
  faFaceGrinHearts = faFaceGrinHearts
  icons = [
    { name: 'GitAlt', icon: faGitAlt, color: 'linear-gradient(to bottom, #f34f29, #b92e20)' },
    // { name: 'Locket', icon: faGratipay, color: 'linear-gradient(to bottom, #ffcc00, #ff9900)' },
    { name: 'FacebookMessenger', icon: faFacebookMessenger, color: 'linear-gradient(to bottom, #00b2ff, #006aff)' },
    { name: 'Tiktok', icon: faTiktok , color: 'linear-gradient(to bottom, #36c5cf, #eb0840)' },
    // { name: 'Docker', icon: faDocker , color: 'linear-gradient(to bottom, #0db7ed, #054472)' },
    { name: 'Instagram', icon: faInstagram , color: 'linear-gradient(to bottom, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' },
    { name: 'Invision', icon: faInvision , color: 'linear-gradient(to bottom, #0077b5, #004471)' },
    { name: 'Facebook', icon: faFacebook , color: 'linear-gradient(to bottom, #274a94, #0d358a)' },
  ];
}
