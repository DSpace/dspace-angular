import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { EndUserAgreementService } from '../../core/end-user-agreement/end-user-agreement.service';
import { map, switchMap } from 'rxjs/operators';
import { ItemRequest } from '../../core/shared/item-request.model';
import { Observable } from 'rxjs/internal/Observable';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  redirectOn4xx
} from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { AuthService } from '../../core/auth/auth.service';
import { getRequestCopyDenyRoute, getRequestCopyGrantRoute } from '../request-copy-routing-paths';
import { Item } from '../../core/shared/item.model';
import { ItemDataService } from '../../core/data/item-data.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-grant-deny-request-copy',
  styleUrls: ['./grant-deny-request-copy.component.scss'],
  templateUrl: './grant-deny-request-copy.component.html'
})
export class GrantDenyRequestCopyComponent implements OnInit {
  itemRequestRD$: Observable<RemoteData<ItemRequest>>;
  itemRD$: Observable<RemoteData<Item>>;
  itemName$: Observable<string>;

  denyRoute$: Observable<string>;
  grantRoute$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private itemDataService: ItemDataService,
    private nameService: DSONameService,
  ) {

  }

  ngOnInit(): void {
    this.itemRequestRD$ = this.route.data.pipe(
      map((data) => data.request as RemoteData<ItemRequest>),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
    );
    this.itemRD$ = this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((itemRequest: ItemRequest) => this.itemDataService.findById(itemRequest.itemId)),
    );
    this.itemName$ = this.itemRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item) => this.nameService.getName(item)),
    );

    this.denyRoute$ = this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((itemRequest: ItemRequest) => getRequestCopyDenyRoute(itemRequest.token))
    );
    this.grantRoute$ = this.itemRequestRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((itemRequest: ItemRequest) => getRequestCopyGrantRoute(itemRequest.token))
    );
  }

}
