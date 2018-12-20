import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlCustomEvent, DynamicFormControlEvent,
  DynamicFormGroupModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'ds-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DsDynamicFormGroupComponent extends DynamicFormControlComponent {

  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicFormGroupModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | DynamicTemplateDirective[] | undefined;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();
  /* tslint:enable:no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

/*  ngAfterViewInit() {
    if (this.control) {
      this.control.statusChanges.pipe(
        tap((state) => console.log(this.model.id, state)),
        filter((state) => state === 'INVALID'),
        // filter(() => this.control.touched),
      )
        .subscribe((state) => {
          // const instance: DynamicFormControlComponent = this.componentRef.instance as any;
          console.log('group', this.model.id, state);
          // console.log(this.model.hasErrorMessages, this.control.touched, this.hasFocus, this.isInvalid);
          // instance.control.markAsTouched();
          console.log('showErrorMessages ', this.showErrorMessages);
          console.log('hasErrorMessages ', this.model.hasErrorMessages);
          console.log('touched ', this.control.touched);
          console.log('hasFocus ', this.hasFocus);
          console.log('isInvalid ', this.isInvalid);
        });
    }
  }*/

}
