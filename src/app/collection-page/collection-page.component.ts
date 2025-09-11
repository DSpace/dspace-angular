import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  AuthService,
  DSONameService,
  SortOptions,
  AuthorizationDataService,
  FeatureID,
  RemoteData,
  PaginationComponentOptions,
  getCollectionPageRoute,
  redirectOn4xx,
  Bitstream,
  Collection,
  getAllSucceededRemoteDataPayload,
} from '@dspace/core'
import { hasValue, isNotEmpty } from '@dspace/utils';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import {
  ThemedComcolPageBrowseByComponent,
} from '../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import {
  ThemedComcolPageContentComponent,
} from '../shared/comcol/comcol-page-content/themed-comcol-page-content.component';
import {
  ThemedComcolPageHandleComponent,
} from '../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import {
  ComcolPageHeaderComponent,
} from '../shared/comcol/comcol-page-header/comcol-page-header.component';
import {
  ComcolPageLogoComponent,
} from '../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ErrorComponent } from '../shared/error/error.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { VarDirective } from '../shared/utils/var.directive';

@Component({
  selector: 'ds-base-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    DsoEditMenuComponent,
    ErrorComponent,
    RouterOutlet,
    ThemedComcolPageBrowseByComponent,
    ThemedComcolPageContentComponent,
    ThemedComcolPageHandleComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class CollectionPageComponent implements OnInit {
  collectionRD$: Observable<RemoteData<Collection>>;
  logoRD$: Observable<RemoteData<Bitstream>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;

  /**
   * Whether the current user is a Community admin
   */
  isCollectionAdmin$: Observable<boolean>;

  /**
   * Route to the community page
   */
  collectionPageRoute$: Observable<string>;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected authService: AuthService,
    protected authorizationDataService: AuthorizationDataService,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Collection>),
      redirectOn4xx(this.router, this.authService),
      take(1),
    );
    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      mergeMap((collection: Collection) => collection.logo),
    );
    this.isCollectionAdmin$ = this.authorizationDataService.isAuthorized(FeatureID.IsCollectionAdmin);

    this.collectionPageRoute$ = this.collectionRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((collection) => getCollectionPageRoute(collection.id)),
    );
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }


}
