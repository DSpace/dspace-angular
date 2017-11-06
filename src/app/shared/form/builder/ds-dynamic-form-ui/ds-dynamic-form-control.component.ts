import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    DynamicFormValidationService,
    DynamicFormControlComponent,
    DynamicFormControlModel,
    DynamicFormArrayGroupModel,
    DynamicFormControlEvent,
    DynamicTemplateDirective,
    DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
    DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
    DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER,
    DYNAMIC_FORM_CONTROL_TYPE_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_INPUT,
    DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
    DYNAMIC_FORM_CONTROL_TYPE_SELECT,
    DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
    DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER,
    DynamicDatePickerModel
} from '@ng-dynamic-forms/core';

import { DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD } from './models/typeahead/dynamic-typeahead.model';
import { DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.model';

export const enum NGBootstrapFormControlType {

  Array = 1, // 'ARRAY',
  Calendar = 2, // 'CALENDAR',
  Checkbox = 3, // 'CHECKBOX',
  CheckboxGroup = 4, // 'CHECKBOX_GROUP',
  DatePicker = 5, // 'DATEPICKER',
  Group = 6, // 'GROUP',
  Input = 7, // 'INPUT',
  RadioGroup = 8, // 'RADIO_GROUP',
  Select = 9, // 'SELECT',
  TextArea = 10, // 'TEXTAREA',
  TimePicker = 11, // 'TIMEPICKER'
  TypeAhead = 12, // 'TYPEAHEAD'
  ScrollableDropdown = 13 // 'SCROLLABLE_DROPDOWN'
}

@Component({
    selector: 'ds-dynamic-form-control',
    styleUrls: ['../../form.component.scss'],
    templateUrl: './ds-dynamic-form-control.component.html'
})
export class DsDynamicFormControlComponent extends DynamicFormControlComponent implements OnChanges {

  @ContentChildren(DynamicTemplateDirective) contentTemplates: QueryList<DynamicTemplateDirective>;
  // tslint:disable-next-line:no-input-rename
  @Input('templates') inputTemplates: QueryList<DynamicTemplateDirective>;

  @Input() asBootstrapFormGroup = true;
  @Input() bindId = true;
  @Input() context: DynamicFormArrayGroupModel | null = null;
  @Input() group: FormGroup;
  @Input() hasErrorMessaging = false;
  @Input() model: DynamicFormControlModel;

  @Output() blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output() focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  type: NGBootstrapFormControlType | null;

  static getFormControlType(model: DynamicFormControlModel): NGBootstrapFormControlType | null {

    switch (model.type) {

      case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
        return NGBootstrapFormControlType.Array;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
        return NGBootstrapFormControlType.Checkbox;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
        return NGBootstrapFormControlType.CheckboxGroup;

      case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
        const datepickerModel = model as DynamicDatePickerModel;

        return datepickerModel.inline ? NGBootstrapFormControlType.Calendar : NGBootstrapFormControlType.DatePicker;

      case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
        return NGBootstrapFormControlType.Group;

      case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
        return NGBootstrapFormControlType.Input;

      case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
        return NGBootstrapFormControlType.RadioGroup;

      case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
        return NGBootstrapFormControlType.Select;

      case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
        return NGBootstrapFormControlType.TextArea;

      case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
        return NGBootstrapFormControlType.TimePicker;

      case DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD:
        return NGBootstrapFormControlType.TypeAhead;

      case DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN:
        return NGBootstrapFormControlType.ScrollableDropdown;
      default:
          return null;
    }
  }

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected validationService: DynamicFormValidationService) {

    super(changeDetectorRef, validationService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      super.ngOnChanges(changes);
    }

    if (changes.model) {
      this.type = DsDynamicFormControlComponent.getFormControlType(this.model);
    }
  }
}
