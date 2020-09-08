import { Component, Inject, OnInit } from '@angular/core';
import { LayoutPage } from '../enums/layout-page.enum';
import { LayoutTab } from '../enums/layout-tab.enum';
import { LayoutBox } from '../enums/layout-box.enum';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { CrisLayoutBox } from 'src/app/layout/decorators/cris-layout-box.decorator';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { combineLatest, Observable } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { Router } from '@angular/router';
import { NativeWindowService, NativeWindowRef } from 'src/app/core/services/window.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-orcid-sync-settings.component',
  templateUrl: './orcid-sync-settings.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.ORCID, LayoutBox.ORCID_SYNC_SETTINGS)
export class OrcidSyncSettingsComponent extends CrisLayoutBoxObj implements OnInit {

  constructor(
    private configurationService: ConfigurationDataService,
    private router: Router,
    @Inject(NativeWindowService) private _window: NativeWindowRef) {
    super();
  }

  isOrcidLinked(): boolean {
    return this.item.hasMetadata('person.identifier.orcid');
  }

  getOrcid(): string {
    return this.item.firstMetadataValue('person.identifier.orcid');
  }

  linkOrcid(): void {
    combineLatest(
      this.configurationService.findByPropertyName('orcid-api.authorize-url').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid-api.application-client-id').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid-api.scope').pipe(getFirstSucceededRemoteDataPayload())
    ).subscribe(([authorizeUrl, clientId, scopes]) => {
      const redirectUri = environment.rest.baseUrl + '/api/cris/orcid/' + this.item.id + '/?url=' + this.router.url;
      const orcidUrl = authorizeUrl.values[0] + '?client_id=' + clientId.values[0]  + '&response_type=code&scope='
      + scopes.values.join(' ') + '&redirect_uri=' + redirectUri;
      this._window.nativeWindow.location.href = orcidUrl;
    });
  }

  createOrcid(): void {
    console.log('CREATE ORCID');
  }

  getMissingAuthorizations(): Observable<string[]> {
    const scopes = this.item.allMetadataValues('cris.orcid.scope');
    return this.configurationService.findByPropertyName('orcid-api.scope')
    .pipe(getFirstSucceededRemoteDataPayload(),
          map((configurationProperty) => configurationProperty.values),
          map((allScopes) => allScopes.filter( (scope) => !scopes.includes(scope))));
  }
}
