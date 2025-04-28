import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-responsive-book',
  imports: [],
  templateUrl: './responsive-book.component.html',
  styleUrl: './responsive-book.component.scss',
})
export class ResponsiveBookComponent implements OnInit {
  @ViewChild('ListBookRef') listBookRef!: ElementRef;
  curentPage = 0;

  ngOnInit(): void {
    // make sure you have a canvas in the body
    const canvas: any = document.getElementById('canvas3dAboutRes');
    // start the application and load the scene
    const spline = new Application(canvas);
    spline.load('https://prod.spline.design/0AgcNBmJ3guKmseE/scene.splinecode');
  }

  OnClick(next = true) {
    let leaf: any;
    const length = this.listBookRef.nativeElement.childNodes.length;
    const elm = this.listBookRef.nativeElement.children;
    
    if (next) {
      if (this.curentPage >= length - 1) return;
      leaf = elm[this.curentPage];
      if (leaf) {
        leaf.style.transform = 'rotate3d(0, 1, 0, -360deg)';
        setTimeout(() => {
          leaf.style.zIndex = '5';
        }, 100)
      }
      this.curentPage++;
      return;
    }
    if (this.curentPage - 1 < 0) return;
    this.curentPage--;
    leaf = elm[this.curentPage];
    if (leaf) {
      leaf.style.transform = 'rotate3d(0, 1, 0, 0deg)';
      setTimeout(() => {
        leaf.style.zIndex = `${90 - this.curentPage * 10}`;
      }, 100)
    }
  }
}
