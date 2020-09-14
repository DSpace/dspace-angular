import { Component, Inject, OnInit } from '@angular/core';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { CrisLayoutBox } from 'src/app/layout/decorators/cris-layout-box.decorator';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { combineLatest, Observable, Subject, BehaviorSubject } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { Router } from '@angular/router';
import { NativeWindowService, NativeWindowRef } from 'src/app/core/services/window.service';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { LayoutBox } from '../../enums/layout-box.enum';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';

@Component({
  selector: 'ds-orcid-authorizations.component',
  templateUrl: './orcid-authorizations.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.ORCID, LayoutBox.ORCID_AUTHORIZATIONS)
export class OrcidAuthorizationsComponent extends CrisLayoutBoxObj implements OnInit {

  missingAuthorizations$ = new BehaviorSubject<string[]>([]);

  constructor(
    private configurationService: ConfigurationDataService,
    private router: Router,
    @Inject(NativeWindowService) private _window: NativeWindowRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    const scopes = this.getOrcidAuthorizations();
    return this.configurationService.findByPropertyName('orcid-api.scope')
    .pipe(getFirstSucceededRemoteDataPayload(),
          map((configurationProperty) => configurationProperty.values),
          map((allScopes) => allScopes.filter( (scope) => !scopes.includes(scope))))
    .subscribe((missingScopes) => this.missingAuthorizations$.next(missingScopes));
  }

  getOrcidAuthorizations(): string[] {
    return this.item.allMetadataValues('cris.orcid.scope');
  }

  isOrcidLinked(): boolean {
    return this.item.hasMetadata('person.identifier.orcid');
  }

  getAuthorizationDescription(scope: string) {
    return 'person.page.orcid.scope.' + scope.substring(1).replace('/','-');
  }

  linkOrcid(): void {
    combineLatest(
      this.configurationService.findByPropertyName('orcid-api.authorize-url').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid-api.application-client-id').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid-api.scope').pipe(getFirstSucceededRemoteDataPayload())
    ).subscribe(([authorizeUrl, clientId, scopes]) => {
      const redirectUri = environment.rest.baseUrl + '/api/cris/orcid/' + this.item.id + '/?url=' + encodeURIComponent('/home');
      const orcidUrl = authorizeUrl.values[0] + '?client_id=' + clientId.values[0]   + '&redirect_uri=' + redirectUri + '&response_type=code&scope='
      + scopes.values.join(' ');
      this._window.nativeWindow.location.href = orcidUrl;
    });
  }

  createOrcid(): void {
    console.log('CREATE ORCID');
  }

}
