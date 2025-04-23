import {
  AsyncPipe,
  CommonModule,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { ItemRequestDataService } from '../../core/data/item-request-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { ItemRequest } from '../../core/shared/item-request.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getItemModuleRoute } from '../../item-page/item-page-routing-paths';
import { hasValue } from '../../shared/empty.util';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { VarDirective } from '../../shared/utils/var.directive';
import { RequestCopyEmail } from '../email-request-copy/request-copy-email.model';
import { ThemedEmailRequestCopyComponent } from '../email-request-copy/themed-email-request-copy.component';

@Component({
  selector: 'ds-base-grant-request-copy',
  styleUrls: ['./grant-request-copy.component.scss'],
  templateUrl: './grant-request-copy.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    FormsModule,
    RouterLink,
    ThemedEmailRequestCopyComponent,
    ThemedLoadingComponent,
    TranslatePipe,
    VarDirective,
  ],
})
/**
 * Component for granting an item request
 */
export class GrantRequestCopyComponent implements OnInit {
  /**
   * The item request to accept
   */
  itemRequestRD$: Observable<RemoteData<ItemRequest>>;

  /**
   * The default subject of the message to send to the user requesting the item
   */
  subject$: Observable<string>;
  /**
   * The default contents of the message to send to the user requesting the item
   */
  message$: Observable<string>;

  /**
   * Whether the item should be open access, to avoid future requests
   * Defaults to false
   */
  suggestOpenAccess = false;

  /**
   * A list of integers determining valid access periods in seconds
   */
  validAccessPeriods$: Observable<string[]>;

  /**
   * The currently selected access period
   */
  accessPeriod: string = null;

  /**
   * Will this email attach file(s) directly, or send a secure link with an access token to provide temporary access?
   * This will be false if the access token is populated, since the configuration and min file size checks are
   * done at the time of request creation, with a default of true.
   */
  sendAsAttachment = true;

  /**
   * Preview link to be sent to a request applicant
   */
  previewLinkOptions:  {
    routerLink: string,
    queryParams: any,
  };
  previewLink: string;

  protected readonly hasValue = hasValue;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private translateService: TranslateService,
    private itemRequestService: ItemRequestDataService,
    private notificationsService: NotificationsService,
    private hardRedirectService: HardRedirectService,
  ) {

  }

  /**
   * Initialize the component - get the item request from route data an duse it to populate the form
   */
  ngOnInit(): void {
    // Get item request data via the router (async)
    this.itemRequestRD$ = this.route.data.pipe(
      map((data) => data.request as RemoteData<ItemRequest>),
      getFirstCompletedRemoteData(),
      tap((rd) => {
        // If an access token is present then the backend has checked configuration and file sizes
        // and appropriately created a token to use with a secure link instead of attaching file directly
        if (rd.hasSucceeded && hasValue(rd.payload.accessToken)) {
          this.sendAsAttachment = false;
          this.previewLinkOptions = {
            routerLink: new URLCombiner(getItemModuleRoute(), rd.payload.itemId).toString(),
            queryParams: {
              accessToken: rd.payload.accessToken,
            },
          };
          this.previewLink = this.hardRedirectService.getCurrentOrigin()
            + this.previewLinkOptions.routerLink + '?accessToken=' + rd.payload.accessToken;
        }
      }),
      redirectOn4xx(this.router, this.authService),
    );

    // Get configured access periods
    this.validAccessPeriods$ = this.itemRequestService.getConfiguredAccessPeriods();

    // Get the subject line of the email
    this.subject$ = this.translateService.get('grant-request-copy.email.subject');
  }

  /**
   * Grant the item request
   * @param email Subject and contents of the message to send back to the user requesting the item
   */
  grant(email: RequestCopyEmail) {
    this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((itemRequest: ItemRequest) => this.itemRequestService.grant(itemRequest.token, email, this.suggestOpenAccess, this.accessPeriod)),
      getFirstCompletedRemoteData(),
    ).subscribe((rd) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('grant-request-copy.success'));
        this.router.navigateByUrl('/');
      } else {
        this.notificationsService.error(this.translateService.get('grant-request-copy.error'), rd.errorMessage);
      }
    });
  }

  selectAccessPeriod(accessPeriod: string) {
    this.accessPeriod = accessPeriod;
  }

}
