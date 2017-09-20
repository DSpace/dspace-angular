import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver, forwardRef, Host, Inject,
  Input,
  OnDestroy, OnInit, Optional,
  ViewChild,
} from '@angular/core';

import { BoxDataModel } from '../box.model';
import { BoxFactoryComponent, FactoryDataModel } from '../box.factory'
import { BoxService } from '../box.service';
import { SubmissionSubmitFormComponent } from '../../submission-submit-form.component';
import { BasicInformationBoxComponent } from '../basic-information/submission-submit-form-box-basic-information.component';
import { assign } from 'rxjs/util/assign';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../../../../../shared/empty.util';

@Component({
  selector: 'ds-submission-submit-form-box-handler',
  styleUrls: ['./submission-submit-form-box-handler.component.scss'],
  templateUrl: './submission-submit-form-box-handler.component.html'
})
export class SubmissionSubmitFormBoxHandlerComponent implements OnInit {
  boxList: any;
  boxesEnabled = [];

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private boxService: BoxService) {}

  ngOnInit() {
    this.subs.push(this.boxService.getAvailableBoxList()
      .subscribe((list: any) => {
        this.boxList = list
      }));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.boxService.loadDefaultBox();
    });
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  addBox(event) {
    this.boxService.addBox(event);
  }
}
