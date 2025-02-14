import { Component } from '@angular/core';

import { AdminWorkflowPageComponent as BaseComponent } from '../../../../../app/admin/admin-workflow-page/admin-workflow-page.component';
import { ThemedConfigurationSearchPageComponent } from '../../../../../app/search-page/themed-configuration-search-page.component';

@Component({
  selector: 'ds-themed-admin-workflow-page',
  // styleUrls: ['./admin-workflow-page.component.scss'],
  styleUrls: ['../../../../../app/admin/admin-workflow-page/admin-workflow-page.component.scss'],
  // templateUrl: './admin-workflow-page.component.html',
  templateUrl: '../../../../../app/admin/admin-workflow-page/admin-workflow-page.component.html',
  standalone: true,
  imports: [
    ThemedConfigurationSearchPageComponent,
  ],
})
export class AdminWorkflowPageComponent extends BaseComponent {
}
