import { Component, EventEmitter, Input, Output } from '@angular/core';

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
   * The total amount of results
   */
  @Input() resultCount;

  /**
   * Emits event when the user clicks a button to open or close the sidebar
   */
  @Output() toggleSidebar = new EventEmitter<boolean>();
}
