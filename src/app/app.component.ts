import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnDestroy,
  OnInit
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "ng2-translate";

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

  constructor(
    private translate: TranslateService,
    private router: Router
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

}
