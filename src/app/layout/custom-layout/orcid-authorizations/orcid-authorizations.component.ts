import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../../../../app/shared/notifications/notifications.service';
import { environment } from '../../../../environments/environment';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { ResearcherProfileService } from '../../../core/profile/researcher-profile.service';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../enums/layout-box.enum';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';

@Component({
  selector: 'ds-orcid-authorizations.component',
  templateUrl: './orcid-authorizations.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.ORCID, LayoutBox.ORCID_AUTHORIZATIONS)
export class OrcidAuthorizationsComponent extends CrisLayoutBoxObj implements OnInit {

  missingAuthorizations$ = new BehaviorSubject<string[]>([]);

  unlinkProcessing = false;

  constructor(
    private configurationService: ConfigurationDataService,
    private researcherProfileService: ResearcherProfileService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private router: Router,
    @Inject(NativeWindowService) private _window: NativeWindowRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    const scopes = this.getOrcidAuthorizations();
    return this.configurationService.findByPropertyName('orcid.scope')
    .pipe(getFirstSucceededRemoteDataPayload(),
          map((configurationProperty) => configurationProperty.values),
          map((allScopes) => allScopes.filter( (scope) => !scopes.includes(scope))))
    .subscribe((missingScopes) => this.missingAuthorizations$.next(missingScopes));
  }

  getOrcidAuthorizations(): string[] {
    return this.item.allMetadataValues('cris.orcid.scope');
  }

  isLinkedToOrcid(): boolean {
    return this.researcherProfileService.isLinkedToOrcid(this.item);
  }

  getAuthorizationDescription(scope: string) {
    return 'person.page.orcid.scope.' + scope.substring(1).replace('/','-');
  }

  onlyAdminCanDisconnectProfileFromOrcid(): Observable<boolean> {
    return this.researcherProfileService.onlyAdminCanDisconnectProfileFromOrcid();
  }

  ownerCanDisconnectProfileFromOrcid(): Observable<boolean> {
    return this.researcherProfileService.ownerCanDisconnectProfileFromOrcid();
  }

  linkOrcid(): void {
    combineLatest(
      this.configurationService.findByPropertyName('orcid.authorize-url').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid.application-client-id').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid.scope').pipe(getFirstSucceededRemoteDataPayload())
    ).subscribe(([authorizeUrl, clientId, scopes]) => {
      const redirectUri = environment.rest.baseUrl + '/api/cris/orcid/' + this.item.id + '/?url=' + encodeURIComponent(this.router.url);
      const orcidUrl = authorizeUrl.values[0] + '?client_id=' + clientId.values[0]   + '&redirect_uri=' + redirectUri + '&response_type=code&scope='
      + scopes.values.join(' ');
      this._window.nativeWindow.location.href = orcidUrl;
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
