import {
  DynamicDatePickerModelConfig,
  DynamicFormArrayModelConfig,
  DynamicSelectModelConfig,
  DynamicFormGroupModelConfig,
} from '@ng-dynamic-forms/core';

export const BITSTREAM_METADATA_FORM_GROUP_CONFIG: DynamicFormGroupModelConfig = {
  id: 'metadata',
  group: []
};
export const BITSTREAM_METADATA_FORM_GROUP_CLS: any = {
  element: {
    container: 'row',
      label: 'col-form-label'
  },
  grid: {
    control: 'col-sm-12',
      label: 'col-sm-3'
  }
};

export const BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG: DynamicFormArrayModelConfig = {
  id: 'accessConditions',
  groupFactory: null,
};
export const BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS: any = {
  grid: {
    group: 'form-row'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'name',
  label: 'Access condition type',
  options: []
};
export const BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS: any = {
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
  label: 'From',
  placeholder: 'from',
  inline: false,
  toggleIcon: 'fa fa-calendar',
  relation: [
    {
      action: 'ENABLE',
      connective: 'OR',
      when: []
    }
  ]
};
export const BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS: any = {
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
  label: 'Until',
  placeholder: 'until',
  inline: false,
  toggleIcon: 'fa fa-calendar',
  relation: [
    {
      action: 'ENABLE',
      connective: 'OR',
      when: []
    }
  ]
};
export const BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS: any = {
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
  label: 'Group',
  options: [],
  relation: [
    {
      action: 'ENABLE',
      connective: 'OR',
      when: []
    }
  ]
};
export const BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS: any = {
  element: {
    container: 'p-0',
      label: 'col-form-label'
  },
  grid: {
    host: 'col-sm-10'
  }
};
