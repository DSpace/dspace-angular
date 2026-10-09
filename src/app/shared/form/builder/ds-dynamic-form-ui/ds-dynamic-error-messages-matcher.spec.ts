import { UntypedFormControl } from '@angular/forms';
import { VocabularyOptions } from '@dspace/core/submission/vocabularies/models/vocabulary-options.model';
import {
  DynamicCheckboxModel,
  DynamicFormControlModel,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';

import { dsDynamicErrorMessagesMatcher } from './ds-dynamic-error-messages-matcher';
import { DynamicCustomSwitchModel } from './models/custom-switch/custom-switch.model';
import { DynamicListCheckboxGroupModel } from './models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from './models/list/dynamic-list-radio-group.model';

describe('dsDynamicErrorMessagesMatcher', () => {
  const vocabularyOptions = new VocabularyOptions('vocabulary');

  const inputModel = new DynamicInputModel({ id: 'title' });
  const checkboxModel = new DynamicCheckboxModel({ id: 'granted' });
  const switchModel = new DynamicCustomSwitchModel({ id: 'toggle' });
  const checkboxListModel = new DynamicListCheckboxGroupModel({ id: 'checkboxList', vocabularyOptions, repeatable: true, required: true });
  const radioListModel = new DynamicListRadioGroupModel({ id: 'radioList', vocabularyOptions, repeatable: false, required: true });

  const match = (model: DynamicFormControlModel, touched: boolean, hasFocus: boolean): boolean => {
    const control = new UntypedFormControl();
    if (touched) {
      control.markAsTouched();
    }
    return dsDynamicErrorMessagesMatcher(control, model, hasFocus);
  };

  it('should not show error messages on an untouched control', () => {
    expect(match(inputModel, false, false)).toBeFalse();
    expect(match(checkboxModel, false, false)).toBeFalse();
    expect(match(checkboxListModel, false, false)).toBeFalse();
  });

  it('should show error messages on a touched control that is not focused', () => {
    expect(match(inputModel, true, false)).toBeTrue();
    expect(match(checkboxModel, true, false)).toBeTrue();
    expect(match(checkboxListModel, true, false)).toBeTrue();
  });

  it('should hide the error message of a focused input, so typing is not interrupted', () => {
    expect(match(inputModel, true, true)).toBeFalse();
  });

  it('should keep the error message of a focused checkbox, so the control does not move under the mouse between mousedown and mouseup', () => {
    expect(match(checkboxModel, true, true)).toBeTrue();
  });

  it('should keep the error message of a focused custom switch', () => {
    expect(match(switchModel, true, true)).toBeTrue();
  });

  it('should keep the error message of a focused list field, whose boxes each take focus of their own', () => {
    expect(match(checkboxListModel, true, true)).toBeTrue();
    expect(match(radioListModel, true, true)).toBeTrue();
  });
});
