import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import { SortDirection } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';
import { Collection } from '../core/shared/collection.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteData
} from '../core/shared/operators';
import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { AuthService } from '../core/auth/auth.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getCollectionPageRoute } from './collection-page-routing-paths';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../src/config/app-config.interface';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class CollectionPageComponent implements OnInit {
  collectionRD$: Observable<RemoteData<Collection>>;
  logoRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Whether the current user is a Community admin
   */
  isCollectionAdmin$: Observable<boolean>;

  /**
   * Route to the community page
   */
  collectionPageRoute$: Observable<string>;

  constructor(
    private collectionDataService: CollectionDataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private paginationService: PaginationService,
    private authorizationDataService: AuthorizationDataService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public dsoNameService: DSONameService,
    public searchConfigurationService: SearchConfigurationService,
  ) {
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Collection>),
      redirectOn4xx(this.router, this.authService),
      take(1)
    );
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Collection>),
      redirectOn4xx(this.router, this.authService),
      take(1)
    );
    this.collectionRD$.pipe(getFirstSucceededRemoteData()).subscribe((rd: RemoteData<Collection>) => {
      this.paginationService.updateRoute(this.searchConfigurationService.paginationID, {
        sortField: 'dc.date.accessioned',
        sortDirection: 'DESC' as SortDirection,
        page: 1
      }, { scope: rd.payload.id });
    });
  }

  ngOnInit(): void {

    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      mergeMap((collection: Collection) => collection.logo)
    );
    this.isCollectionAdmin$ = this.authorizationDataService.isAuthorized(FeatureID.IsCollectionAdmin);

    this.collectionPageRoute$ = this.collectionRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((collection) => getCollectionPageRoute(collection.id))
    );
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

}
