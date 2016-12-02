import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { TranslateService } from 'ng2-translate';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  example: string;

  data: any = {
    greeting: 'Hello',
    recipient: 'World'
  }

  private registerSubscription: any;

  constructor(public translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    this.registerSubscription = this.translate.get('example.with.data', { greeting: 'Hello', recipient: 'DSpace' }).subscribe((translation: string) => {
      this.example = translation;
    });
  }

  ngOnDestroy() {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

}
