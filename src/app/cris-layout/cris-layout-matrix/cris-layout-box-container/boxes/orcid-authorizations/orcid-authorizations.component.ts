import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { ConfigurationDataService } from '../../../../../core/data/configuration-data.service';
import { ResearcherProfileService } from '../../../../../core/profile/researcher-profile.service';
import { NativeWindowRef, NativeWindowService } from '../../../../../core/services/window.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';

@Component({
  selector: 'ds-orcid-authorizations.component',
  templateUrl: './orcid-authorizations.component.html'
})
@RenderCrisLayoutBoxFor(LayoutBox.ORCID_AUTHORIZATIONS,true)
export class OrcidAuthorizationsComponent extends CrisLayoutBoxModelComponent implements OnInit {

  missingAuthorizations$ = new BehaviorSubject<string[]>([]);

  unlinkProcessing = false;

  constructor(
    private configurationService: ConfigurationDataService,
    private researcherProfileService: ResearcherProfileService,
    protected translateService: TranslateService,
    private notificationsService: NotificationsService,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    super.ngOnInit();

    const scopes = this.getOrcidAuthorizations();
    return this.configurationService.findByPropertyName('orcid.scope')
      .pipe(getFirstSucceededRemoteDataPayload(),
        map((configurationProperty) => configurationProperty.values),
        map((allScopes) => allScopes.filter((scope) => !scopes.includes(scope))))
      .subscribe((missingScopes) => this.missingAuthorizations$.next(missingScopes));
  }

  getOrcidAuthorizations(): string[] {
    return this.item.allMetadataValues('cris.orcid.scope');
  }

  isLinkedToOrcid(): boolean {
    return this.researcherProfileService.isLinkedToOrcid(this.item);
  }

  getOrcidNotLinkedMessage(): Observable<string> {
    const orcid = this.item.firstMetadataValue('person.identifier.orcid');
    if (orcid) {
      return this.translateService.get('person.page.orcid.orcid-not-linked-message', { 'orcid': orcid });
    } else {
      return this.translateService.get('person.page.orcid.no-orcid-message');
    }
  }

  getAuthorizationDescription(scope: string) {
    return 'person.page.orcid.scope.' + scope.substring(1).replace('/', '-');
  }

  onlyAdminCanDisconnectProfileFromOrcid(): Observable<boolean> {
    return this.researcherProfileService.onlyAdminCanDisconnectProfileFromOrcid();
  }

  ownerCanDisconnectProfileFromOrcid(): Observable<boolean> {
    return this.researcherProfileService.ownerCanDisconnectProfileFromOrcid();
  }

  linkOrcid(): void {
    this.researcherProfileService.getOrcidAuthorizeUrl(this.item).subscribe((authorizeUrl) => {
      this._window.nativeWindow.location.href = authorizeUrl;
    });
  }

  unlinkOrcid(): void {
    this.unlinkProcessing = true;
    this.researcherProfileService.unlinkOrcid(this.item).subscribe((remoteData) => {
      this.unlinkProcessing = false;
      if (remoteData.isSuccess) {
        this.notificationsService.success(this.translateService.get('person.page.orcid.unlink.success'));
        this.refreshTab.emit();
      } else {
        this.notificationsService.error(this.translateService.get('person.page.orcid.unlink.error'));
      }
    });
  }

}
