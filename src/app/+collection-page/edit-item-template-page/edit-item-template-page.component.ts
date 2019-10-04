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
export class EditItemTemplatePageComponent implements OnInit {
  collectionRD$: Observable<RemoteData<Collection>>;

  constructor(protected route: ActivatedRoute,
              protected itemTemplateService: ItemTemplateDataService) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(first(), map((data) => data.collection));
  }

  getCollectionEditUrl(collection: Collection): string {
    return getCollectionEditPath(collection.uuid);
  }

}
