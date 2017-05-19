import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewEncapsulation,
  OnDestroy,
  OnInit, HostListener
} from "@angular/core";
import { TranslateService } from "ng2-translate";
import { HostWindowState } from "./shared/host-window.reducer";
import { Store } from "@ngrx/store";
import { HostWindowResizeAction } from "./shared/host-window.actions";

import { PaginationOptions } from './core/shared/pagination-options.model';

import { GLOBAL_CONFIG, GlobalConfig } from '../config';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  private translateSubscription: any;

  collection = [];
  example: string;
  options: PaginationOptions = new PaginationOptions();
  data: any = {
    greeting: 'Hello',
    recipient: 'World'
  };

  constructor(
    @Inject(GLOBAL_CONFIG) public EnvConfig: GlobalConfig,
    private translate: TranslateService,
    private store: Store<HostWindowState>
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  ngOnInit() {
    this.translateSubscription = this.translate.get('example.with.data', { greeting: 'Hello', recipient: 'DSpace' }).subscribe((translation: string) => {
      this.example = translation;
    });
    this.onLoad();
    this.options.id = 'app';
    //this.options.currentPage = 1;
    this.options.pageSize = 15;
    this.options.size = 'sm';
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    this.store.dispatch(
      new HostWindowResizeAction(event.target.innerWidth, event.target.innerHeight)
    );
  }

  private onLoad() {
    this.store.dispatch(
      new HostWindowResizeAction(window.innerWidth, window.innerHeight)
    );
  }
}
