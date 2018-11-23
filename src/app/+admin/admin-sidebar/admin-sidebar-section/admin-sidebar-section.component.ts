import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-admin-sidebar-section',
  templateUrl: './admin-sidebar-section.component.html',
  styleUrls: ['./admin-sidebar-section.component.scss'],

})
export class AdminSidebarSectionComponent {
  @Input() name: string;
  @Input() link: string;
  @Input() icon: string;
}
