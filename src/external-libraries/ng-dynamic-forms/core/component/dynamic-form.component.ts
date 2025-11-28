import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { DynamicTemplateDirective } from '../directive/dynamic-template.directive';
import { DynamicFormControlModel } from '../model/dynamic-form-control.model';
import { DynamicFormModel } from '../model/form-group/dynamic-form-group.model';
import {
  DynamicFormComponentService,
  IDynamicFormControlContainer,
} from '../service/dynamic-form-component.service';
import { DynamicFormLayout } from '../service/dynamic-form-layout.service';
import { DynamicFormControlEvent } from './dynamic-form-control-event';



@Directive({
  standalone: true,
})// tslint:disable-next-line:directive-class-suffix
export abstract class DynamicFormComponent implements OnInit, OnDestroy {
  group!: UntypedFormGroup;
  model!: DynamicFormModel;
  layout?: DynamicFormLayout;

  components!: QueryList<IDynamicFormControlContainer>;
  templates!: QueryList<DynamicTemplateDirective>;

  blur?: EventEmitter<DynamicFormControlEvent>;
  change?: EventEmitter<DynamicFormControlEvent>;
  focus?: EventEmitter<DynamicFormControlEvent>;

  protected constructor(protected changeDetectorRef: ChangeDetectorRef, protected componentService: DynamicFormComponentService) {
  }

  ngOnInit(): void {
    this.componentService.registerForm(this);
  }

  ngOnDestroy(): void {
    this.componentService.unregisterForm(this);
  }

  trackByFn(_index: number, model: DynamicFormControlModel): string {
    return model.id;
  }

  markForCheck(): void {
    this.changeDetectorRef.markForCheck();

    if (this.components instanceof QueryList) {
      this.components.forEach(component => component.markForCheck());
    }
  }

  detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  onBlur($event: DynamicFormControlEvent) {
    this.blur?.emit($event);
  }

  onChange($event: DynamicFormControlEvent) {
    this.change?.emit($event);
  }

  onFocus($event: DynamicFormControlEvent) {
    this.focus?.emit($event);
  }

  onCustomEvent($event: DynamicFormControlEvent, customEventEmitter: EventEmitter<DynamicFormControlEvent>) {
    customEventEmitter.emit($event);
  }
}
