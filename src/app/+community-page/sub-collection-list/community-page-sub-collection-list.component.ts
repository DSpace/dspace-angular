import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';

import { fadeIn } from '../../shared/animations/fade';
import { PaginatedList } from '../../core/data/paginated-list';

@Component({
  selector: 'ds-community-page-sub-collection-list',
  styleUrls: ['./community-page-sub-collection-list.component.scss'],
  templateUrl: './community-page-sub-collection-list.component.html',
  animations:[fadeIn]
})
export class CommunityPageSubCollectionListComponent implements OnInit {
  @Input() community: Community;
  subCollectionsRDObs: Observable<RemoteData<PaginatedList<Collection>>>;

  ngOnInit(): void {
    this.subCollectionsRDObs = this.community.collections;
  }
}
