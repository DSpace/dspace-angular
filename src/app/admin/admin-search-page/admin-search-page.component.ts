import { Component } from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { ThemedConfigurationSearchPageComponent } from '../../search-page/themed-configuration-search-page.component';

@Component({
  selector: 'ds-base-admin-search-page',
  templateUrl: './admin-search-page.component.html',
  styleUrls: ['./admin-search-page.component.scss'],
  standalone: true,
  imports: [
    ThemedConfigurationSearchPageComponent,
  ],
})

/**
 * Component that represents a search page for administrators
 */
export class AdminSearchPageComponent {
  /**
   * The context of this page
   */
  context: Context = Context.AdminSearch;
}
