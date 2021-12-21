import {
  DynamicDatePickerModelConfig,
  DynamicFormArrayModelConfig,
  DynamicFormControlLayout,
  DynamicFormGroupModelConfig,
  DynamicSelectModelConfig,
  MATCH_ENABLED,
  OR_OPERATOR,
} from '@ng-dynamic-forms/core';


export const ACCESS_FORM_CHECKBOX_LAYOUT: DynamicFormControlLayout = {
  element: {
    host: 'form-group flex-fill access-condition-group',
    id: 'discoverable',
    // disabled: false,
    label: 'submission.sections.accesses.form.discoverable-label',
    name: 'discoverable',
  }
};



export const ACCESS_CONDITION_GROUP_CONFIG: DynamicFormGroupModelConfig = {
  id: 'accessConditionGroup',
  group: []
};

export const ACCESS_CONDITION_GROUP_LAYOUT: DynamicFormControlLayout = {
  element: {
    host: 'form-group flex-fill access-condition-group',
    container: 'pl-1 pr-1',
    control: 'form-row '
  }
};

export const ACCESS_CONDITIONS_FORM_ARRAY_CONFIG: DynamicFormArrayModelConfig = {
  id: 'accessCondition',
  groupFactory: null,
};
export const ACCESS_CONDITIONS_FORM_ARRAY_LAYOUT: DynamicFormControlLayout = {
  grid: {
    group: 'form-row',
  }
};

export const FORM_ACCESS_CONDITION_TYPE_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'name',
  label: 'submission.sections.upload.form.access-condition-label',
  options: []
};
export const FORM_ACCESS_CONDITION_TYPE_LAYOUT: DynamicFormControlLayout = {
  element: {
    host: 'col-12',
    label: 'col-form-label name-label'
  }
};

export const FORM_ACCESS_CONDITION_START_DATE_CONFIG: DynamicDatePickerModelConfig = {
  id: 'startDate',
  label: 'submission.sections.upload.form.from-label',
  placeholder: 'submission.sections.upload.form.from-placeholder',
  inline: false,
  toggleIcon: 'far fa-calendar-alt',
  relations: [
    {
      match: MATCH_ENABLED,
      operator: OR_OPERATOR,
      when: []
    }
  ],
  required: true,
  validators: {
    required: null
  },
  errorMessages: {
    required: 'submission.sections.upload.form.date-required-from'
  }
};
export const FORM_ACCESS_CONDITION_START_DATE_LAYOUT: DynamicFormControlLayout = {
  element: {
    label: 'col-form-label'
  },
  grid: {
    host: 'col-6'
  }
};

export const FORM_ACCESS_CONDITION_END_DATE_CONFIG: DynamicDatePickerModelConfig = {
  id: 'endDate',
  label: 'submission.sections.upload.form.until-label',
  placeholder: 'submission.sections.upload.form.until-placeholder',
  inline: false,
  toggleIcon: 'far fa-calendar-alt',
  relations: [
    {
      match: MATCH_ENABLED,
      operator: OR_OPERATOR,
      when: []
    }
  ],
  required: true,
  validators: {
    required: null
  },
  errorMessages: {
    required: 'submission.sections.upload.form.date-required-until'
  }
};
export const FORM_ACCESS_CONDITION_END_DATE_LAYOUT: DynamicFormControlLayout = {
  element: {
    label: 'col-form-label'
  },
  grid: {
    host: 'col-6'
  }
};
