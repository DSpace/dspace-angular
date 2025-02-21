import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { AuthService } from '@dspace/core';
import { ItemRequestDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { RequestCopyEmail } from '@dspace/core';
import { redirectOn4xx } from '@dspace/core';
import { ItemRequest } from '@dspace/core';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '@dspace/core';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { ThemedEmailRequestCopyComponent } from '../email-request-copy/themed-email-request-copy.component';

@Component({
  selector: 'ds-base-grant-request-copy',
  styleUrls: ['./grant-request-copy.component.scss'],
  templateUrl: './grant-request-copy.component.html',
  standalone: true,
  imports: [VarDirective, ThemedEmailRequestCopyComponent, FormsModule, ThemedLoadingComponent, AsyncPipe, TranslateModule],
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
   * Whether or not the item should be open access, to avoid future requests
   * Defaults to false
   */
  suggestOpenAccess = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private translateService: TranslateService,
    private itemRequestService: ItemRequestDataService,
    private notificationsService: NotificationsService,
  ) {

  }

  ngOnInit(): void {
    this.itemRequestRD$ = this.route.data.pipe(
      map((data) => data.request as RemoteData<ItemRequest>),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
    );

    this.subject$ = this.translateService.get('grant-request-copy.email.subject');
  }

  /**
   * Grant the item request
   * @param email Subject and contents of the message to send back to the user requesting the item
   */
  grant(email: RequestCopyEmail) {
    this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((itemRequest: ItemRequest) => this.itemRequestService.grant(itemRequest.token, email, this.suggestOpenAccess)),
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

}
