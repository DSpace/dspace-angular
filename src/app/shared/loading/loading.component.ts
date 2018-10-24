import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../empty.util';

@Component({
  selector: 'ds-loading',
  styleUrls: ['./loading.component.scss'],
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnDestroy, OnInit {

  @Input() message: string;

  private subscription: Subscription;

  constructor(private translate: TranslateService) {

  }

  ngOnInit() {
    if (this.message === undefined) {
      this.subscription = this.translate.get('loading.default').subscribe((message: string) => {
        this.message = message;
      });
    }
  }

  ngOnDestroy() {
    if (hasValue(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }

}
