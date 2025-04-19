import { Component, NgModule, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleMinus,
  faCirclePlus,
  faDownload,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GoogleGenAI } from '@google/genai';
import { FormsModule, NgModel } from '@angular/forms';

const ai = new GoogleGenAI({
  apiKey: 'AIzaSyDiqrEuUpNl-K5hUPCiyICx3svEEQ8q344',
});

@Component({
  selector: 'app-view-my-cv',
  standalone: true,

  imports: [
    PdfViewerModule,
    FontAwesomeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './view-my-cv.component.html',
  styleUrl: './view-my-cv.component.scss',
})

// docs:https://ai.google.dev/gemini-api/docs/text-generation?hl=vi#javascript
// https://console.cloud.google.com/apis/credentials
export class ViewMyCvComponent {
  async Res() {
    const reponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro-exp-03-25',
      contents: 'từ này xấu hay tốt "yêu lắm" bạn trả lời ngắn thôi nhé"',
    });

    console.log(reponse.text);
  }
  constructor() {
    this.Res();
  }

  maxPage = signal<number>(0);
  pageCur = signal<number>(1);
  zoom = signal<number>(1);
  icons = {
    faMagnifyingGlassPlus,
    faMagnifyingGlassMinus,
    faDownload,
    faCirclePlus,
    faCircleMinus,
    faChevronDown,
    faChevronUp,
  };
  src = '/access/pdfs/myCV.pdf';
  OnLoadComplete(pdf: PDFDocumentProxy) {
    this.maxPage.set(pdf.numPages);
  }

  onZoomIn() {
    this.zoom.update((old) => (old + 0.1 > 2 ? 2 : old + 0.1));
  }

  onChangePageOfType(value: '-' | '+') {
    if (value === '+') {
      this.pageCur.update((old) =>
        old + 1 > this.maxPage() ? this.maxPage() : old + 1
      );
      return;
    }
    this.pageCur.update((old) => (old - 1 < 0 ? 1 : old - 1));
  }

  onZoomOut() {
    this.zoom.update((old) => (old - 0.1 < 1 ? 1 : old - 0.1));
  }
}
