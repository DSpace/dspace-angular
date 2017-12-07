import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CollectionDataService } from '../../core/data/collection-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';

import { fadeIn } from '../../shared/animations/fade';

@Component({
  selector: 'ds-community-page-sub-collection-list',
  styleUrls: ['./community-page-sub-collection-list.component.scss'],
  templateUrl: './community-page-sub-collection-list.component.html',
  animations:[fadeIn]
})
export class CommunityPageSubCollectionListComponent implements OnInit {
  subCollectionsRDObs: Observable<RemoteData<PaginatedList<Collection>>>;

  constructor(private cds: CollectionDataService) {

  }

  ngOnInit(): void {
    this.subCollectionsRDObs = this.cds.findAll();
  }
}
