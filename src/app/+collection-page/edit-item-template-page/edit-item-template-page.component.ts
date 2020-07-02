import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { ItemTemplateDataService } from '../../core/data/item-template-data.service';
import { getCollectionEditPath } from '../collection-page-routing.module';

@Component({
  selector: 'ds-edit-item-template-page',
  templateUrl: './edit-item-template-page.component.html',
})
/**
 * Component for editing the item template of a collection
 */
export class EditItemTemplatePageComponent implements OnInit {

  /**
   * The collection to edit the item template for
   */
  collectionRD$: Observable<RemoteData<Collection>>;

  constructor(protected route: ActivatedRoute,
              public itemTemplateService: ItemTemplateDataService) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.parent.data.pipe(first(), map((data) => data.dso));
  }

  /**
   * Get the URL to the collection's edit page
   * @param collection
   */
  getCollectionEditUrl(collection: Collection): string {
    if (collection) {
      return getCollectionEditPath(collection.uuid);
    } else {
      return '';
    }
  }

}
