import { map, mergeMap, take, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';

import { Item } from '../../core/shared/item.model';

import { fadeInOut } from '../../shared/animations/fade';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteData, redirectOn4xx } from '../../core/shared/operators';
import { ViewMode } from '../../core/shared/view-mode.model';
import { AuthService } from '../../core/auth/auth.service';
import { getItemPageRoute } from '../item-page-routing-paths';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { TranslateService } from '@ngx-translate/core';
import { ResearcherProfileService } from '../../core/profile/researcher-profile.service';
import { ResearcherProfile } from '../../core/profile/model/researcher-profile.model';
import { isNotUndefined } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';


/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-item-page',
  styleUrls: ['./item-page.component.scss'],
  templateUrl: './item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class ItemPageComponent implements OnInit {

  /**
   * The item's id
   */
  id: number;

  /**
   * The item wrapped in a remote-data object
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The view-mode we're currently on
   */
  viewMode = ViewMode.StandalonePage;

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;

  /**
   * Whether the current user is an admin or not
   */
  isAdmin$: Observable<boolean>;

  itemUrl: string;

  public claimable$: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);
  public isProcessing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private items: ItemDataService,
    private authService: AuthService,
    private authorizationService: AuthorizationDataService,
    private translate: TranslateService,
    private notificationsService: NotificationsService,
    private researcherProfileService: ResearcherProfileService
  ) { 
    this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>)
    ).subscribe((data: RemoteData<Item>) => {
      this.itemUrl = data?.payload?.self
    });    
  }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService)
    );
    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item))
    );

    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);

    this.authorizationService.isAuthorized(FeatureID.ShowClaimItem, this.itemUrl).pipe(
      take(1)
    ).subscribe((isAuthorized: boolean) => {
      this.claimable$.next(isAuthorized)
    });
  }

  claim() {
    this.isProcessing$.next(true);

    this.authorizationService.isAuthorized(FeatureID.CanClaimItem, this.itemUrl).pipe(
      take(1)
    ).subscribe((isAuthorized: boolean) => {
      if (!isAuthorized) {
        this.notificationsService.warning(this.translate.get('researcherprofile.claim.not-authorized'));
        this.isProcessing$.next(false);
      } else {
        this.createFromExternalSource();
      }
    });

  }

  createFromExternalSource() {
    this.researcherProfileService.createFromExternalSource(this.itemUrl).pipe(
      tap((rd: any) => {
        if (!rd.hasSucceeded) {
          this.isProcessing$.next(false);
        }
      }),
      getFirstSucceededRemoteData(),
      mergeMap((rd: RemoteData<ResearcherProfile>) => {
        return this.researcherProfileService.findRelatedItemId(rd.payload);
      }))
    .subscribe((id: string) => {
      if (isNotUndefined(id)) {
        this.notificationsService.success(this.translate.get('researcherprofile.success.claim.title'),
          this.translate.get('researcherprofile.success.claim.body'));
        this.claimable$.next(false);
        this.isProcessing$.next(false);
      } else {
        this.notificationsService.error(
          this.translate.get('researcherprofile.error.claim.title'),
          this.translate.get('researcherprofile.error.claim.body'));
      }
    });
  }

  isClaimable(): Observable<boolean> {
    return this.claimable$;
  }
}
