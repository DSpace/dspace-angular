import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';

/**
 * This component renders the parent collections section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
  selector: 'ds-item-page-collections',
  templateUrl: './collections.component.html'
})
export class CollectionsComponent implements OnInit {

  @Input() item: Item;

  label = 'item.page.collections';

  separator = '<br/>';

  collections: Observable<Collection[]>;

  constructor(private rdbs: RemoteDataBuildService) {

  }

  ngOnInit(): void {
    //   this.collections = this.item.parents.payload;

    // TODO: this should use parents, but the collections
    // for an Item aren't returned by the REST API yet,
    // only the owning collection
    this.collections = this.item.owner.payload.map((c) => [c]);
  }

}
