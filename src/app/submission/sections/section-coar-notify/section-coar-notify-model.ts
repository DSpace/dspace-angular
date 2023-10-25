export const REQUEST_REVIEW_DROPDOWN = {
  element: {
    container: 'custom-control custom-select pl-1',
    control: 'custom-select',
    label: 'custom-control-label pt-1'
  }
};

export const REQUEST_ENDORSEMENT_DROPDOWN = {
  element: {
    container: 'custom-control custom-select pl-1',
    control: 'custom-select',
    label: 'custom-control-label pt-1'
  }
};

export const REQUEST_INGEST_DROPDOWN = {
  element: {
    container: 'custom-control custom-select pl-1',
    control: 'custom-select',
    label: 'custom-control-label pt-1'
  }
};

export const SECTION_COAR_FORM_LAYOUT = {
  requestReview: REQUEST_REVIEW_DROPDOWN,
  requestEndorsement: REQUEST_ENDORSEMENT_DROPDOWN,
  requestIngest: REQUEST_INGEST_DROPDOWN
};

export const SECTION_COAR_FORM_MODEL = [
  {
    id: 'requestReview',
    label: 'submission.sections.license.request-review-label',
    required: false,
    value: '',
    validators: {
      required: null
    },
    errorMessages: {
      required: 'submission.sections.license.required',
      notgranted: 'submission.sections.license.notgranted'
    },
    type: 'SELECT',
  },
  {
    id: 'requestEndorsement',
    label: 'submission.sections.license.request-endorsement-label',
    required: false,
    value: '',
    validators: {
      required: null
    },
    errorMessages: {
      required: 'submission.sections.license.required',
      notgranted: 'submission.sections.license.notgranted'
    },
    type: 'SELECT',
  },
  {
    id: 'requestIngest',
    label: 'submission.sections.license.request-ingest-label',
    required: false,
    value: '',
    validators: {
      required: null
    },
    errorMessages: {
      required: 'submission.sections.license.required',
      notgranted: 'submission.sections.license.notgranted'
    },
    type: 'SELECT',
  }
];
