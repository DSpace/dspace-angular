import { NotificationsService } from './../../notifications/notifications.service';
import { ResearcherProfileService } from './../../../core/profile/researcher-profile.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthorizationDataService } from '../../../../app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../app/core/data/feature-authorization/feature-id';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../app/core/shared/dspace-object.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { getFirstSucceededRemoteData } from '../../../../app/core/shared/operators';
import {mergeMap, take} from 'rxjs/operators';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { ResearcherProfile } from '../../../../app/core/profile/model/researcher-profile.model';
import { isNotUndefined } from '../../empty.util';
import {BehaviorSubject, Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ds-context-menu-claim-item',
  templateUrl: './claim-item-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ClaimItemMenuComponent extends ContextMenuEntryComponent implements OnInit {

  public claimable$: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);
  public isProcessing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private researcherProfileService: ResearcherProfileService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }

  ngOnInit() {
    this.authorizationService.isAuthorized(FeatureID.ShowClaimItem, this.contextMenuObject.self).pipe(
      take(1)
    ).subscribe((isAuthorized: boolean) => (this.claimable$.next(isAuthorized)));
  }

  claim() {
    this.isProcessing$.next(true);

    this.authorizationService.isAuthorized(FeatureID.CanClaimItem, this.contextMenuObject.self).pipe(
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
    this.researcherProfileService.createFromExternalSource(this.injectedContextMenuObject.self).pipe(
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
