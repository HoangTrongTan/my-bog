import { AfterViewInit, Component, input, output } from '@angular/core';
import { LightboxModule, Lightbox } from 'ngx-lightbox';
type Tthumb = {
  src: string;
  caption: string;
  thumb: string;
};
@Component({
  selector: 'app-list',
  imports: [LightboxModule],
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
  lists = input<{ img: string; link: string }[]>([]);
  private urlBase = '/access/imgs/certificate/';
  _album: Tthumb[] = [];

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
