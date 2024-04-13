import { Component } from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { ThemedConfigurationSearchPageComponent } from '../../search-page/themed-configuration-search-page.component';

@Component({
  selector: 'ds-admin-workflow-page',
  templateUrl: './admin-workflow-page.component.html',
  styleUrls: ['./admin-workflow-page.component.scss'],
  standalone: true,
  imports: [ThemedConfigurationSearchPageComponent],
})

/**
 * Component that represents a workflow item search page for administrators
 */
export class AdminWorkflowPageComponent {
  /**
   * The context of this page
   */
  context: Context = Context.AdminWorkflowSearch;
}
