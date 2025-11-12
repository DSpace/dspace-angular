import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';
import { getCollectionPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  first,
  map,
  switchMap,
  toArray,
} from 'rxjs/operators';
import { Collection } from 'src/app/core/shared/collection.model';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { RemoteData } from '../../../core/data/remote-data';
import { getAllSucceededRemoteDataPayload } from '../../../core/shared/operators';
import {
  fadeIn,
  fadeInOut,
} from '../../../shared/animations/fade';
import { getCollectionEditRoute } from '../../collection-page-routing-paths';
import { CollectionOperationComponent } from '../collection-operation/collection-operation.component';
import { CollectionOperation } from '../collection-operation/collectionOperation.model';

@Component({
  selector: 'ds-base-collection-status',
  templateUrl: './collection-status.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    AsyncPipe,
    CollectionOperationComponent,
    NgClass,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component for displaying a collection's status
 */
export class CollectionStatusComponent implements OnInit, OnDestroy {

  /**
   * The collection remote data
   */
  collectionRD$: Observable<RemoteData<Collection>>;

  /**
   * The data to show in the status
   */
  statusData: any;

  /**
   * The keys of the data (to loop over)
   */
  statusDataKeys: string[];

  /**
   * The possible actions that can be performed on the collection
   */
  operations$: BehaviorSubject<CollectionOperation[]> = new BehaviorSubject<CollectionOperation[]>([]);

  /**
   * Subscriptions
   */
  public subs: Subscription[] = [];

  /**
   * Route to the collection's page
   */
  collectionPageRoute$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private authorizationService: AuthorizationDataService,
  ) {}

  /**
   * Initialise component
   */
  ngOnInit(): void {
    this.collectionRD$ = this.route.parent.data.pipe(map((data) => data.dso));
    this.collectionRD$.pipe(
      first(),
      map((data: RemoteData<Collection>) => data.payload),
      switchMap((collection: Collection) => {
        this.statusData = {
          id: collection.id,
          handle: collection.handle,
          name: collection.name,
        };
        this.statusDataKeys = Object.keys(this.statusData);

        // Base operations for collections
        const currentUrl = this.getCurrentUrl(collection);
        const initialOperations: CollectionOperation[] = [
          new CollectionOperation('move', `${currentUrl}/move`, FeatureID.CanMove, true, true),
          new CollectionOperation('delete', `${currentUrl}/delete`, FeatureID.CanDelete, true),
        ];
        this.operations$.next(initialOperations);

        // Filter operations by authorization
        return initialOperations.map((op) =>
          this.authorizationService.isAuthorized(op.featureID, collection.self).pipe(
            distinctUntilChanged(),
            map((authorized) => {
              op.setDisabled(!authorized);
              op.setAuthorized(authorized);
              return op;
            }),
          ),
        );
      }),
      concatMap((ops) => ops), // flatten
      toArray(),
    ).subscribe((ops) => this.operations$.next(ops));

    this.collectionPageRoute$ = this.collectionRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((collection) => getCollectionPageRoute(collection.id)),
    );
  }

  /**
   * Get the current url without query params
   */
  getCurrentUrl(collection: Collection): string {
    return getCollectionEditRoute(collection.id);
  }

  trackOperation(index: number, operation: CollectionOperation) {
    return hasValue(operation) ? operation.operationKey : undefined;
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
