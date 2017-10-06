import { Component, Input } from '@angular/core';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-view-switch',
  styleUrls: ['./search-view-switch.component.scss'],
  templateUrl: './search-view-switch.component.html',
})

export class SearchViewSwitchComponent {
  @Input() resultCount;
  @Input() active;
  constructor() {
    console.log('test');
  }

  switchView(b: boolean) {
    this.active = b;
  }
}
