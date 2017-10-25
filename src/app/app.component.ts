import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
  OnInit,
  HostListener, SimpleChanges, OnChanges
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Store } from '@ngrx/store';

import { TransferState } from '../modules/transfer-state/transfer-state';
import { HostWindowState } from './shared/host-window.reducer';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { NativeWindowRef, NativeWindowService } from './shared/window.service';
import { MetadataService } from './core/metadata/metadata.service';

import { GLOBAL_CONFIG, GlobalConfig } from '../config';

@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnChanges {

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    private translate: TranslateService,
    private cache: TransferState,
    private store: Store<HostWindowState>,
    private metadata: MetadataService
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

  ngAfterViewChecked() {
    this.syncCache();
  }

  syncCache() {
    this.store.take(1).subscribe((state: HostWindowState) => {
      this.cache.set('state', state);
    });
  }

  ngOnInit() {
    const env: string = this.config.production ? 'Production' : 'Development';
    const color: string = this.config.production ? 'red' : 'green';
    console.info(`Environment: %c${env}`, `color: ${color}; font-weight: bold;`);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    this.store.dispatch(
      new HostWindowResizeAction(event.target.innerWidth, event.target.innerHeight)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('AppComponent: onchanges called', changes);
  }


}
