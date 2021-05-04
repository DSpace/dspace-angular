import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
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

  constructor(
    private configurationService: ConfigurationDataService,
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

  isOrcidLinked(): boolean {
    return this.item.hasMetadata('person.identifier.orcid');
  }

  getAuthorizationDescription(scope: string) {
    return 'person.page.orcid.scope.' + scope.substring(1).replace('/','-');
  }

  linkOrcid(): void {
    combineLatest(
      this.configurationService.findByPropertyName('orcid.authorize-url').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid.application-client-id').pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('orcid.scope').pipe(getFirstSucceededRemoteDataPayload())
    ).subscribe(([authorizeUrl, clientId, scopes]) => {
      const redirectUri = environment.rest.baseUrl + '/api/cris/orcid/' + this.item.id + '/?url=' + encodeURIComponent('/home');
      const orcidUrl = authorizeUrl.values[0] + '?client_id=' + clientId.values[0]   + '&redirect_uri=' + redirectUri + '&response_type=code&scope='
      + scopes.values.join(' ');
      this._window.nativeWindow.location.href = orcidUrl;
    });
  }

}
