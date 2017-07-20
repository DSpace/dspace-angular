import { Component, OnInit } from '@angular/core';

import { CollectionDataService } from '../../core/data/collection-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';

@Component({
  selector: 'ds-community-page-sub-collection-list',
  styleUrls: ['./community-page-sub-collection-list.component.scss'],
  templateUrl: './community-page-sub-collection-list.component.html',
})
export class CommunityPageSubCollectionListComponent implements OnInit {
  subCollections: RemoteData<Collection[]>;

  constructor(private cds: CollectionDataService) {

  }

  ngOnInit(): void {
    this.subCollections = this.cds.findAll();
  }
}
