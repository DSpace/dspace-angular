import {
  AsyncPipe,
  DOCUMENT,
  isPlatformBrowser,
  NgIf,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import {
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  map,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';

import { environment } from '../environments/environment';
import {
  getEditItemPageRoute,
  getWorkflowItemModuleRoute,
  getWorkspaceItemModuleRoute,
} from './app-routing-paths';
import { AuthService } from './core/auth/auth.service';
import { isAuthenticationBlocking } from './core/auth/selectors';
import { RouteService } from './core/services/route.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from './core/services/window.service';
import { distinctNext } from './core/shared/distinct-next';
import { ThemedRootComponent } from './root/themed-root.component';
import { DatadogRumService } from './shared/datadog-rum/datadog-rum.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { IdleModalComponent } from './shared/idle-modal/idle-modal.component';
import { CSSVariableService } from './shared/sass-helper/css-variable.service';
import { HostWindowState } from './shared/search/host-window.reducer';
import { ThemeService } from './shared/theme-support/theme.service';
import { SocialComponent } from './social/social.component';
import { SocialService } from './social/social.service';

@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ThemedRootComponent,
    AsyncPipe,
    NgIf,
    SocialComponent,
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  notificationOptions;
  models;

  /**
   * Whether or not the authentication is currently blocking the UI
   */
  isAuthBlocking$: Observable<boolean>;

  /**
   * Whether or not the app is in the process of rerouting
   */
  isRouteLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Whether or not the theme is in the process of being swapped
   */
  isThemeLoading$: Observable<boolean>;

  /**
   * Whether or not the idle modal is is currently open
   */
  idleModalOpen: boolean;


  /**
   * In order to show sharing component only in csr
   */
  browserPlatform = false;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: any,
    private themeService: ThemeService,
    private translate: TranslateService,
    private store: Store<HostWindowState>,
    private authService: AuthService,
    private router: Router,
    private routeService: RouteService,
    private cssService: CSSVariableService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
    private socialService: SocialService,
    private datadogRumService: DatadogRumService,
  ) {
    this.notificationOptions = environment.notifications;
    this.browserPlatform = isPlatformBrowser(this.platformId);

    if (this.browserPlatform) {
      this.trackIdleModal();
    }

    this.isThemeLoading$ = this.themeService.isThemeLoading$;

    this.storeCSSVariables();

    this.socialService.initialize();
  }

  ngOnInit() {
    /** Implement behavior for interface {@link ModalBeforeDismiss} */
    this.modalConfig.beforeDismiss = async function () {
      if (typeof this?.componentInstance?.beforeDismiss === 'function') {
        return this.componentInstance.beforeDismiss();
      }

      // fall back to default behavior
      return true;
    };

    this.isAuthBlocking$ = this.store.pipe(
      select(isAuthenticationBlocking),
      distinctUntilChanged(),
    );

    this.dispatchWindowSize(this._window.nativeWindow.innerWidth, this._window.nativeWindow.innerHeight);

    this.datadogRumService.initDatadogRum();
  }

  private storeCSSVariables() {
    this.cssService.clearCSSVariables();
    this.cssService.addCSSVariables(this.cssService.getCSSVariablesFromStylesheets(this.document));
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      // delay(0) to prevent "Expression has changed after it was checked" errors
      delay(0),
      switchMap((event) => this.routeService.getCurrentUrl().pipe(
        take(1),
        map((currentUrl) => [currentUrl, event]),
      )),
    ).subscribe(([currentUrl, event]: [string, any]) => {
      if (event instanceof NavigationStart) {
        const nextUrl = event.url;
        if (!this.shouldSkipLoadingStatus(currentUrl, nextUrl)) {
          distinctNext(this.isRouteLoading$, true);
        }
        // distinctNext(this.isRouteLoading$, true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        distinctNext(this.isRouteLoading$, false);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.dispatchWindowSize(event.target.innerWidth, event.target.innerHeight);
  }

  private dispatchWindowSize(width, height): void {
    this.store.dispatch(
      new HostWindowResizeAction(width, height),
    );
  }

  private trackIdleModal() {
    const isIdle$ = this.authService.isUserIdle();
    const isAuthenticated$ = this.authService.isAuthenticated();
    isIdle$.pipe(withLatestFrom(isAuthenticated$))
      .subscribe(([userIdle, authenticated]) => {
        if (userIdle && authenticated) {
          if (!this.idleModalOpen) {
            const modalRef = this.modalService.open(IdleModalComponent, { ariaLabelledBy: 'idle-modal.header' });
            this.idleModalOpen = true;
            modalRef.componentInstance.response.pipe(take(1)).subscribe((closed: boolean) => {
              if (closed) {
                this.idleModalOpen = false;
              }
            });
          }
        }
      });
  }

  private shouldSkipLoadingStatus(currentUrl: string, nextUrl: string): boolean {
    return ((currentUrl.startsWith('/entities') || currentUrl.startsWith(getEditItemPageRoute())) && !(this.isAdministrativeEditItemPageRoute(nextUrl, currentUrl)))
      || currentUrl.startsWith(getWorkspaceItemModuleRoute()) || currentUrl.startsWith(getWorkflowItemModuleRoute());
  }

  private isAdministrativeEditItemPageRoute(nextUrl: string, currentUrl: string): boolean {
    const editPageRegEx = /\/(entities\/[^\/]+|items)\/[0-9a-f-]{36}\/edit(?:\/.*)?$/;
    return editPageRegEx.test(nextUrl) && !editPageRegEx.test(currentUrl);
  }

}
