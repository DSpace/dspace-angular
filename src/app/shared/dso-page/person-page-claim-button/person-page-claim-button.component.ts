import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { RouteService } from '../../../core/services/route.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { ResearcherProfileDataService } from '../../../core/profile/researcher-profile-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { ResearcherProfile } from '../../../core/profile/model/researcher-profile.model';
import { isNotEmpty } from '../../empty.util';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-person-page-claim-button',
  templateUrl: './person-page-claim-button.component.html',
  styleUrls: ['./person-page-claim-button.component.scss']
})
export class PersonPageClaimButtonComponent implements OnInit {

  /**
   * The target person item to claim
   */
  @Input() object: DSpaceObject;

  /**
   * A boolean representing if item can be claimed or not
   */
  claimable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(protected routeService: RouteService,
              protected authorizationService: AuthorizationDataService,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected researcherProfileService: ResearcherProfileDataService) {
  }

  ngOnInit(): void {
    this.authorizationService.isAuthorized(FeatureID.CanClaimItem, this.object._links.self.href, null, false).pipe(
      take(1)
    ).subscribe((isAuthorized: boolean) => {
      this.claimable$.next(isAuthorized);
    });

  }

  /**
   * Create a new researcher profile claiming the current item.
   */
  claim() {
    this.researcherProfileService.createFromExternalSource(this.object._links.self.href).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((rd: RemoteData<ResearcherProfile>) => {
        if (rd.hasSucceeded) {
          return this.researcherProfileService.findRelatedItemId(rd.payload);
        } else {
          return observableOf(null);
        }
      }))
      .subscribe((id: string) => {
        if (isNotEmpty(id)) {
          this.notificationsService.success(this.translate.get('researcherprofile.success.claim.title'),
            this.translate.get('researcherprofile.success.claim.body'));
          this.claimable$.next(false);
        } else {
          this.notificationsService.error(
            this.translate.get('researcherprofile.error.claim.title'),
            this.translate.get('researcherprofile.error.claim.body'));
        }
      });
  }

  /**
   * Returns true if the item is claimable, false otherwise.
   */
  isClaimable(): Observable<boolean> {
    return this.claimable$;
  }

}
