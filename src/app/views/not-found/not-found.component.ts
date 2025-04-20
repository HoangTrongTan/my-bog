import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonCustomComponent } from '../../components/button-custom/button-custom.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-not-found',
  imports: [RouterOutlet, ButtonCustomComponent, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements AfterViewInit {
  private _snackBar = inject(MatSnackBar);

  ngAfterViewInit(): void {
    this.openSnackBar();
  }

  openSnackBar() {
    this._snackBar.open('Trang hiện chưa được tìm thấy, Vui lòng thử lại sau nhé !', 'Done !', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
