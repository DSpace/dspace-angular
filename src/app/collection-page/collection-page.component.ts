import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Collection } from "../core/shared/collection.model";
import { Bitstream } from "../core/shared/bitstream.model";
import { RemoteData } from "../core/data/remote-data";
import { CollectionDataService } from "../core/data/collection-data.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.css'],
  templateUrl: './collection-page.component.html',
})
export class CollectionPageComponent implements OnInit, OnDestroy {
  collectionData: RemoteData<Collection>;
  logoData: RemoteData<Bitstream>;
  private subs: Subscription[] = [];

  constructor(
    private collectionDataService: CollectionDataService,
    private route: ActivatedRoute
  ) {
    this.universalInit();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.collectionData = this.collectionDataService.findById(params['id']);
      this.subs.push(this.collectionData.payload
        .subscribe(collection => this.logoData = collection.logo));
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  universalInit() {
  }
}
