import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Data,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../../core/data/remote-data';
import { Community } from '../../../core/shared/community.model';
import { ThemedCollectionPageSubCollectionListComponent } from './sub-collection-list/themed-community-page-sub-collection-list.component';
import { ThemedCommunityPageSubCommunityListComponent } from './sub-community-list/themed-community-page-sub-community-list.component';

@Component({
  selector: 'ds-sub-com-col-section',
  templateUrl: './sub-com-col-section.component.html',
  styleUrls: ['./sub-com-col-section.component.scss'],
  imports: [
    AsyncPipe,
    ThemedCollectionPageSubCollectionListComponent,
    ThemedCommunityPageSubCommunityListComponent,
  ],
  standalone: true,
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
