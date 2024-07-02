import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AppState } from '../../../app.reducer';
import {
  getProfileModuleRoute,
  getSubscriptionsModuleRoute,
} from '../../../app-routing-paths';
import { AuthService } from '../../../core/auth/auth.service';
import { isAuthenticationLoading } from '../../../core/auth/selectors';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { MYDSPACE_ROUTE } from '../../../my-dspace-page/my-dspace-page.component';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { LogOutComponent } from '../../log-out/log-out.component';

/**
 * This component represents the user nav menu.
 */
@Component({
  selector: 'ds-base-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: true,
  imports: [NgIf, ThemedLoadingComponent, RouterLinkActive, NgClass, RouterLink, LogOutComponent, AsyncPipe, TranslateModule],
})
export class UserMenuComponent implements OnInit {

  /**
   * The input flag to show user details in navbar expandable menu
   */
  @Input() inExpandableNavbar = false;

  /**
   * True if the authentication is loading.
   * @type {Observable<boolean>}
   */
  public loading$: Observable<boolean>;

  /**
   * The authenticated user.
   * @type {Observable<EPerson>}
   */
  public user$: Observable<EPerson>;

  /**
   * The mydspace page route.
   * @type {string}
   */
  public mydspaceRoute = MYDSPACE_ROUTE;

  /**
   * The profile page route
   */
  public profileRoute = getProfileModuleRoute();

  /**
   * The profile page route
   */
  public subscriptionsRoute = getSubscriptionsModuleRoute();

  constructor(
    protected store: Store<AppState>,
    protected authService: AuthService,
    public dsoNameService: DSONameService,
  ) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {

    // set loading
    this.loading$ = this.store.pipe(select(isAuthenticationLoading));

    // set user
    this.user$ = this.authService.getAuthenticatedUserFromStore();

  }
}
