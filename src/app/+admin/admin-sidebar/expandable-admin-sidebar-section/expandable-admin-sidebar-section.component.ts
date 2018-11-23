import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { first } from 'rxjs/operators';
import { rotate } from '../../../shared/animations/rotate';
import { AdminSidebarSectionComponent } from '../admin-sidebar-section/admin-sidebar-section.component';
import { slide } from '../../../shared/animations/slide';
import { CSSVariableService } from '../../../shared/sass-helper/sass-helper.service';
import { bgColor } from '../../../shared/animations/bgColor';
import { AdminSidebarService } from '../admin-sidebar.service';

@Component({
  selector: 'ds-expandable-admin-sidebar-section',
  templateUrl: './expandable-admin-sidebar-section.component.html',
  styleUrls: ['./expandable-admin-sidebar-section.component.scss'],
  animations: [rotate, slide, bgColor]

})
export class ExpandableAdminSidebarSectionComponent extends AdminSidebarSectionComponent implements OnInit {
  @Input() subSections;
  link = '#';
  sidebarActiveBg;
  collapsed: Observable<boolean>;
  sidebarCollapsed: Observable<boolean>;

  constructor(private sidebarService: AdminSidebarService,
              private variableService: CSSVariableService) {
    super();
  }

  ngOnInit(): void {
    this.sidebarActiveBg = this.variableService.getVariable('adminSidebarActiveBg');
    this.collapsed = this.sidebarService.isSectionCollapsed(this.name);
    this.sidebarCollapsed = this.sidebarService.isSidebarCollapsed();
  }

  toggleSection(event: Event) {
    event.preventDefault();
    this.sidebarCollapsed.pipe(first())
      .subscribe((sidebarCollapsed) => {
        if (sidebarCollapsed) {
          this.sidebarService.toggleSidebar();
        }
        this.sidebarService.toggleSection(this.name);
      })
  }
}
