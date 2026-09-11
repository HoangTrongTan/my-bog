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
import { ButtonCustomComponent } from '../../components/button-custom/button-custom.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MyCvDialogCp } from './dialogListCv/dialog-ls-cv';
import { callGeminiAiApi } from '../../configs/api.config';

@Component({
  selector: 'app-view-my-cv',
  standalone: true,
  imports: [
    PdfViewerModule,
    FontAwesomeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ButtonCustomComponent,
    MatDialogModule,
  ],
  templateUrl: './view-my-cv.component.html',
  styleUrl: './view-my-cv.component.scss',
})
export class ViewMyCvComponent {
  async Res() {
    try {
      await callGeminiAiApi('từ này xấu hay tốt "yêu lắm" bạn trả lời ngắn thôi nhé');
    } catch (err) {
      console.warn('CV AI Test call failed:', err);
    }
  }

  constructor(private dialogMyCv: MatDialog) {}



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
    this.zoom.update((old) => (old - 0.1 < 0.4 ? 0.4 : old - 0.1));
  }

  openDialogMyCv(){
    this.dialogMyCv.open(MyCvDialogCp, {
       data: {
        data: [
          {
            typeCv: 'WORD',
            nameCv: 'CV - Apply job',
            linkCv: '/access/words/CVTan.docx'
          },
          {
            typeCv: 'PDF',
            nameCv: 'CV - Working in FPT',
            linkCv: '/access/pdfs/CV_TANHT6-TanTiny.pdf'
          }
        ],
        passValid: 'Tandev1511@api'
       }
    })
  }
}
