import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnDestroy,
  OnInit, HostListener
} from "@angular/core";
import { TranslateService } from "ng2-translate";
import { HostWindowState } from "./shared/host-window.reducer";
import { Store } from "@ngrx/store";
import { HostWindowActions } from "./shared/host-window.actions";
import { GlobalConfig } from "../config";

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  private translateSubscription: any;

  example: string;

  data: any = {
    greeting: 'Hello',
    recipient: 'World'
  };

  title: string = GlobalConfig.title;
  env: string = GlobalConfig.production;

  styles = {
    color: 'red'
  };

  constructor(
    private translate: TranslateService,
    private store: Store<HostWindowState>
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    this.translateSubscription = this.translate.get('example.with.data', { greeting: 'Hello', recipient: 'DSpace' }).subscribe((translation: string) => {
      this.example = translation;
    });
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    console.log(GlobalConfig.rest.baseURL);
    this.store.dispatch(
      HostWindowActions.resize(event.target.innerWidth, event.target.innerHeight)
    );
  }

}
