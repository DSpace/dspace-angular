import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { HELP_DESK_PROPERTY } from '../../item-page/tombstone/tombstone.component';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { PostRequest } from '../../core/data/request.models';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RequestService } from '../../core/data/request.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { hasSucceeded } from 'src/app/core/data/request-entry-state.model';

/**
 * If the ShibbolethAuthorization has failed because the IdP hasn't sent the `SHIB-EMAIL` header this component is
 * showed to the user.
 * The user must fill in his email. Then he will receive the verification token to the email he has filled in.
 */
@Component({
  selector: 'ds-auth-failed-page',
  templateUrl: './auth-failed-page.component.html',
  styleUrls: ['./auth-failed-page.component.scss']
})
export class AuthFailedPageComponent implements OnInit {
  /**
   * Netid of the user - this information is passed from the IdP.
   */
  netid = '';

  /**
   * Email which the user has filled in. This information is loaded from the URL.
   */
  email = '';

  /**
   * The mail for the help desk is loaded from the server. The user could contact the administrator.
   */
  helpDesk$: Observable<RemoteData<ConfigurationProperty>>;

  constructor(
    protected configurationDataService: ConfigurationDataService,
    public route: ActivatedRoute,
    private requestService: RequestService,
    protected halService: HALEndpointService,
    protected rdbService: RemoteDataBuildService,
    private notificationService: NotificationsService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadHelpDeskEmail();

    // Load the netid from the URL.
    this.netid = this.route.snapshot.queryParams.netid;
  }

  public sendEmail() {
    const requestId = this.requestService.generateRequestId();

    const url = this.halService.getRootHref() + '/autoregistration?netid=' + encodeURIComponent(this.netid) +
      '&email=' + encodeURIComponent(this.email);
    const postRequest = new PostRequest(requestId, url);
    // Send POST request
    this.requestService.send(postRequest);
    // Get response
    const response = this.rdbService.buildFromRequestUUID(requestId);
    // Process response
    response
      .pipe(getFirstCompletedRemoteData())
      .subscribe(responseRD$ => {
        if (hasSucceeded(responseRD$.state)) {
          this.notificationService.success(
            this.translateService.instant('clarin.auth-failed.send-email.successful.message'));
        } else {
          this.notificationService.error(
            this.translateService.instant('clarin.auth-failed.send-email.error.message'));
        }
      });
  }

  private loadHelpDeskEmail() {
    this.helpDesk$ = this.configurationDataService.findByPropertyName(HELP_DESK_PROPERTY);
  }
}
