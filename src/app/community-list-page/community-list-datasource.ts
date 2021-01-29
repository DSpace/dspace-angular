import { Subscription } from 'rxjs/internal/Subscription';
import { FindListOptions } from '../core/data/request.models';
import { hasValue } from '../shared/empty.util';
import { CommunityListService, FlatNode } from './community-list-service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * DataSource object needed by a CDK Tree to render its nodes.
 * The list of FlatNodes that this DataSource object represents gets created in the CommunityListService at
 *    the beginning (initial page-limited top communities) and re-calculated any time the tree state changes
 *    (a node gets expanded or page-limited result become larger by triggering a show more node)
 */
export class CommunityListDatasource implements DataSource<FlatNode> {

  private communityList$ = new BehaviorSubject<FlatNode[]>([]);
  public loading$ = new BehaviorSubject<boolean>(false);
  private subLoadCommunities: Subscription;

  constructor(private communityListService: CommunityListService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
    return this.communityList$.asObservable();
  }

  loadCommunities(findOptions: FindListOptions, expandedNodes: FlatNode[]) {
    this.loading$.next(true);
    if (hasValue(this.subLoadCommunities)) {
      this.subLoadCommunities.unsubscribe();
    }
    this.subLoadCommunities = this.communityListService.loadCommunities(findOptions, expandedNodes).pipe(
      finalize(() => this.loading$.next(false)),
    ).subscribe((flatNodes: FlatNode[]) => {
      this.communityList$.next(flatNodes);
    });
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.communityList$.complete();
    this.loading$.complete();
  }

}
