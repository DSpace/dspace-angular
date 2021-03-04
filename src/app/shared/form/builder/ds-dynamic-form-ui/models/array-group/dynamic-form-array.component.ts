import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormArrayModel,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
  DynamicFormControlLayout,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { Relationship } from '../../../../../../core/shared/item-relationships/relationship.model';
import { hasValue } from '../../../../../empty.util';

@Component({
  selector: 'ds-dynamic-form-array',
  templateUrl: './dynamic-form-array.component.html',
  styleUrls: ['./dynamic-form-array.component.scss']
})
export class DsDynamicFormArrayComponent extends DynamicFormArrayComponent {

  @Input() formLayout: DynamicFormLayout;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicFormArrayModel;
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

    // prevent propagating events generated releasing on the same position
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    this.model.moveGroup(event.previousIndex, event.currentIndex - event.previousIndex);
    const prevIndex = event.previousIndex;
    const index = event.currentIndex;

    if (hasValue(this.model.groups[index]) && hasValue((this.control as any).controls[index])) {
      this.onCustomEvent({
        previousIndex: prevIndex,
        index,
        model: this.model.groups[index].group[0],
        control: (this.control as any).controls[index]
      }, 'move');
    }
  }

  update(event: any, index: number) {
    const $event = Object.assign({}, event, {
      context: { index: index - 1}
    });

    this.onChange($event);
  }
}
