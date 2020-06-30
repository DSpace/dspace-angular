import { NgZone } from '@angular/core';
import { FindListOptions } from '../core/data/request.models';
import { CommunityListService, FlatNode } from './community-list-service';
import { CollectionViewer, DataSource } from '@angular/cdk/typings/collections';
import { BehaviorSubject, Observable, } from 'rxjs';
import { finalize, take, } from 'rxjs/operators';

/**
 * DataSource object needed by a CDK Tree to render its nodes.
 * The list of FlatNodes that this DataSource object represents gets created in the CommunityListService at
 *    the beginning (initial page-limited top communities) and re-calculated any time the tree state changes
 *    (a node gets expanded or page-limited result become larger by triggering a show more node)
 */
export class CommunityListDatasource implements DataSource<FlatNode> {

  private communityList$ = new BehaviorSubject<FlatNode[]>([]);
  public loading$ = new BehaviorSubject<boolean>(false);

  constructor(private communityListService: CommunityListService,
              private zone: NgZone) {
  }

  connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
    return this.communityList$.asObservable();
  }

  loadCommunities(findOptions: FindListOptions, expandedNodes: FlatNode[]) {
    this.loading$.next(true);
    this.zone.runOutsideAngular(() => {
      this.communityListService.loadCommunities(findOptions, expandedNodes).pipe(
        take(1),
        finalize(() => this.zone.run(() => this.loading$.next(false))),
      ).subscribe((flatNodes: FlatNode[]) => {
        this.zone.run(() => this.communityList$.next(flatNodes));
      });
    });
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.communityList$.complete();
    this.loading$.complete();
  }

}
