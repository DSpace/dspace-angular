import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { EndUserAgreementService } from '../../core/end-user-agreement/end-user-agreement.service';
import { map } from 'rxjs/operators';
import { Registration } from '../../core/shared/registration.model';
import { ItemRequest } from '../../core/shared/item-request.model';
import { Observable } from 'rxjs/internal/Observable';
import { getFirstCompletedRemoteData, redirectOn4xx } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'ds-grant-deny-request-copy',
  styleUrls: ['./grant-deny-request-copy.component.scss'],
  templateUrl: './grant-deny-request-copy.component.html'
})
export class GrantDenyRequestCopyComponent implements OnInit {
  private itemRequest$: Observable<RemoteData<ItemRequest>>;
  

  constructor(
    private translateService: TranslateService,
    private ePersonDataService: EPersonDataService,
    private store: Store<CoreState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private endUserAgreementService: EndUserAgreementService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.itemRequest$ = this.route.data.pipe(
      map((data) => data.request as RemoteData<ItemRequest>),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService)
    );

  }

}
