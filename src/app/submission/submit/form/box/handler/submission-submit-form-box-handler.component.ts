import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver, forwardRef, Host, Inject,
  Input,
  OnDestroy, OnInit, Optional,
  ViewChild,
} from '@angular/core';

import { BoxModel } from '../box.model';
import { BoxService } from '../box.service';
import { SubmissionSubmitFormComponent } from '../../submission-submit-form.component';
import { BasicInformationBoxComponent } from '../basic-information/submission-submit-form-box-basic-information.component';

@Component({
  selector: 'ds-submission-submit-form-box-handler',
  styleUrls: ['./submission-submit-form-box-handler.component.scss'],
  templateUrl: './submission-submit-form-box-handler.component.html'
})
export class SubmissionSubmitFormBoxHandlerComponent implements OnInit {
  @Input() boxList?: any;
  currentAddIndex: number = -1;
  boxes: any;
  submitForm: SubmissionSubmitFormComponent;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private boxService: BoxService,
    @Optional() @Host() submitForm?: SubmissionSubmitFormComponent
  ) {
    this.submitForm = submitForm;
  }

  ngOnInit() {
    this.boxList = this.boxService.getAvailableBoxList();
    this.boxes = this.boxService.getBoxes();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadDefaultBox();
    });
  }

  loadDefaultBox() {
    this.boxService.getDeafultBoxList().forEach((box) => {
      this.loadBox(box.idBox);
    });
  }

  loadBox(id) {
    const boxItem = this.boxes.get(id);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(boxItem.component);

    const viewContainerRef = this.submitForm.boxHost.viewContainerRef;

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as BoxModel).data = boxItem.data;
  }

  addBox(event) {
    this.loadBox(event.idBox);
    const index = this.boxList.indexOf(event);
    this.boxList.splice(index, 1);
    console.log(index);
  }
}
