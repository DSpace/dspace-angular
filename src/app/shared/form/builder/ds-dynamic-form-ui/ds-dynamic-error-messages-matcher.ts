import { AbstractControl } from '@angular/forms';
import {
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DynamicErrorMessagesMatcher,
  DynamicFormControlModel,
} from '@ng-dynamic-forms/core';

import { DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH } from './models/custom-switch/custom-switch.model';

/**
 * Checkboxes and switches, plus the checkbox and radio groups a `list` field is rendered as.
 */
const CLICK_OPERATED_TYPES = new Set([
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH,
]);

/**
 * Like the library default (`control.touched && !hasFocus`), except that a control the user operates
 * by clicking keeps showing its error message while focused.
 *
 * Hiding it on focus removes an element from the control, which moves the box between the user's
 * mousedown and mouseup; the browser then fires no click at all and the box only ticks on the second
 * attempt. Suppressing the message while the user works on a field only makes sense where there is
 * typing to interrupt, and these have none.
 */
export const dsDynamicErrorMessagesMatcher: DynamicErrorMessagesMatcher =
  (control: AbstractControl, model: DynamicFormControlModel, hasFocus: boolean) =>
    control.touched && (!hasFocus || CLICK_OPERATED_TYPES.has(model?.type));
