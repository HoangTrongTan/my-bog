import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faHouseChimneyWindow } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header-responsive',
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './header-responsive.component.html',
  styleUrl: './header-responsive.component.scss'
})
export class HeaderResponsiveComponent {
  $clickMenu = output<boolean>();

  icons = {
    faBars,
    faHouseChimneyWindow
  }
  onBlur(){
    this.$clickMenu.emit(false);
  }

  clickOpenMenu(){
    this.$clickMenu.emit(true);
  }
}
