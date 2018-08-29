import {
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges, Type
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
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
  DynamicDatePickerModel, DynamicFormControl,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import { DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD } from './models/typeahead/dynamic-typeahead.model';
import { DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './models/tag/dynamic-tag.model';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from './models/dynamic-group/dynamic-group.model';
import { DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER } from './models/date-picker/date-picker.model';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP } from './models/lookup/dynamic-lookup.model';
import { DynamicListCheckboxGroupModel } from './models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from './models/list/dynamic-list-radio-group.model';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME } from './models/lookup/dynamic-lookup-name.model';

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
  ScrollableDropdown = 13, // 'SCROLLABLE_DROPDOWN'
  Tag = 14, // 'TAG'
  List = 15, // 'TYPELIST'
  Relation = 16, // 'RELATION'
  Date = 17, // 'DATE'
  Lookup = 18, // LOOKUP
  LookupName = 19, // LOOKUP_NAME
}

@Component({
  selector: 'ds-dynamic-form-control',
  styleUrls: ['../../form.component.scss', './ds-dynamic-form.component.scss'],
  templateUrl: './ds-dynamic-form-control.component.html'
})
export class DsDynamicFormControlComponent extends DynamicFormControlContainerComponent implements OnChanges {

  @ContentChildren(DynamicTemplateDirective) contentTemplateList: QueryList<DynamicTemplateDirective>;
  // tslint:disable-next-line:no-input-rename
  @Input('templates') inputTemplateList: QueryList<DynamicTemplateDirective>;

  @Input() formId: string;
  @Input() asBootstrapFormGroup = true;
  @Input() bindId = true;
  @Input() context: any | null = null;
  @Input() group: FormGroup;
  @Input() hasErrorMessaging = false;
  @Input() layout: DynamicFormLayout;
  @Input() model: any;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* tslint:enable:no-output-rename */

  componentType: Type<DynamicFormControl> | null;
  type: NGBootstrapFormControlType | null;

  static getFormControlType(model: DynamicFormControlModel): NGBootstrapFormControlType | null {

    switch (model.type) {

      case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
        return NGBootstrapFormControlType.Array;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
        return NGBootstrapFormControlType.Checkbox;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
        return (model instanceof DynamicListCheckboxGroupModel) ? NGBootstrapFormControlType.List : NGBootstrapFormControlType.CheckboxGroup;

      case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
        const datepickerModel = model as DynamicDatePickerModel;

        return datepickerModel.inline ? NGBootstrapFormControlType.Calendar : NGBootstrapFormControlType.DatePicker;

      case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
        return NGBootstrapFormControlType.Group;

      case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
        return NGBootstrapFormControlType.Input;

      case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
        return (model instanceof DynamicListRadioGroupModel) ? NGBootstrapFormControlType.List : NGBootstrapFormControlType.RadioGroup;

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

      case DYNAMIC_FORM_CONTROL_TYPE_TAG:
        return NGBootstrapFormControlType.Tag;

      case DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP:
        return NGBootstrapFormControlType.Relation;

      case DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER:
        return NGBootstrapFormControlType.Date;

      case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP:
        return NGBootstrapFormControlType.Lookup;

      case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME:
        return NGBootstrapFormControlType.LookupName;

      default:
        return null;
    }
  }

  constructor(protected componentFactoryResolver: ComponentFactoryResolver, protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(componentFactoryResolver, layoutService, validationService);
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
