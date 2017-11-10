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

export class SearchSidebarComponent {
  @Input() resultCount;
  @Output() toggleSidebar = new EventEmitter<boolean>();
  constructor() {
  }
}
