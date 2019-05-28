
export const SECTION_LICENSE_FORM_LAYOUT = {

  granted: {
    element: {
      container: 'custom-control custom-checkbox pl-1',
      control: 'custom-control-input',
      label: 'custom-control-label pt-1'
    }
  }
};

export const SECTION_LICENSE_FORM_MODEL = [
  {
    id: 'granted',
    label: 'I confirm the license above',
    required: true,
    value: false,
    validators: {
      required: null
    },
    errorMessages: {
      required: 'You must accept the license',
      notgranted: 'You must accept the license'
    },
    type: 'CHECKBOX',
  }
];
