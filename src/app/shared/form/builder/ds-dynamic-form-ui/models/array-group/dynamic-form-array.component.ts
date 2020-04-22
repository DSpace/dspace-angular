import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
  DynamicFormControlEventType,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { Relationship } from '../../../../../../core/shared/item-relationships/relationship.model';
import { DynamicRowArrayModel } from '../ds-dynamic-row-array-model';
import { hasValue } from '../../../../../empty.util';

@Component({
  selector: 'ds-dynamic-form-array',
  templateUrl: './dynamic-form-array.component.html',
  styleUrls: ['./dynamic-form-array.component.scss']
})
export class DsDynamicFormArrayComponent extends DynamicFormArrayComponent {

  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicRowArrayModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  /* tslint:enable:no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
  ) {
    super(layoutService, validationService);
  }

  moveSelection(event: CdkDragDrop<Relationship>) {
    this.model.moveGroup(event.previousIndex, event.currentIndex - event.previousIndex);
    const prevIndex = event.previousIndex - 1;
    const index = event.currentIndex - 1;

    if (hasValue(this.model.groups[index]) && hasValue((this.control as any).controls[index])) {
      const $event = {
        $event: { previousIndex: prevIndex },
        context: { index },
        control: (this.control as any).controls[index],
        group: this.group,
        model: this.model.groups[index].group[0],
        type: DynamicFormControlEventType.Change
      };

      this.onChange($event);
      }
  }

  update(event: any, index: number) {
    const $event = Object.assign({}, event, {
      context: { index: index - 1}
    });

    this.onChange($event)
  }
}
