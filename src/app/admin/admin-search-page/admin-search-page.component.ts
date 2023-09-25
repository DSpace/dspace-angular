import { Component } from '@angular/core';
import { Context } from '../../core/shared/context.model';
import { ConfigurationSearchPageComponent } from '../../search-page/configuration-search-page.component';

@Component({
    selector: 'ds-admin-search-page',
    templateUrl: './admin-search-page.component.html',
    styleUrls: ['./admin-search-page.component.scss'],
    standalone: true,
    imports: [ConfigurationSearchPageComponent]
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
