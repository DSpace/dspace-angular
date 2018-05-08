
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
      required: 'You must accept the license'
    },
    type: 'CHECKBOX',
  }
];
