import { Component } from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { ThemedSearchComponent } from '../../shared/search/themed-search.component';

@Component({
  selector: 'ds-base-admin-workflow-page',
  templateUrl: './admin-workflow-page.component.html',
  styleUrls: ['./admin-workflow-page.component.scss'],
  standalone: true,
  imports: [
    ThemedSearchComponent,
  ],
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
