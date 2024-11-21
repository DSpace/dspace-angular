import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AdminSidebarComponent as BaseComponent } from '../../../../../app/admin/admin-sidebar/admin-sidebar.component';

/**
 * Component representing the admin sidebar
 */
@Component({
  selector: 'ds-themed-admin-sidebar',
  // templateUrl: './admin-sidebar.component.html',
  templateUrl: '../../../../../app/admin/admin-sidebar/admin-sidebar.component.html',
  // styleUrls: ['./admin-sidebar.component.scss']
  styleUrls: ['../../../../../app/admin/admin-sidebar/admin-sidebar.component.scss'],
  standalone: true,
  imports: [NgIf, NgbDropdownModule, NgClass, NgFor, NgComponentOutlet, AsyncPipe, TranslateModule],
})
export class AdminSidebarComponent extends BaseComponent {
}
