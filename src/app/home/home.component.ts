import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Collection } from "../core/shared/collection.model";
import { Item } from "../core/shared/item.model";
import { CollectionDataService } from "../core/data/collection-data.service";
import { ItemDataService } from "../core/data/item-data.service";
import { ObjectCacheService } from "../core/cache/object-cache.service";
import { RemoteData } from "../core/data/remote-data";

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  data: any = {};
  collections: RemoteData<Collection[]>;
  items: RemoteData<Item[]>;

  constructor(
    private cds: CollectionDataService,
    private ids: ItemDataService,
    private objectCache: ObjectCacheService
  ) {
    this.universalInit();
  }

  universalInit() {

  }

  ngOnInit(): void {
    this.collections = this.cds.findAll();
    this.items = this.ids.findAll();
    this.cds.findById('5179').payload.subscribe(o => console.log('collection 1', o));
    this.cds.findById('6547').payload.subscribe(o => console.log('collection 2', o));
    this.ids.findById('8871').payload.subscribe(o => console.log('item 1', o));
    this.ids.findById('9978').payload.subscribe(o => console.log('item 2', o));
  }

}
