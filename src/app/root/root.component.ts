import { first, map, skipWhile, startWith, switchMap } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest as combineLatestObservable, Observable, of, Subscription } from 'rxjs';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { MenuService } from '../shared/menu/menu.service';
import { HostWindowService } from '../shared/host-window.service';
import { ThemeConfig } from '../../config/theme.config';
import { environment } from '../../environments/environment';
import { slideSidebarPadding } from '../shared/animations/slide';
import { MenuID } from '../shared/menu/menu-id.model';
import { getPageInternalServerErrorRoute } from '../app-routing-paths';
import { INotificationBoardOptions } from 'src/config/notifications-config.interfaces';

@Component({
  selector: 'ds-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [slideSidebarPadding],
})
export class RootComponent implements OnInit, OnDestroy {
  theme: Observable<ThemeConfig> = of({} as any);
  isSidebarVisible$: Observable<boolean>;
  slideSidebarOver$: Observable<boolean>;
  collapsedSidebarWidth$: Observable<string>;
  expandedSidebarWidth$: Observable<string>;
  notificationOptions: INotificationBoardOptions;
  models: any;

  /**
   * Whether or not to show a full screen loader
   */
  @Input() shouldShowFullscreenLoader: boolean;

  /**
   * Whether or not to show a loader across the router outlet
   */
  @Input() shouldShowRouteLoader: boolean;

  shouldShowRouteLoader$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  subs: Subscription[] = [];

  constructor(
    private router: Router,
    private cssService: CSSVariableService,
    private menuService: MenuService,
    private windowService: HostWindowService,
  ) {
    this.notificationOptions = environment.notifications;
  }

  ngOnInit() {

    this.isSidebarVisible$ = this.menuService.isMenuVisibleWithVisibleSections(MenuID.ADMIN);

    this.expandedSidebarWidth$ = this.cssService.getVariable('--ds-admin-sidebar-total-width').pipe(
      skipWhile((val) => !val),
      first(),
    );
    this.collapsedSidebarWidth$ = this.cssService.getVariable('--ds-admin-sidebar-fixed-element-width').pipe(
      skipWhile((val) => !val),
      first(),
    );

    const sidebarCollapsed = this.menuService.isMenuCollapsed(MenuID.ADMIN);
    this.slideSidebarOver$ = combineLatestObservable([sidebarCollapsed, this.windowService.isXsOrSm()])
      .pipe(
        map(([collapsed, mobile]) => collapsed || mobile),
        startWith(true),
      );

    if (this.shouldShowRouteLoader && !this.shouldShowFullscreenLoader) {
      this.subs.push(
        this.router.events.pipe(
          map(() => this.router.routerState.root),
          switchMap((route: ActivatedRoute) => {
            route = this.getCurrentRoute(route);
            return route.url;
          }),
          map((urlSegment) => '/' + urlSegment.join('/')),
          map((url) => url === getPageInternalServerErrorRoute()),
        ).subscribe((isInternalServerError) => {
          this.shouldShowRouteLoader$.next(!isInternalServerError);
        }));
    }
  }

  private getCurrentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  skipToMainContent() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
    }
  }
}
