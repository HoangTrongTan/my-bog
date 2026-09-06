import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faHouseChimneyWindow } from '@fortawesome/free-solid-svg-icons';
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-header-responsive',
  imports: [FontAwesomeModule, CommonModule, RouterLink, MatMenu, MatMenuItem, MatMenuTrigger, MatIconModule],
  standalone: true,
  templateUrl: './header-responsive.component.html',
  styleUrl: './header-responsive.component.scss'
})
export class HeaderResponsiveComponent {
  $clickMenu = output<boolean>();
  @Output() openStudio = new EventEmitter<void>();
  @Output() openTodoList = new EventEmitter<void>();

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

  onStudioClick(){
    this.openStudio.emit();
  }

  onTodoListClick(){
    this.openTodoList.emit();
  }
}
