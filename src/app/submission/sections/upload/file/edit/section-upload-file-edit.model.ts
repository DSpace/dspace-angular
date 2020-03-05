import {
  DynamicDatePickerModelConfig,
  DynamicFormArrayModelConfig,
  DynamicFormControlLayout,
  DynamicFormGroupModelConfig,
  DynamicSelectModelConfig,
  MATCH_ENABLED,
  OR_OPERATOR,
} from '@ng-dynamic-forms/core';

export const BITSTREAM_METADATA_FORM_GROUP_CONFIG: DynamicFormGroupModelConfig = {
  id: 'metadata',
  group: []
};
export const BITSTREAM_METADATA_FORM_GROUP_LAYOUT: DynamicFormControlLayout = {
  element: {
    container: 'form-group',
      label: 'col-form-label'
  },
  grid: {
    label: 'col-sm-3'
  }
};

export const BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG: DynamicFormArrayModelConfig = {
  id: 'accessConditions',
  groupFactory: null,
};
export const BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_LAYOUT: DynamicFormControlLayout = {
  grid: {
    group: 'form-row'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'name',
  label: 'submission.sections.upload.form.access-condition-label',
  options: []
};
export const BITSTREAM_FORM_ACCESS_CONDITION_TYPE_LAYOUT: DynamicFormControlLayout = {
  element: {
    container: 'p-0',
    label: 'col-form-label'
  },
  grid: {
    host: 'col-md-10'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG: DynamicDatePickerModelConfig = {
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
    required: 'submission.sections.upload.form.date-required'
  }
};
export const BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_LAYOUT: DynamicFormControlLayout = {
  element: {
    container: 'p-0',
    label: 'col-form-label'
  },
  grid: {
    host: 'col-md-4'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG: DynamicDatePickerModelConfig = {
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
    required: 'submission.sections.upload.form.date-required'
  }
};
export const BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_LAYOUT: DynamicFormControlLayout = {
  element: {
    container: 'p-0',
    label: 'col-form-label'
  },
  grid: {
    host: 'col-md-4'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'groupUUID',
  label: 'submission.sections.upload.form.group-label',
  options: [],
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
    required: 'submission.sections.upload.form.group-required'
  }
};
export const BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_LAYOUT: DynamicFormControlLayout = {
  element: {
    container: 'p-0',
      label: 'col-form-label'
  },
  grid: {
    host: 'col-sm-10'
  }
};
