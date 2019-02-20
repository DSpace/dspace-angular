import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  find,
  flatMap,
  map,
  mergeMap,
  reduce,
  startWith
} from 'rxjs/operators';

import { Collection } from '../../../core/shared/collection.model';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { Community } from '../../../core/shared/community.model';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { getSucceededRemoteData } from '../../../core/shared/operators';

interface CollectionListEntryItem {
  id: string;
  name: string;
}

interface CollectionListEntry {
  communities: CollectionListEntryItem[],
  collection: CollectionListEntryItem
}

@Component({
  selector: 'ds-collection-selector',
  // styleUrls: ['./collection-selector.component.scss'],
  templateUrl: './collection-selector.component.html'
})
export class CollectionSelectorComponent implements OnChanges {
  @Input() currentCollectionId: string;

  public disabled$ = new BehaviorSubject<boolean>(true);
  public model: any;
  public searchField: FormControl = new FormControl();
  public searchListCollection$: Observable<CollectionListEntry[]>;
  public selectedCollectionId: string;
  public selectedCollectionName$: Observable<string>;

  private subs: Subscription[] = [];

  constructor(private communityDataService: CommunityDataService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.currentCollectionId)
      && hasValue(changes.currentCollectionId.currentValue)) {
      this.selectedCollectionId = this.currentCollectionId;

      // @TODO replace with search/top browse endpoint
      // @TODO implement community/subcommunity hierarchy
      const communities$ = this.communityDataService.findAll().pipe(
        find((communities: RemoteData<PaginatedList<Community>>) => isNotEmpty(communities.payload)),
        mergeMap((communities: RemoteData<PaginatedList<Community>>) => communities.payload.page));
      communities$.subscribe((t) => {console.log('communities', t)});
    //   const listCollection$ = communities$.pipe(
    //     flatMap((communityData: Community) => {
    //       return communityData.collections.pipe(
    //         getSucceededRemoteData(),
    //         mergeMap((collections: RemoteData<PaginatedList<Collection>>) => collections.payload.page),
    //         filter((collectionData: Collection) => isNotEmpty(collectionData)),
    //         map((collectionData: Collection) => ({
    //           communities: [{ id: communityData.id, name: communityData.name }],
    //           collection: { id: collectionData.id, name: collectionData.name }
    //         }))
    //       );
    //     }),
    //     reduce((acc: any, value: any) => [...acc, ...value], []),
    //     startWith([])
    //   );
    //
    //   this.selectedCollectionName$ = communities$.pipe(
    //     flatMap((communityData: Community) => {
    //       return communityData.collections.pipe(
    //         getSucceededRemoteData(),
    //         mergeMap((collections: RemoteData<PaginatedList<Collection>>) => collections.payload.page),
    //         filter((collectionData: Collection) => isNotEmpty(collectionData)),
    //         filter((collectionData: Collection) => collectionData.id === this.selectedCollectionId),
    //         map((collectionData: Collection) => collectionData.name)
    //       );
    //     }),
    //     startWith('')
    //   );
    //
    //   const searchTerm$ = this.searchField.valueChanges.pipe(
    //     debounceTime(200),
    //     distinctUntilChanged(),
    //     startWith('')
    //   );
    //
    //   this.searchListCollection$ = combineLatest(searchTerm$, listCollection$).pipe(
    //     map(([searchTerm, listCollection]) => {
    //       this.disabled$.next(isEmpty(listCollection));
    //       if (isEmpty(searchTerm)) {
    //         return listCollection;
    //       } else {
    //         return listCollection.filter((v) => v.collection.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1).slice(0, 5)
    //       }
    //     }));
    }
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  onSelect(event) {
    this.searchField.reset();
    this.disabled$.next(true);
  }

  onClose() {
    this.searchField.reset();
  }
}
