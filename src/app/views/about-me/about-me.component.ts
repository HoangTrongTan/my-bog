import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Application } from '@splinetool/runtime';
import { ResponsiveBookComponent } from './responsive-book/responsive-book.component';
// https://app.spline.design/community/file/bcc9e075-7b80-40cf-8dc9-9c5d521655a6
@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [ResponsiveBookComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
})

// tạo next vói prev ý sau class là one, two, three ở flip-box
export class AboutMeComponent implements OnInit, AfterViewInit {
  @ViewChildren('leaf') leafs!: QueryList<ElementRef>;
  curentPage = 0;
  ngAfterViewInit() {}

  OnClick(next = true) {
    let leaf: any;
    if (next) {
      if (this.curentPage >= this.leafs.length) return;
      leaf = this.leafs.get(this.curentPage);
      if (leaf) {
        leaf.nativeElement.style.transform = 'rotate3d(0, 1, 0, -180deg)';
        setTimeout(() => {
          leaf.nativeElement.style.zIndex = '60';
        }, 100)
      }
      this.curentPage++;
      return;
    }
    if (this.curentPage - 1 < 0) return;
    this.curentPage--;
    leaf = this.leafs.get(this.curentPage);
    if (leaf) {
      leaf.nativeElement.style.transform = 'rotate3d(0, 1, 0, 0deg)';
      setTimeout(() => {
        leaf.nativeElement.style.zIndex = `${70 - this.curentPage * 10}`;
      }, 100);
    }
  }

  ngOnInit(): void {
    // make sure you have a canvas in the body
    const canvas: any = document.getElementById('canvas3d');
    // start the application and load the scene
    const spline = new Application(canvas);
    spline.load('https://prod.spline.design/0AgcNBmJ3guKmseE/scene.splinecode');
  }
}
