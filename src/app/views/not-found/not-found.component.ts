import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftSidebarComponent } from '../../layouts/main-layout/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../../layouts/main-layout/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterOutlet],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
