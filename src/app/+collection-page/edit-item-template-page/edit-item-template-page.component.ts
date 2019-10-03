import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { Item } from '../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'ds-edit-item-template-page',
  templateUrl: './edit-item-template-page.component.html',
})
export class EditItemTemplatePageComponent implements OnInit {
  collectionRD$: Observable<RemoteData<Collection>>;
  itemRD$: Observable<RemoteData<Item>>;

  constructor(protected route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.parent.data.pipe(first(), map((data) => data.collection));
    this.itemRD$ = this.route.parent.data.pipe(first(), map((data) => data.item));
  }

}
