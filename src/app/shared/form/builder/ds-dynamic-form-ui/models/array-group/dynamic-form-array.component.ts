import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {
  NgClass,
  NgForOf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';

import { Relationship } from '../../../../../../core/shared/item-relationships/relationship.model';
import { hasValue } from '../../../../../empty.util';
import { DsDynamicFormControlContainerComponent } from '../../ds-dynamic-form-control-container.component';
import { DynamicRowArrayModel } from '../ds-dynamic-row-array-model';

@Component({
  selector: 'ds-dynamic-form-array',
  templateUrl: './dynamic-form-array.component.html',
  styleUrls: ['./dynamic-form-array.component.scss'],
  imports: [
    ReactiveFormsModule,
    CdkDropList,
    NgClass,
    NgForOf,
    CdkDrag,
    CdkDragHandle,
    forwardRef(() => DsDynamicFormControlContainerComponent),
    NgTemplateOutlet,
  ],
  standalone: true,
})
export class DsDynamicFormArrayComponent extends DynamicFormArrayComponent {

  @Input() bindId = true;
  @Input() formModel: DynamicFormControlModel[];
  @Input() formLayout: DynamicFormLayout;
  @Input() group: UntypedFormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicRowArrayModel;// DynamicRow?
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  /* eslint-disable @angular-eslint/no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  /* eslint-enable @angular-eslint/no-output-rename */

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
        arrayModel: this.model,
        model: this.model.groups[index].group[0],
        control: (this.control as any).controls[index],
      }, 'move');
    }
  }

  update(event: any, index: number) {
    const $event = Object.assign({}, event, {
      context: { index: index - 1 },
    });

    this.onChange($event);
  }

  /**
   * If the drag feature is disabled for this DynamicRowArrayModel.
   */
  get dragDisabled(): boolean {
    return this.model.groups.length === 1 || !this.model.isDraggable;
  }
}
