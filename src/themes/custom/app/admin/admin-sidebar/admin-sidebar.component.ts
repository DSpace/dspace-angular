import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AdminSidebarComponent as BaseComponent } from '../../../../../app/admin/admin-sidebar/admin-sidebar.component';

/**
 * Component representing the admin sidebar
 */
@Component({
  selector: 'ds-admin-sidebar',
  // templateUrl: './admin-sidebar.component.html',
  templateUrl: '../../../../../app/admin/admin-sidebar/admin-sidebar.component.html',
  // styleUrls: ['./admin-sidebar.component.scss']
  styleUrls: ['../../../../../app/admin/admin-sidebar/admin-sidebar.component.scss'],
  standalone: true,
  imports: [NgIf, NgbDropdownModule, NgClass, NgFor, NgComponentOutlet, AsyncPipe, TranslateModule, FontAwesomeModule],
})
export class AdminSidebarComponent extends BaseComponent {
}
