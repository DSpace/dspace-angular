import { Component } from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { ThemedSearchComponent } from '../../shared/search/themed-search.component';

@Component({
  selector: 'ds-base-admin-search-page',
  templateUrl: './admin-search-page.component.html',
  styleUrls: ['./admin-search-page.component.scss'],
  standalone: true,
  imports: [
    ThemedSearchComponent,
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
