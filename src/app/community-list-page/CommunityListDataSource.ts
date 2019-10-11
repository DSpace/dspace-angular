import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { CommunityListService } from './CommunityListService';
import { CollectionViewer, DataSource } from '@angular/cdk/typings/collections';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  take,
} from 'rxjs/operators';
import { Community } from '../core/shared/community.model';
import { Collection } from '../core/shared/collection.model';

export interface FlatNode {
  isExpandable: boolean;
  name: string;
  id: string;
  level: number;
  isExpanded?: boolean;
  parent?: FlatNode;
  payload: Community | Collection;
}

const combineAndFlatten = (obsList: Array<Observable<FlatNode[]>>) =>
  observableCombineLatest(...obsList).pipe(
    map((matrix: FlatNode[][]) =>
      matrix.reduce((combinedList, currentList: FlatNode[]) => [...combinedList, ...currentList]))
  );

const toFlatNode = (
  c: Community | Collection,
  level: number,
  isExpanded: boolean,
  parent?: FlatNode
): FlatNode => ({
  isExpandable: c instanceof Community,
  name: c.name,
  id: c.id,
  level: level,
  isExpanded,
  parent,
  payload: c,
});

export class CommunityListDataSource implements DataSource<FlatNode> {

  private communityList$ = new BehaviorSubject<FlatNode[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private communityListService: CommunityListService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
    return this.communityList$.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.communityList$.complete();
    this.loading$.complete();
  }

  loadCommunities(expandedNodes: FlatNode[]): void {
    this.loading$.next(true);

    this.communityListService.communities$
      .pipe(
        take(1),
        switchMap((result: Community[]) => {
          return this.transformListOfCommunities(result, 0, null, expandedNodes);
        }),
        catchError(() => observableOf([])),
        finalize(() => this.loading$.next(false)),
      ).subscribe((flatNodes: FlatNode[]) => this.communityList$.next(flatNodes));
  };

  private transformListOfCommunities(listOfCommunities: Community[],
                                     level: number,
                                     parent: FlatNode,
                                     expandedNodes: FlatNode[]): Observable<FlatNode[]> {
    if (isNotEmpty(listOfCommunities)) {
      const obsList = listOfCommunities
        .map((community: Community) =>
          this.transformCommunity(community, level, parent, expandedNodes));

      return combineAndFlatten(obsList);
    } else {
      return observableOf([]);
    }
  }

  private transformCommunity(community: Community, level: number, parent: FlatNode, expandedNodes: FlatNode[]): Observable<FlatNode[]> {
    let isExpanded = false;
    if (isNotEmpty(expandedNodes)) {
      isExpanded = hasValue(expandedNodes.find((node) => (node.id === community.id)));
    }

    const communityFlatNode = toFlatNode(community, level, isExpanded, parent);

    let obsList = [observableOf([communityFlatNode])];

    if (isExpanded) {
      const subCommunityNodes$ = community.subcommunities.pipe(
        filter((rd: RemoteData<PaginatedList<Community>>) => rd.hasSucceeded),
        take(1),
        switchMap((rd: RemoteData<PaginatedList<Community>>) =>
          this.transformListOfCommunities(rd.payload.page, level + 1, communityFlatNode, expandedNodes))
      );

      obsList = [...obsList, subCommunityNodes$];

      const collectionNodes$ = community.collections.pipe(
        filter((rd: RemoteData<PaginatedList<Collection>>) => rd.hasSucceeded),
        take(1),
        map((rd: RemoteData<PaginatedList<Collection>>) =>
          rd.payload.page
            .map((collection: Collection) => toFlatNode(collection, level + 1, false, parent))
        )
      );

      obsList = [...obsList, collectionNodes$];
    }

    return combineAndFlatten(obsList);
  }

}
