import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewEncapsulation,
  OnInit, HostListener
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HostWindowState } from "./shared/host-window.reducer";
import { Store } from "@ngrx/store";
import { HostWindowResizeAction } from "./shared/host-window.actions";

import { EnvConfig, GLOBAL_CONFIG, GlobalConfig } from '../config';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(GLOBAL_CONFIG) public EnvConfig: GlobalConfig,
    private translate: TranslateService,
    private store: Store<HostWindowState>
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    const env: string = EnvConfig.production ? "Production" : "Development";
    const color: string = EnvConfig.production ? "red" : "green";
    console.info(`Environment: %c${env}`,  `color: ${color}; font-weight: bold;`);
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    this.store.dispatch(
      new HostWindowResizeAction(event.target.innerWidth, event.target.innerHeight)
    );
  }

}
