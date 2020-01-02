import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SearchConfigurationOption } from '../search-switch-configuration/search-configuration-option.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-sidebar',
  styleUrls: ['./search-sidebar.component.scss'],
  templateUrl: './search-sidebar.component.html',
})

/**
 * Component representing the sidebar on the search page
 */
export class SearchSidebarComponent {

  /**
   * The list of available configuration options
   */
  @Input() configurationList: SearchConfigurationOption[];

  /**
   * The total amount of results
   */
  @Input() resultCount;

  /**
   * The list of available view mode options
   */
  @Input() viewModeList;

  /**
   * Whether to show the view mode switch
   */
  @Input() showViewModes = true;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits event when the user clicks a button to open or close the sidebar
   */
  @Output() toggleSidebar = new EventEmitter<boolean>();

}
