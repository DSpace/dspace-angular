import {Component, OnInit} from '@angular/core';
import { ItemComponent } from '../../../../item-page/simple/item-types/shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import {MetadataValue} from '../../../../core/shared/metadata.models';
import {FeatureID} from '../../../../core/data/feature-authorization/feature-id';
import {mergeMap, take} from 'rxjs/operators';
import {getFirstSucceededRemoteData} from '../../../../core/shared/operators';
import {RemoteData} from '../../../../core/data/remote-data';
import {ResearcherProfile} from '../../../../core/profile/model/researcher-profile.model';
import {isNotUndefined} from '../../../../shared/empty.util';
import {BehaviorSubject, Observable} from 'rxjs';
import {RouteService} from '../../../../core/services/route.service';
import {AuthorizationDataService} from '../../../../core/data/feature-authorization/authorization-data.service';
import {ResearcherProfileService} from '../../../../core/profile/researcher-profile.service';
import {NotificationsService} from '../../../../shared/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';

@listableObjectComponent('Person', ViewMode.StandalonePage)
@Component({
  selector: 'ds-person',
  styleUrls: ['./person.component.scss'],
  templateUrl: './person.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Person
 */
export class PersonComponent extends ItemComponent implements OnInit {

  claimable$: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);

  constructor(protected routeService: RouteService,
              protected authorizationService: AuthorizationDataService,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected researcherProfileService: ResearcherProfileService) {
    super(routeService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.authorizationService.isAuthorized(FeatureID.CanClaimItem, this.object._links.self.href).pipe(
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
      getFirstSucceededRemoteData(),
      mergeMap((rd: RemoteData<ResearcherProfile>) => {
        return this.researcherProfileService.findRelatedItemId(rd.payload);
      }))
      .subscribe((id: string) => {
        if (isNotUndefined(id)) {
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

  /**
   * Returns the metadata values to be used for the page title.
   */
  getTitleMetadataValues(): MetadataValue[]{
    const metadataValues = [];
    const familyName = this.object?.firstMetadata('person.familyName');
    const givenName = this.object?.firstMetadata('person.givenName');
    const title = this.object?.firstMetadata('dc.title');
    if (familyName){
      metadataValues.push(familyName);
    }
    if (givenName){
      metadataValues.push(givenName);
    }
    if (metadataValues.length === 0 && title){
      metadataValues.push(title);
    }
    return metadataValues;
  }

}
