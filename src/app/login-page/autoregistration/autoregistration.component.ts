import { Component, OnInit } from '@angular/core';
import { FindListOptions, GetRequest, PostRequest } from '../../core/data/request.models';
import { getFirstCompletedRemoteData,getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { hasSucceeded } from '../../core/data/request.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../core/data/request.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticatedAction } from '../../core/auth/auth.actions';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { ClarinVerificationTokenDataService } from '../../core/data/clarin/clarin-verification-token-data.service';
import { ClarinVerificationToken } from '../../core/shared/clarin/clarin-verification-token.model';
import { RequestParam } from '../../core/cache/models/request-param.model';
import { HttpOptions } from '../../core/dspace-rest/dspace-rest.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';
import { isEmpty } from '../../shared/empty.util';

/**
 * This component is showed up when the user has clicked on the `verification token`.
 * The component show to the user request headers which are passed from the IdP and after submitting
 * it tries to register and sign in the user.
 */
@Component({
  selector: 'ds-autoregistration',
  templateUrl: './autoregistration.component.html',
  styleUrls: ['./autoregistration.component.scss']
})
export class AutoregistrationComponent implements OnInit {

  /**
   * The verification token passed in the URL.
   */
  verificationToken = '';

  /**
   * Name of the repository retrieved from the configuration.
   */
  dspaceName$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * ClarinVerificationToken object retrieved from the BE based on the passed `verificationToken`.
   * This object has ShibHeaders string value which is parsed and showed up to the user.
   */
  verificationToken$: BehaviorSubject<ClarinVerificationToken> = new BehaviorSubject<ClarinVerificationToken>(null);

  /**
   * Request headers which are passed by the IdP and are showed to the user.
   */
  shibHeaders$: BehaviorSubject<ShibHeader[]> = new BehaviorSubject<ShibHeader[]>(null);

  constructor(protected router: Router,
    public route: ActivatedRoute,
    private requestService: RequestService,
    protected halService: HALEndpointService,
    protected rdbService: RemoteDataBuildService,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private configurationService: ConfigurationDataService,
    private verificationTokenService: ClarinVerificationTokenDataService,
    private store: Store<CoreState>
  ) { }

  ngOnInit(): void {
    // Retrieve the token from the request param
    this.verificationToken = this.route?.snapshot?.queryParams?.['verification-token'];
    // Load the repository name for the welcome message
    this.loadRepositoryName();
    // Load the `ClarinVerificationToken` based on the `verificationToken` value
    this.loadVerificationToken();
  }

  /**
   * Try to authentificate the user - the authentication method automatically register the user if he doesn't exist.
   * If the authentication is successful try to login him.
   */
  public sendAutoregistrationRequest() {
    const requestId = this.requestService.generateRequestId();

    // Compose the URL for the ClarinAutoregistrationController.
    const url = this.halService.getRootHref() + '/autoregistration?verification-token=' + this.verificationToken;
    const getRequest = new GetRequest(requestId, url);
    // Send GET request
    this.requestService.send(getRequest);
    // Get response
    const response = this.rdbService.buildFromRequestUUID(requestId);
    // Process response
    response
      .pipe(getFirstCompletedRemoteData())
      .subscribe(responseRD$ => {
        if (hasSucceeded(responseRD$.state)) {
          // Show successful message
          this.notificationService.success(this.translateService.instant('clarin.autoregistration.successful.message'));
          // Call autologin
          this.sendAutoLoginRequest();
        } else {
          // Show error message
          this.notificationService.error(this.translateService.instant('clarin.autoregistration.error.message'));
        }
      });
  }

  /**
   * The user submitted the Shibboleth headers.
   */
  public autologin() {
    this.sendAutoregistrationRequest();
  }

  /**
   * Call the ClarinShibbolethLoginFilter to authenticate the user. If the authentication is successful there is
   * an authorization token in the response which is passed to the `AuthenticationAction`. The `AuthenticationAction`
   * stores the token which is sent in every request.
   */
  private sendAutoLoginRequest() {
    // Prepare request headers
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('verification-token', this.verificationToken);
    options.headers = headers;
    // The response returns the token which is returned as string.
    options.responseType = 'text';

    // Prepare request
    const requestId = this.requestService.generateRequestId();
    // Compose the URL for the ClarinShibbolethLoginFilter
    const url = this.halService.getRootHref() + '/authn/shibboleth';
    const postRequest = new PostRequest(requestId, url, {}, options);
    // Send POST request
    this.requestService.send(postRequest);
    // Get response
    const response = this.rdbService.buildFromRequestUUID(requestId);
    // Process response
    response
      .pipe(getFirstCompletedRemoteData())
      .subscribe(responseRD$ => {
        if (hasSucceeded(responseRD$.state)) {
          // Retrieve the token from the response. The token is returned as array of string.
          const token = Object.values(responseRD$?.payload).join('');
          const authToken = new AuthTokenInfo(token);
          this.deleteVerificationToken();
          this.store.dispatch(new AuthenticatedAction(authToken));
          this.router.navigate(['home']);
        }
      });
  }

  /**
   * After every successful registration and login delete the verification token.
   */
  private deleteVerificationToken() {
    this.verificationTokenService.delete(this.verificationToken$.value.id)
      .pipe(getFirstCompletedRemoteData());
  }

  /**
   * Retrieve the `ClarinVerificationToken` object by the `verificationToken` value.
   */
  private loadVerificationToken() {
    this.verificationTokenService.searchBy('byToken', this.createSearchOptions(this.verificationToken))
      .pipe(getFirstSucceededRemoteListPayload())
      .subscribe(res => {
        if (isEmpty(res?.[0])) {
          return;
        }
        this.verificationToken$.next(res?.[0]);
        this.loadShibHeaders(this.verificationToken$?.value?.shibHeaders);
      });
  }

  /**
   * The verificationToken$ object stores the ShibHeaders which are stored as a string. Parse that string value
   * to the Array of the ShibHeader object for better rendering in the html.
   */
  private loadShibHeaders(shibHeadersStr: string) {
    const shibHeaders: ShibHeader[] = [];

    const splited = shibHeadersStr?.split('\n');
    splited.forEach(headerAndValue => {
      const endHeaderIndex = headerAndValue.indexOf('=');
      const startValueIndex = endHeaderIndex + 1;

      const header = headerAndValue.substr(0, endHeaderIndex);
      const value = headerAndValue.substr(startValueIndex);

      // Because cookie is big message
      if (header === 'cookie') {
        return;
      }
      const shibHeader: ShibHeader = Object.assign({}, {
        header: header,
        value: value
      });
      shibHeaders.push(shibHeader);
    });

    this.shibHeaders$.next(shibHeaders);
  }

  /**
   * Add the `token` search option to the request.
   */
  private createSearchOptions(token: string) {
    const params = [];
    params.push(new RequestParam('token', token));
    return Object.assign(new FindListOptions(), {
      searchParams: [...params]
    });
  }

  private loadRepositoryName() {
    this.configurationService.findByPropertyName('dspace.name')
      .pipe(getFirstCompletedRemoteData())
      .subscribe(res => {
        this.dspaceName$.next(res?.payload?.values?.[0]);
      });
  }
}

/**
 * ShibHeaders string value from the verificationToken$ parsed to the objects.
 */
export interface ShibHeader {
  header: string;
  value: string;
}
