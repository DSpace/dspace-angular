import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { ItemRequest } from '../../core/shared/item-request.model';
import { Observable } from 'rxjs';
import {
  getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload
} from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { AuthService } from '../../core/auth/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ItemRequestDataService } from '../../core/data/item-request-data.service';
import { RequestCopyEmail } from '../email-request-copy/request-copy-email.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { FormsModule } from '@angular/forms';
import { ThemedEmailRequestCopyComponent } from '../email-request-copy/themed-email-request-copy.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { VarDirective } from '../../shared/utils/var.directive';

@Component({
    selector: 'ds-grant-request-copy',
    styleUrls: ['./grant-request-copy.component.scss'],
    templateUrl: './grant-request-copy.component.html',
    standalone: true,
    imports: [VarDirective, NgIf, ThemedEmailRequestCopyComponent, FormsModule, ThemedLoadingComponent, AsyncPipe, TranslateModule]
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
      getFirstCompletedRemoteData()
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
