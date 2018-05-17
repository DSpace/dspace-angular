import { formReducer } from './form.reducers';
import {
  FormAddError,
  FormChangeAction,
  FormInitAction,
  FormRemoveAction,
  FormStatusChangeAction
} from './form.actions';

describe('formReducer', () => {

  it('should set init state of the form', () => {
    const state = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': null,
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: false,
        errors: []
      }
    };
    const formId = 'testForm';
    const formData = {
      'dc.contributor.author': null,
      'dc.title': null,
      'dc.date.issued': null,
      'dc.description': null
    };
    const valid = false;
    const action = new FormInitAction(formId, formData, valid);
    const newState = formReducer({}, action);

    expect(newState).toEqual(state);
  });

  it('should change form data on form change', () => {
    const initState = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': null,
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: false,
        errors: []
      }
    };
    const state = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': ['test'],
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: false,
        errors: []
      }
    };
    const formId = 'testForm';
    const formData = {
      'dc.contributor.author': null,
      'dc.title': ['test'],
      'dc.date.issued': null,
      'dc.description': null
    };

    const action = new FormChangeAction(formId, formData);
    const newState = formReducer(initState, action);

    expect(newState).toEqual(state);
  });

  it('should change form status on form status change', () => {
    const initState = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': ['test'],
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: false,
        errors: []
      }
    };
    const state = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': ['test'],
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: true,
        errors: []
      }
    };
    const formId = 'testForm';

    const action = new FormStatusChangeAction(formId, true);
    const newState = formReducer(initState, action);

    expect(newState).toEqual(state);
  });

  it('should add error to form state', () => {
    const initState = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': ['test'],
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: true,
        errors: []
      }
    };

    const state = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': ['test'],
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: true,
        errors: [
          {
            fieldId: 'dc.title',
            message: 'Not valid'
          }
        ]
      }
    };

    const formId = 'testForm';
    const fieldId = 'dc.title';
    const message = 'Not valid';

    const action = new FormAddError(formId, fieldId, message);
    const newState = formReducer(initState, action);

    expect(newState).toEqual(state);
  });

  it('should remove form state', () => {
    const initState = {
      testForm: {
        data: {
          'dc.contributor.author': null,
          'dc.title': ['test'],
          'dc.date.issued': null,
          'dc.description': null
        },
        valid: true,
        errors: []
      }
    };

    const formId = 'testForm';

    const action = new FormRemoveAction(formId);
    const newState = formReducer(initState, action);

    expect(newState).toEqual({});
  });
});
