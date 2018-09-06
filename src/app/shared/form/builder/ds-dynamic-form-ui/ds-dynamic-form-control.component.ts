import {
  Component, ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges, Type, ViewChild, ViewContainerRef
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
  DynamicDatePickerModel, DynamicFormControl, DynamicFormControlComponent,
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
import { isNotEmpty } from '../../../empty.util';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME } from './models/lookup/dynamic-lookup-name.model';
import { DsDynamicTagComponent } from './models/tag/dynamic-tag.component';
import {
  DynamicNGBootstrapCalendarComponent,
  DynamicNGBootstrapCheckboxComponent,
  DynamicNGBootstrapCheckboxGroupComponent,
  DynamicNGBootstrapDatePickerComponent,
  DynamicNGBootstrapFormArrayComponent,
  DynamicNGBootstrapFormGroupComponent,
  DynamicNGBootstrapInputComponent,
  DynamicNGBootstrapRadioGroupComponent,
  DynamicNGBootstrapSelectComponent,
  DynamicNGBootstrapTextAreaComponent,
  DynamicNGBootstrapTimePickerComponent
} from '@ng-dynamic-forms/ui-ng-bootstrap';
import { DsDatePickerComponent } from './models/date-picker/date-picker.component';
import { DsDynamicListComponent } from './models/list/dynamic-list.component';
import { DsDynamicTypeaheadComponent } from './models/typeahead/dynamic-typeahead.component';
import { DsDynamicScrollableDropdownComponent } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DsDynamicGroupComponent } from './models/dynamic-group/dynamic-group.components';
import { DsDynamicLookupComponent } from './models/lookup/dynamic-lookup.component';

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
  @ViewChild('componentViewContainer', {read: ViewContainerRef}) componentViewContainerRef: ViewContainerRef;

  get componentType(): Type<DynamicFormControl> | null {
    return this.layoutService.getCustomComponentType(this.model) || DsDynamicFormControlComponent.getFormControlType(this.model);
  }

  static getFormControlType(model: DynamicFormControlModel): Type<DynamicFormControl> | null {

    switch (model.type) {

      case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
        return DynamicNGBootstrapFormArrayComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
        return DynamicNGBootstrapCheckboxComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
        return (model instanceof DynamicListCheckboxGroupModel) ? DsDynamicListComponent : DynamicNGBootstrapCheckboxGroupComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
        const datepickerModel = model as DynamicDatePickerModel;

        return datepickerModel.inline ? DynamicNGBootstrapCalendarComponent : DynamicNGBootstrapDatePickerComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
        return DynamicNGBootstrapFormGroupComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
        return DynamicNGBootstrapInputComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
        return (model instanceof DynamicListRadioGroupModel) ? DsDynamicListComponent : DynamicNGBootstrapRadioGroupComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
        return DynamicNGBootstrapSelectComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
        return DynamicNGBootstrapTextAreaComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
        return DynamicNGBootstrapTimePickerComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD:
        return DsDynamicTypeaheadComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN:
        return DsDynamicScrollableDropdownComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_TAG:
        return DsDynamicTagComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP:
        return DsDynamicGroupComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER:
        return DsDatePickerComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP:
        return DsDynamicLookupComponent;

      case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME:
        return DsDynamicLookupComponent;

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
  }

  onChangeLanguage(event) {
    if (isNotEmpty((this.model as any).value)) {
      this.onChange(event);
    }
  }
}
