import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { Community } from '../../../core/shared/community.model';
import { ActivatedRoute, Data } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  ThemedCommunityPageSubCommunityListComponent
} from './sub-community-list/themed-community-page-sub-community-list.component';
import {
  ThemedCollectionPageSubCollectionListComponent
} from './sub-collection-list/themed-community-page-sub-collection-list.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ds-sub-com-col-section',
  templateUrl: './sub-com-col-section.component.html',
  styleUrls: ['./sub-com-col-section.component.scss'],
  imports: [
    ThemedCommunityPageSubCommunityListComponent,
    ThemedCollectionPageSubCollectionListComponent,
    AsyncPipe
  ],
  standalone: true
})
export class SubComColSectionComponent implements OnInit {

  community$: Observable<Community>;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.community$ = this.route.parent.data.pipe(
      map((data: Data) => (data.dso as RemoteData<Community>).payload),
    );
  }

}
