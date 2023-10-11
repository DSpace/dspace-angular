import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { redirectOn204, redirectOn4xx } from '../core/shared/authorized.operators';
import { fadeInOut } from '../shared/animations/fade';
import { AuthService } from '../core/auth/auth.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';

/**
 * This component is the entry point for the page that renders items.
 */
@Component({
  selector: 'ds-cris-item-page',
  templateUrl: './cris-item-page.component.html',
  styleUrls: ['./cris-item-page.component.scss'],
  animations: [fadeInOut]
})
export class CrisItemPageComponent implements OnInit {

  /**
   * Whether the current user is an admin or not
   */
  isAdmin$: Observable<boolean>;

  itemRD$: Observable<RemoteData<Item>>;

  constructor(
    private authorizationService: AuthorizationDataService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.itemRD$ = this.route.data.pipe(
      map((data) => {
        return data.dso as RemoteData<Item>;
      }),
      redirectOn204<Item>(this.router, this.authService),
      redirectOn4xx<Item>(this.router, this.authService)
    );

    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }

}
