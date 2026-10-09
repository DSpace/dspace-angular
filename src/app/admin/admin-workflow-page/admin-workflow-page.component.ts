import { Component } from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';

import { ThemedSearchComponent } from '../../shared/search/themed-search.component';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import { SearchConfigurationService } from '../../shared/search/search-configuration.service';

@Component({
  selector: 'ds-base-admin-workflow-page',
  templateUrl: './admin-workflow-page.component.html',
  styleUrls: ['./admin-workflow-page.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
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
