import { Component, OnInit, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
})

export class SearchResultsComponent implements OnInit {
  @Input() searchResults: RemoteData<DSpaceObject[]>;

  ngOnInit(): void {
    // onInit

  }
}
