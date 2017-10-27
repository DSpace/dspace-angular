import { Component, OnInit } from '@angular/core';

import { CollectionDataService } from '../../core/data/collection-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';

import { fadeIn } from '../../shared/animations/fade';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-community-page-sub-collection-list',
  styleUrls: ['./community-page-sub-collection-list.component.scss'],
  templateUrl: './community-page-sub-collection-list.component.html',
  animations:[fadeIn]
})
export class CommunityPageSubCollectionListComponent implements OnInit {
  subCollectionsRDObs: Observable<RemoteData<Collection[]>>;

  constructor(private cds: CollectionDataService) {

  }

  ngOnInit(): void {
    this.subCollectionsRDObs = this.cds.findAll();
  }
}
