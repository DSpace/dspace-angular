import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';

import { Store } from '@ngrx/store';

import { TranslateService } from '@ngx-translate/core';

import { GLOBAL_CONFIG, GlobalConfig } from '../config';

import { MetadataService } from './core/metadata/metadata.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowState } from './shared/host-window.reducer';
import { NativeWindowRef, NativeWindowService } from './shared/services/window.service';
import { isAuthenticated } from './core/auth/selectors';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    private translate: TranslateService,
    private store: Store<HostWindowState>,
    private metadata: MetadataService,
    private authService: AuthService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    metadata.listenForRouteChange();

    if (config.debug) {
      console.info(config);
    }
  }

  ngOnInit() {
    const env: string = this.config.production ? 'Production' : 'Development';
    const color: string = this.config.production ? 'red' : 'green';
    console.info(`Environment: %c${env}`, `color: ${color}; font-weight: bold;`);
    this.dispatchWindowSize(this._window.nativeWindow.innerWidth, this._window.nativeWindow.innerHeight);

    // Whether is not authenticathed try to retrieve a possible stored auth token
    this.store.select(isAuthenticated)
      .take(1)
      .filter((authenticated) => !authenticated)
      .subscribe((authenticated) => this.authService.checksAuthenticationToken());

  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    this.dispatchWindowSize(event.target.innerWidth, event.target.innerHeight);
  }

  private dispatchWindowSize(width, height): void {
    this.store.dispatch(
      new HostWindowResizeAction(width, height)
    );
  }

}
