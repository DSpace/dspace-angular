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
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { Bitstream } from '../core/shared/bitstream.model';
import { Community } from '../core/shared/community.model';
import { getAllSucceededRemoteDataPayload } from '../core/shared/operators';
import { fadeInOut } from '../shared/animations/fade';
import { ThemedComcolPageBrowseByComponent } from '../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ThemedComcolPageContentComponent } from '../shared/comcol/comcol-page-content/themed-comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { hasValue } from '../shared/empty.util';
import { ErrorComponent } from '../shared/error/error.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { VarDirective } from '../shared/utils/var.directive';
import { getCommunityPageRoute } from './community-page-routing-paths';

@Component({
  selector: 'ds-base-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  imports: [
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    DsoEditMenuComponent,
    ErrorComponent,
    RouterModule,
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
