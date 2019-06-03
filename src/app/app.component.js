import * as tslib_1 from "tslib";
import { filter, map, take } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG } from '../config';
import { MetadataService } from './core/metadata/metadata.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { NativeWindowRef, NativeWindowService } from './shared/services/window.service';
import { isAuthenticated } from './core/auth/selectors';
import { AuthService } from './core/auth/auth.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { RouteService } from './shared/services/route.service';
import variables from '../styles/_exposed_variables.scss';
import { CSSVariableService } from './shared/sass-helper/sass-helper.service';
import { MenuService } from './shared/menu/menu.service';
import { MenuID } from './shared/menu/initial-menus-state';
import { slideSidebarPadding } from './shared/animations/slide';
import { combineLatest as combineLatestObservable } from 'rxjs';
import { HostWindowService } from './shared/host-window.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(config, _window, translate, store, metadata, angulartics2GoogleAnalytics, authService, router, routeService, cssService, menuService, windowService) {
        this.config = config;
        this._window = _window;
        this.translate = translate;
        this.store = store;
        this.metadata = metadata;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.authService = authService;
        this.router = router;
        this.routeService = routeService;
        this.cssService = cssService;
        this.menuService = menuService;
        this.windowService = windowService;
        this.isLoading = true;
        // Load all the languages that are defined as active from the config file
        translate.addLangs(config.languages.filter(function (LangConfig) { return LangConfig.active === true; }).map(function (a) { return a.code; }));
        // Load the default language from the config file
        translate.setDefaultLang(config.defaultLanguage);
        // Attempt to get the browser language from the user
        if (translate.getLangs().includes(translate.getBrowserLang())) {
            translate.use(translate.getBrowserLang());
        }
        else {
            translate.use(config.defaultLanguage);
        }
        metadata.listenForRouteChange();
        routeService.saveRouting();
        if (config.debug) {
            console.info(config);
        }
        this.storeCSSVariables();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var env = this.config.production ? 'Production' : 'Development';
        var color = this.config.production ? 'red' : 'green';
        console.info("Environment: %c" + env, "color: " + color + "; font-weight: bold;");
        this.dispatchWindowSize(this._window.nativeWindow.innerWidth, this._window.nativeWindow.innerHeight);
        // Whether is not authenticathed try to retrieve a possible stored auth token
        this.store.pipe(select(isAuthenticated), take(1), filter(function (authenticated) { return !authenticated; })).subscribe(function (authenticated) { return _this.authService.checkAuthenticationToken(); });
        this.sidebarVisible = this.menuService.isMenuVisible(MenuID.ADMIN);
        this.collapsedSidebarWidth = this.cssService.getVariable('collapsedSidebarWidth');
        this.totalSidebarWidth = this.cssService.getVariable('totalSidebarWidth');
        var sidebarCollapsed = this.menuService.isMenuCollapsed(MenuID.ADMIN);
        this.slideSidebarOver = combineLatestObservable(sidebarCollapsed, this.windowService.isXsOrSm())
            .pipe(map(function (_a) {
            var collapsed = _a[0], mobile = _a[1];
            return collapsed || mobile;
        }));
    };
    AppComponent.prototype.storeCSSVariables = function () {
        var _this = this;
        var vars = variables.locals || {};
        Object.keys(vars).forEach(function (name) {
            _this.cssService.addCSSVariable(name, vars[name]);
        });
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.router.events
            .subscribe(function (event) {
            if (event instanceof NavigationStart) {
                _this.isLoading = true;
            }
            else if (event instanceof NavigationEnd ||
                event instanceof NavigationCancel) {
                _this.isLoading = false;
            }
        });
    };
    AppComponent.prototype.onResize = function (event) {
        this.dispatchWindowSize(event.target.innerWidth, event.target.innerHeight);
    };
    AppComponent.prototype.dispatchWindowSize = function (width, height) {
        this.store.dispatch(new HostWindowResizeAction(width, height));
    };
    tslib_1.__decorate([
        HostListener('window:resize', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], AppComponent.prototype, "onResize", null);
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-app',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss'],
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None,
            animations: [slideSidebarPadding]
        }),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__param(1, Inject(NativeWindowService)),
        tslib_1.__metadata("design:paramtypes", [Object, NativeWindowRef,
            TranslateService,
            Store,
            MetadataService,
            Angulartics2GoogleAnalytics,
            AuthService,
            Router,
            RouteService,
            CSSVariableService,
            MenuService,
            HostWindowService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map