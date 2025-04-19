import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-text-render',
  imports: [],
  templateUrl: './text-render.component.html',
  styleUrl: './text-render.component.scss',
})
export class TextRenderComponent implements OnInit {
  text = input<string[]>([]);
  noRender = input<string>('');
  private destroyRef = inject(DestroyRef);
  textRender = signal<string>(this.text().length > 0 ? this.text()[0] : '');

  ngOnInit(): void {
    let i = 0;
    let j = 0;
    let Desc = false;
    let speed = 100;

    const setTextAsc = (i: number, curr: number, onFinsish: () => void) => {
      if (i > this.text()[curr].length) {
        setTimeout(() => {
          onFinsish();
        }, 2000);
        return;
      }
      
      this.textRender.set(this.text()[curr].substring(0, i));
    };

    const setTextDesc = (i: number, curr: number, onFinsish: () => void) => {
      if (i <= 0) {
        onFinsish();
        return;
      }
      this.textRender.set(this.text()[curr].substring(0, i));
    };

    const intervalTime = setInterval(() => {
      if (!Desc) {
        i++;
        speed = 100;
        setTextAsc(i, j, () => {
          i = this.text()[j].length;
          Desc = true;
        });
      } else {
        i--;

        speed = 10;
        setTextDesc(i, j, () => {
          j++;
          i = 0;
          Desc = false;
        });
      }
      
      if (j > this.text().length - 1) {
        j = 0;
        i = 0;
      }
    }, speed);

    this.destroyRef.onDestroy(() => {
      clearInterval(intervalTime);
    });
  }
}
