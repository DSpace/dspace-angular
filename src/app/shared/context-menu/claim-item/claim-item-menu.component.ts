import { NotificationsService } from './../../notifications/notifications.service';
import { Router } from '@angular/router';
import { ResearcherProfileService } from './../../../core/profile/researcher-profile.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthorizationDataService } from '../../../../app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../app/core/data/feature-authorization/feature-id';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../app/core/shared/dspace-object.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { getFirstSucceededRemoteData } from '../../../../app/core/shared/operators';
import { mergeMap, switchMap } from 'rxjs/operators';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { ResearcherProfile } from '../../../../app/core/profile/model/researcher-profile.model';
import { isNotUndefined } from '../../empty.util';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { AuthService } from '../../../../app/core/auth/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {EditItemMode} from '../../../core/submission/models/edititem-mode.model';

@Component({
  selector: 'ds-context-menu-claim-item',
  templateUrl: './claim-item-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ClaimItemMenuComponent extends ContextMenuEntryComponent {

  // claimable: BehaviorSubject<Observable<boolean>> =  new BehaviorSubject<Observable<boolean>>(of(false));

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
    private router: Router,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }

  // ngOnInit() {
  //   this.claimable.next(this.authorizationService.isAuthorized(FeatureID.CanClaimItem, this.contextMenuObject.self));
  // }

  claim() {

    this.researcherProfileService.createFromExternalSource(this.injectedContextMenuObject.self)
      .pipe(
        getFirstSucceededRemoteData(),
        mergeMap((rd: RemoteData<ResearcherProfile>) => {
          return this.researcherProfileService.findRelatedItemId(rd.payload);
        }))
      .subscribe((id: string) => {
        if (isNotUndefined(id)) {
          this.notificationsService.success(this.translate.get('researcherprofile.success.claim.title'),
            this.translate.get('researcherprofile.success.claim.body'));
          window.location.reload();
          // this.router.navigateByUrl('/items/' + id);
        } else {
          this.notificationsService.error(
            this.translate.get('researcherprofile.error.claim.title'),
            this.translate.get('researcherprofile.error.claim.body'));
        }
      });

  }

  isClaimable(): Observable<boolean> {
    // return this.claimable.getValue();
    return this.authorizationService.isAuthorized(FeatureID.CanClaimItem, this.contextMenuObject.self);
  }

}
