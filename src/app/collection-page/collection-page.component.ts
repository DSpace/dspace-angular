import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Collection } from "../core/shared/collection.model";
import { Bitstream } from "../core/shared/bitstream.model";
import { RemoteData } from "../core/data/remote-data";
import { CollectionDataService } from "../core/data/collection-data.service";

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.css'],
  templateUrl: './collection-page.component.html',
})
export class CollectionPageComponent implements OnInit {
  collectionData: RemoteData<Collection>;
  logoData: RemoteData<Bitstream>;

  constructor(
    private collectionDataService: CollectionDataService,
    private route: ActivatedRoute
  ) {
    this.universalInit();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.collectionData = this.collectionDataService.findById(params['id'])
      this.collectionData.payload
        .subscribe(collection => this.logoData = collection.logo);
    });
  }

  universalInit() {
  }
}
