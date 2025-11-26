import { Type } from '@angular/core';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from '@dspace/core/shared/form/ds-dynamic-form-constants';
import { DsDynamicFormArrayComponent } from './models/array-group/dynamic-form-array.component';
import { CustomSwitchComponent } from './models/custom-switch/custom-switch.component';
import { DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH } from './models/custom-switch/custom-switch.model';
import { DsDatePickerComponent } from './models/date-picker/date-picker.component';
import { DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER } from './models/date-picker/date-picker.model';
import { DsDatePickerInlineComponent } from './models/date-picker-inline/dynamic-date-picker-inline.component';
import { DsDynamicDisabledComponent } from './models/disabled/dynamic-disabled.component';
import { DYNAMIC_FORM_CONTROL_TYPE_DISABLED } from './models/disabled/dynamic-disabled.model';
import { DsDynamicFormGroupComponent } from './models/form-group/dynamic-form-group.component';
import { DsDynamicListComponent } from './models/list/dynamic-list.component';
import { DynamicListCheckboxGroupModel } from './models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from './models/list/dynamic-list-radio-group.model';
import { DsDynamicLookupComponent } from './models/lookup/dynamic-lookup.component';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP } from './models/lookup/dynamic-lookup.model';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME } from './models/lookup/dynamic-lookup-name.model';
import { DsDynamicOneboxComponent } from './models/onebox/dynamic-onebox.component';
import { DYNAMIC_FORM_CONTROL_TYPE_ONEBOX } from './models/onebox/dynamic-onebox.model';
import { DsDynamicRelationGroupComponent } from './models/relation-group/dynamic-relation-group.components';
import { DsDynamicScrollableDropdownComponent } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DsDynamicTagComponent } from './models/tag/dynamic-tag.component';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './models/tag/dynamic-tag.model';
import { DynamicFormControlModel } from "@ng-dynamic-forms/core/model/dynamic-form-control.model";
import { DynamicFormControl } from "@ng-dynamic-forms/core/component/dynamic-form-control-interface";
import { DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER, DynamicDatePickerModel } from "@ng-dynamic-forms/core/model/datepicker/dynamic-datepicker.model";
import { DYNAMIC_FORM_CONTROL_TYPE_ARRAY } from "@ng-dynamic-forms/core/model/form-array/dynamic-form-array.model";
import { DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX } from "@ng-dynamic-forms/core/model/checkbox/dynamic-checkbox.model";
import { DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP } from "@ng-dynamic-forms/core/model/checkbox/dynamic-checkbox-group.model";
import { DYNAMIC_FORM_CONTROL_TYPE_GROUP } from "@ng-dynamic-forms/core/model/form-group/dynamic-form-group.model";
import { DYNAMIC_FORM_CONTROL_TYPE_INPUT } from "@ng-dynamic-forms/core/model/input/dynamic-input.model";
import { DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP } from "@ng-dynamic-forms/core/model/radio/dynamic-radio-group.model";
import { DYNAMIC_FORM_CONTROL_TYPE_SELECT } from "@ng-dynamic-forms/core/model/select/dynamic-select.model";
import { DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA } from "@ng-dynamic-forms/core/model/textarea/dynamic-textarea.model";
import { DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER } from "@ng-dynamic-forms/core/model/timepicker/dynamic-timepicker.model";
import { DynamicNGBootstrapCheckboxComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/checkbox/dynamic-ng-bootstrap-checkbox.component";
import { DynamicNGBootstrapCheckboxGroupComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/checkbox-group/dynamic-ng-bootstrap-checkbox-group.component";
import { DynamicNGBootstrapCalendarComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/calendar/dynamic-ng-bootstrap-calendar.component";
import { DynamicNGBootstrapInputComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/input/dynamic-ng-bootstrap-input.component";
import { DynamicNGBootstrapRadioGroupComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/radio-group/dynamic-ng-bootstrap-radio-group.component";
import { DynamicNGBootstrapSelectComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/select/dynamic-ng-bootstrap-select.component";
import { DynamicNGBootstrapTextAreaComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/textarea/dynamic-ng-bootstrap-textarea.component";
import { DynamicNGBootstrapTimePickerComponent } from "@ng-dynamic-forms/ui-ng-bootstrap/timepicker/dynamic-ng-bootstrap-timepicker.component";

export function dsDynamicFormControlMapFn(model: DynamicFormControlModel): Type<DynamicFormControl> | null {
  const datepickerModel = model as DynamicDatePickerModel;

  switch (model.type) {
    case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
      return DsDynamicFormArrayComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
      return DynamicNGBootstrapCheckboxComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
      return (model instanceof DynamicListCheckboxGroupModel) ? DsDynamicListComponent : DynamicNGBootstrapCheckboxGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
      return datepickerModel.inline ? DynamicNGBootstrapCalendarComponent : DsDatePickerInlineComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
      return DsDynamicFormGroupComponent;

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

    case DYNAMIC_FORM_CONTROL_TYPE_ONEBOX:
      return DsDynamicOneboxComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN:
      return DsDynamicScrollableDropdownComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_TAG:
      return DsDynamicTagComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP:
      return DsDynamicRelationGroupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER:
      return DsDatePickerComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP:
      return DsDynamicLookupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME:
      return DsDynamicLookupComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_DISABLED:
      return DsDynamicDisabledComponent;

    case DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH:
      return CustomSwitchComponent;

    default:
      return null;
  }
}
