import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { slideSidebar } from '../../shared/animations/slide';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';
import { AdminSidebarService } from './admin-sidebar.service';

@Component({
  selector: 'ds-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  animations: [slideSidebar]
})
export class AdminSidebarComponent implements OnInit {
  sidebarCollapsed: Observable<boolean>;
  sidebarWidth: Observable<string>;
  sidebarOpen = true;
  sidebarClosed = !this.sidebarOpen;

  constructor(private sidebarService: AdminSidebarService,
              private variableService: CSSVariableService) {
  }

  ngOnInit(): void {
    this.sidebarWidth = this.variableService.getVariable('adminSidebarWidth');
    this.sidebarCollapsed = this.sidebarService.isSidebarCollapsed();
  }

  toggle(event: Event) {
    event.preventDefault();
    // Is sidebar closing?
    if (this.sidebarOpen) {
      this.sidebarService.collapseAllSections();
    }
    this.sidebarService.toggleSidebar();
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  startSlide(event: any): void {
    if (event.toState === 'expanded') {
      this.sidebarClosed = false;
    } else if (event.toState === 'collapsed') {
      this.sidebarOpen = false;
    }
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'expanded') {
      this.sidebarClosed = true;
    } else if (event.fromState === 'collapsed') {
      this.sidebarOpen = true;
    }
  }
}
