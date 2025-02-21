import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { hasValue } from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';

import { AuthService } from '@dspace/core';
import { DSONameService } from '@dspace/core';
import { AuthorizationDataService } from '@dspace/core';
import { FeatureID } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { redirectOn4xx } from '@dspace/core';
import { Bitstream } from '@dspace/core';
import { Community } from '@dspace/core';
import { getAllSucceededRemoteDataPayload } from '@dspace/core';
import { fadeInOut } from '../shared/animations/fade';
import { ThemedComcolPageBrowseByComponent } from '../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ThemedComcolPageContentComponent } from '../shared/comcol/comcol-page-content/themed-comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ErrorComponent } from '../shared/error/error.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { VarDirective } from '../shared/utils/var.directive';
import { ViewTrackerComponent } from '../statistics/angulartics/dspace/view-tracker.component';
import { getCommunityPageRoute } from './community-page-routing-paths';
import { ThemedCollectionPageSubCollectionListComponent } from './sections/sub-com-col-section/sub-collection-list/themed-community-page-sub-collection-list.component';
import { ThemedCommunityPageSubCommunityListComponent } from './sections/sub-com-col-section/sub-community-list/themed-community-page-sub-community-list.component';

@Component({
  selector: 'ds-base-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  imports: [
    ThemedComcolPageContentComponent,
    ErrorComponent,
    ThemedLoadingComponent,
    TranslateModule,
    ThemedCommunityPageSubCommunityListComponent,
    ThemedCollectionPageSubCollectionListComponent,
    ThemedComcolPageBrowseByComponent,
    DsoEditMenuComponent,
    ThemedComcolPageHandleComponent,
    ComcolPageLogoComponent,
    ComcolPageHeaderComponent,
    AsyncPipe,
    ViewTrackerComponent,
    VarDirective,
    RouterOutlet,
    RouterModule,
  ],
  standalone: true,
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent implements OnInit {
  /**
   * The community displayed on this page
   */
  communityRD$: Observable<RemoteData<Community>>;

  /**
   * Whether the current user is a Community admin
   */
  isCommunityAdmin$: Observable<boolean>;

  /**
   * The logo of this community
   */
  logoRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Route to the community page
   */
  communityPageRoute$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authorizationDataService: AuthorizationDataService,
    public dsoNameService: DSONameService,
  ) {

  }

  ngOnInit(): void {
    this.communityRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
    );
    this.logoRD$ = this.communityRD$.pipe(
      map((rd: RemoteData<Community>) => rd.payload),
      filter((community: Community) => hasValue(community)),
      mergeMap((community: Community) => community.logo));
    this.communityPageRoute$ = this.communityRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((community) => getCommunityPageRoute(community.id)),
    );
    this.isCommunityAdmin$ = this.authorizationDataService.isAuthorized(FeatureID.IsCommunityAdmin);
  }
}
