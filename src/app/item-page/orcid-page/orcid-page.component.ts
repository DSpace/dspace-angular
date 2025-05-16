import {
  CommonModule,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import {
  filter,
  map,
  take,
} from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { OrcidAuthService } from '../../core/orcid/orcid-auth.service';
import { ResearcherProfile } from '../../core/profile/model/researcher-profile.model';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { Item } from '../../core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';
import { isNotEmpty } from '../../shared/empty.util';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { getItemPageRoute } from '../item-page-routing-paths';
import { OrcidAuthComponent } from './orcid-auth/orcid-auth.component';
import { OrcidQueueComponent } from './orcid-queue/orcid-queue.component';
import { OrcidSyncSettingsComponent } from './orcid-sync-settings/orcid-sync-settings.component';

/**
 * A component that represents the orcid settings page
 */
@Component({
  selector: 'ds-orcid-page',
  templateUrl: './orcid-page.component.html',
  styleUrls: ['./orcid-page.component.scss'],
  imports: [
    AlertComponent,
    CommonModule,
    OrcidAuthComponent,
    OrcidQueueComponent,
    OrcidSyncSettingsComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class OrcidPageComponent implements OnInit {
  protected readonly AlertType = AlertType;

  /**
   * A boolean representing if the connection operation with orcid profile is in progress
   */
  connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The item for which showing the orcid settings
   */
  item: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * The item id for which showing the orcid settings
   */
  itemId: string;

  /**
   * A boolean representing if the connection operation with orcid profile is in progress
   */
  processingConnection: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService,
    private itemService: ItemDataService,
    private orcidAuthService: OrcidAuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  /**
   * Retrieve the item for which showing the orcid settings
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const codeParam$ = this.route.queryParamMap.pipe(
        take(1),
        map((paramMap: ParamMap) => paramMap.get('code')),
      );

      const item$ = this.route.data.pipe(
        map((data) => data.dso as RemoteData<Item>),
        redirectOn4xx(this.router, this.authService),
        getFirstSucceededRemoteDataPayload(),
      );

      combineLatest([codeParam$, item$]).subscribe(([codeParam, item]) => {
        this.itemId = item.id;
        /**
         * Check if code is present in the query param. If so it means this page is loaded after attempting to
         * link the person to the ORCID profile, otherwise the person is already linked to ORCID profile
         */
        if (isNotEmpty(codeParam)) {
          this.linkProfileToOrcid(item, codeParam);
        } else {
          this.item.next(item);
          this.processingConnection.next(false);
          this.connectionStatus.next(true);
        }
      });
    }
  }

  /**
   * Check if the current item is linked to an ORCID profile.
   *
   * @returns the check result
   */
  isLinkedToOrcid(): boolean {
    return this.orcidAuthService.isLinkedToOrcid(this.item.value);
  }

  /**
   * Get the route to an item's page
   */
  getItemPage(): string {
    return getItemPageRoute(this.item.value);
  }

  /**
   * Retrieve the updated profile item
   */
  updateItem(): void {
    this.clearRouteParams();
    this.itemService.findById(this.itemId, false).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((itemRD: RemoteData<Item>) => {
      if (itemRD.hasSucceeded) {
        this.item.next(itemRD.payload);
      }
    });
  }

  /**
   * Link person item to ORCID profile by using the code received after redirect from ORCID.
   *
   * @param person The person item to link to ORCID profile
   * @param code The auth-code received from ORCID
   */
  private linkProfileToOrcid(person: Item, code: string) {
    this.orcidAuthService.linkOrcidByItem(person, code).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((profileRD: RemoteData<ResearcherProfile>) => {
      this.processingConnection.next(false);
      if (profileRD.hasSucceeded) {
        this.connectionStatus.next(true);
        this.updateItem();
      } else {
        this.item.next(person);
        this.connectionStatus.next(false);
        this.clearRouteParams();
      }
    });
  }

  /**
   * Update route removing the code from query params
   * @private
   */
  private clearRouteParams(): void {
    // update route removing the code from query params
    this.route.queryParamMap
      .pipe(
        filter((paramMap: ParamMap) => isNotEmpty(paramMap.keys)),
        map(_ => Object.assign({})),
        take(1),
      ).subscribe(queryParams =>
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams,
          },
        ),
      );
  }

}
