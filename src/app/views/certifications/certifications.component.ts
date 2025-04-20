import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ListComponent } from './list/list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCloudArrowUp,
  faShieldHalved,
  faDatabase,
  faRobot,
  faDiagramProject,
  faFeatherPointed,
  faStaffSnake,
} from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [MatTabsModule, ListComponent, FontAwesomeModule],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
})
export class CertificationsComponent implements AfterViewInit {
  @ViewChild('tabGroup') tabGroupRef!: MatTabGroup;
  listCertificates: {
    title: string;
    icon: any | SafeHtml;
    access: { img: string; link: string }[];
  }[] = [];
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateTabGroupWidth();
  }

  constructor(private sanitizer: DomSanitizer) {
    this.listCertificates = [
      {
        title: 'Javascript',
        icon: this.sanitizer
          .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 48 48">
        <path fill="#ffd600" d="M6,42V6h36v36H6z"></path><path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path>
        </svg>`),
        access: [
          {
            img: 'f8-certificate.png',
            link: 'https://fullstack.edu.vn/cert/iay98',
          },
          {
            img: 'f8-certificate1.png',
            link: 'https://fullstack.edu.vn/cert/dica8',
          },
          {
            img: 'nextjs.jpg',
            link: 'https://www.udemy.com/certificate/UC-19cfdc58-3cfd-41b5-9680-1d3c0fc2d6f7/',
          },
          {
            img: 'nodeJS.png',
            link: 'https://certificates.simplicdn.net/share/8146708_85059661743874556972.pdf',
          },
          {
            img: 'react.jpg',
            link: 'https://certificates.simplicdn.net/share/8151143_85095651743992161435.pdf',
          },
          {
            img: 'angular.jpg',
            link: 'https://certificates.simplicdn.net/share/8150954_85099241744011688305.pdf',
          },
        ],
      },
      {
        title: 'Cloud',
        icon: faCloudArrowUp,
        access: [
          {
            img: 'cloud1.jpg',
            link: 'https://certificates.simplicdn.net/share/8148060_85075111743922025016.pdf',
          },
          {
            img: 'cloud2.jpg',
            link: 'https://certificates.simplicdn.net/share/8148299_85075111743922468458.pdf',
          },
          {
            img: 'cloud3.jpg',
            link: 'https://certificates.simplicdn.net/share/8148341_85075111743922990085.pdf',
          },
        ],
      },
      {
        title: 'Security',
        icon: faShieldHalved,
        access: [
          {
            img: 'security1.jpg',
            link: 'https://certificates.simplicdn.net/share/8147550_85059661743906092553.pdf',
          },
        ],
      },
      {
        title: 'Database',
        icon: faDatabase,
        access: [
          {
            img: 'sql.jpg',
            link: 'https://certificates.simplicdn.net/share/8149046_85077231743932436056.pdf',
          },
          {
            img: 'mongoDB.jpg',
            link: 'https://certificates.simplicdn.net/share/8149741_85077231743942943087.pdf',
          },
          {
            img: 'postgreSQL.jpg',
            link: 'https://certificates.simplicdn.net/share/8150074_85077231743947291563.pdf',
          },
        ],
      },
      {
        title: 'Android',
        icon: faRobot,
        access: [
          {
            img: 'android.jpg',
            link: 'https://certificates.simplicdn.net/share/8153692_85095651744009902127.pdf',
          },
        ],
      },
      {
        title: 'Python',
        icon: faStaffSnake,
        access: [
          {
            img: 'Django.jpg',
            link: 'https://certificates.simplicdn.net/share/8150187_85097201743948586190.pdf',
          },
        ],
      },
      {
        title: 'C#',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 128 128"><path fill="#9B4F96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/><path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"/></svg>'
        ),
        access: [
          {
            img: 'asp.jpg',
            link: 'https://certificates.simplicdn.net/share/8150697_85097201743954030404.pdf',
          },
        ],
      },
      {
        title: 'Project Manager',
        icon: faDiagramProject,
        access: [
          {
            img: 'git.jpg',
            link: 'https://certificates.simplicdn.net/share/8152590_85095651743998437563.pdf',
          },
          {
            img: 'jira.jpg',
            link: 'https://certificates.simplicdn.net/share/8150301_85097201743949968230.pdf',
          },
        ],
      },
      {
        title: 'Other',
        icon: faFeatherPointed,
        access: [
          {
            img: 'certificate1.jpg',
            link: '',
          },
        ],
      },
    ];
  }

  updateTabGroupWidth() {
    const width = window.innerWidth;
    if (width > 1200) return;
    this.tabGroupRef._elementRef.nativeElement.style.width = `${width - 60}px`;
  }

  ngAfterViewInit(): void {
    this.updateTabGroupWidth();
  }

  isString(val: any) {
    return (
      val &&
      typeof val === 'object' &&
      val.changingThisBreaksApplicationSecurity !== undefined
    );
  }
}
