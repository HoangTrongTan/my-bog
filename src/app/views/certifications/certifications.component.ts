import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ListComponent } from './list/list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [MatTabsModule, ListComponent, FontAwesomeModule],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
})
export class CertificationsComponent {
  listCertificates = [
    {
      title: 'Javascript',
      icon: '',
      access: [
        {
          img: 'f8-certificate.png',
          link: 'https://fullstack.edu.vn/cert/iay98'
        },
        {
          img: 'f8-certificate1.png',
          link: 'https://fullstack.edu.vn/cert/dica8'
        },
        {
          img: 'nextjs.jpg',
          link: 'https://www.udemy.com/certificate/UC-19cfdc58-3cfd-41b5-9680-1d3c0fc2d6f7/'
        },
        {
          img: 'nodeJS.png',
          link: 'https://certificates.simplicdn.net/share/8146708_85059661743874556972.pdf'
        },
        {
          img: 'react.jpg',
          link: 'https://certificates.simplicdn.net/share/8151143_85095651743992161435.pdf'
        },
        {
          img: 'angular.jpg',
          link: 'https://certificates.simplicdn.net/share/8150954_85099241744011688305.pdf'
        },
      ],
    },
    {
      title: 'Cloud',
      icon: '',
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
      icon: '',
      access: [
        {
          img: 'security1.jpg',
          link: 'https://certificates.simplicdn.net/share/8147550_85059661743906092553.pdf',
        },
      ],
    },
    {
      title: 'Database',
      icon: '',
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
      icon: '',
      access: [
        {
          img: 'android.jpg',
          link: 'https://certificates.simplicdn.net/share/8153692_85095651744009902127.pdf',
        },
      ],
    },
    {
      title: 'Python',
      icon: '',
      access: [
        {
          img: 'Django.jpg',
          link: 'https://certificates.simplicdn.net/share/8150187_85097201743948586190.pdf',
        },
      ],
    },
    {
      title: 'C#',
      icon: '',
      access: [
        {
          img: 'asp.jpg',
          link: 'https://certificates.simplicdn.net/share/8150697_85097201743954030404.pdf',
        },
      ],
    },
    {
      title: 'Project Manager',
      icon: '',
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
      icon: '',
      access: [{
        img: 'certificate1.jpg',
        link: ''
      }],
    },
  ];
}
