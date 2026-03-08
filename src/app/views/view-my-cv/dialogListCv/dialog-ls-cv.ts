import { Component, Inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ButtonCustomComponent } from '../../../components/button-custom/button-custom.component';
import { FormsModule } from '@angular/forms';
import { faFileWord, faFilePdf, faDownload  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


type DataDialog = {
  typeCv: 'WORD' | 'PDF';
  nameCv: string;
  linkCv: string;
};

@Component({
  selector: 'app-my-cv-dialog',
  templateUrl: './dialog-ls-cv.html',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ButtonCustomComponent,
    FormsModule,
    FontAwesomeModule
],
  styleUrl: './dialog-ls-cv.scss'
})
export class MyCvDialogCp {
  passWord = signal<string>('');
  passWordValid = signal<string>('');
  isAuthurized = signal<boolean>(false);
  dataList = signal<DataDialog[]>([]);
  iconDown = faDownload
  constructor(
    public dialogRef: MatDialogRef<MyCvDialogCp>,
    @Inject(MAT_DIALOG_DATA)
    public payload: {
      data: DataDialog[];
      passValid: string;
    }
  ) {
    this.dataList.set(payload.data);
    this.passWordValid.set(payload.passValid);
  }

  onHandleCheckPass() {
    if (this.passWordValid() === this.passWord()) {
      this.isAuthurized.set(true);
    } else {
      this.isAuthurized.set(false);
    }
  }

  iconCv(type: 'WORD' | 'PDF')  {
    return {
      'WORD': faFileWord,
      'PDF': faFilePdf 
    }[type]
  }
}
