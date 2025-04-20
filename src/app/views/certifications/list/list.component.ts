import { AfterViewInit, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LightboxModule, Lightbox } from 'ngx-lightbox';
import { IconDefinition, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

type Tthumb = {
  src: string;
  caption: string;
  thumb: string;
};
@Component({
  selector: 'app-list',
  imports: [LightboxModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
  lists = input<{ img: string; link: string; }[]>([]);
  private urlBase = '/access/imgs/certificate/';
  _album: Tthumb[] = [];
  icons = {
    faUpRightFromSquare,
  };

  ngAfterViewInit(): void {
    this._album = this.lists().map((item) => ({
      src: `${this.urlBase}${item.img}`,
      caption: item.img,
      thumb: item.img,
    }));
  }

  constructor(private _lightbox: Lightbox) {}

  open(i: number) {
    this._lightbox.open(this._album, i);
  }
}
