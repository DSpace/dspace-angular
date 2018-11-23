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
  sidebarActive = true;

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
    if (this.sidebarActive) {
      this.sidebarActive = false;
      this.sidebarService.collapseAllSections();
    }
    this.sidebarService.toggleSidebar();
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.sidebarActive = true;
    }
  }
}
