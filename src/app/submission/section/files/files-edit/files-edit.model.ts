import {
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicFormGroupModel,
  DynamicFormControlModel,
} from '@ng-dynamic-forms/core';

export const BITSTREAM_FORM_MODEL: DynamicFormControlModel[] = [

  new DynamicFormGroupModel(
    {
      id: 'files-data',
      group: [

        new DynamicInputModel(
          {
            id: 'title',
            label: 'Title',
            placeholder: 'Title'
          },
          {
            element: {
              container: 'p-0',
              label: 'col-form-label'
            },
            grid: {
              host: 'col-md-12'
            }
          }
        ),

        new DynamicTextAreaModel(
          {
            id: 'description',
            label: 'Description',
            placeholder: 'Description',
            rows: 5
          },
          {
            element: {
              container: 'p-0',
              label: 'col-form-label'
            },
            grid: {
              host: 'col-md-12'
            }
          }
        ),
      ]
    },
    {
      element: {
        control: 'form-row'
      }
    }
  )
];

export const BITSTREAM_FORM_POLICIES_ARRAY_DATA = {
  data: {
    id: 'files-policies',
    initialCount: 1,
    groupFactory: null,
  },
  element: {
    grid: {
      group: 'dsgridgroup form-row'
    }
  }
};

export const BITSTREAM_FORM_POLICIES_SELECT_DATA = {
  data: {
    id: 'policies',
    label: 'Access policies',
    options: []
  },
  element: {
    element: {
      container: 'p-0',
      label: 'col-form-label'
    },
    grid: {
      host: 'col-md-10'
    }
  }
};

export const BITSTREAM_FORM_POLICIES_START_DATE_DATA = {
  data: {
    id: 'policy-start-date',
    label: 'From',
    placeholder: 'from',
    inline: false,
    toggleIcon: 'fa fa-calendar',
    relation: [
      {
        action: 'ENABLE',
        connective: 'OR',
        when: [
          {
            id: 'policies',
            value: 'embargo'
          },
          {
            id: 'policies',
            value: 'lease'
          },
        ]
      }
    ]
  },
  element: {
    element: {
      container: 'p-0',
      label: 'col-form-label'
    },
    grid: {
      host: 'col-md-4'
    }
  }
};

export const BITSTREAM_FORM_POLICIES_END_DATE_DATA = {
  data: {
    id: 'policy-end-date',
    label: 'Until',
    placeholder: 'until',
    inline: false,
    toggleIcon: 'fa fa-calendar',
    relation: [
      {
        action: 'ENABLE',
        connective: 'OR',
        when: [
          {
            id: 'policies',
            value: 'embargo'
          },
          {
            id: 'policies',
            value: 'lease'
          },
        ]
      }
    ]
  },
  element: {
    element: {
      container: 'p-0',
      label: 'col-form-label'
    },
    grid: {
      host: 'col-md-4'
    }
  }
};

export const BITSTREAM_FORM_POLICIES_GROUPS_DATA = {
  data: {
    id: 'policy-group',
    label: 'Group',
    options: [
      {
        label: 'Anonymous',
        value: '11cc35e5-a11d-4b64-b5b9-0052a5d15509'
      }
    ],
    relation: [
      {
        action: 'ENABLE',
        connective: 'OR',
        when: [
          {
            id: 'policies',
            value: 'embargo'
          },
          {
            id: 'policies',
            value: 'lease'
          },
        ]
      }
    ]
  },
  element: {
    element: {
      container: 'p-0',
      label: 'col-form-label'
    },
    grid: {
      host: 'col-md-8'
    }
  }
};
