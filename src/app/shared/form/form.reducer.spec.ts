import { FormEntry, formReducer } from './form.reducers';
import {
  FormAddError,
  FormChangeAction, FormClearErrorsAction,
  FormInitAction,
  FormRemoveAction, FormRemoveErrorAction,
  FormStatusChangeAction
} from './form.actions';

describe('formReducer', () => {

  it('should set init state of the form', () => {
    const state = {
      testForm: {
        data: {
          author: null,
          title: null,
          date: null,
          description: null
        },
        valid: false,
        errors: []
      }
    };
    const formId = 'testForm';
    const formData = {
      author: null,
      title: null,
      date: null,
      description: null
    };
    const valid = false;
    const action = new FormInitAction(formId, formData, valid);
    const newState = formReducer({}, action);

    expect(newState).toEqual(state);
  });

  it('should update state of the form when it\'s already present', () => {
    const initState = {
      testForm: {
        data: {
          author: null,
          title: null,
          date: null,
          description: null
        },
        valid: false,
        errors: []
      }
    };
    const formId = 'testForm';
    const formData = {
      author: null,
      title: 'title',
      date: null,
      description: null
    };
    const state = {
      testForm: {
        data: {
          author: null,
          title: 'title',
          date: null,
          description: null
        },
        valid: false,
        errors: []
      }
    };

    const valid = false;
    const action = new FormInitAction(formId, formData, valid);
    const newState = formReducer(initState, action);

    expect(newState).toEqual(state);
  });

  it('should change form data on form change', () => {
    const initState = {
      testForm: {
        data: {
          author: null,
          title: null,
          date: null,
          description: null
        },
        valid: false,
        errors: []
      }
    };
    const state = {
      testForm: {
        data: {
          author: null,
          title: ['test'],
          date: null,
          description: null
        },
        valid: false,
        errors: []
      }
    };
    const formId = 'testForm';
    const formData = {
      author: null,
      title: ['test'],
      date: null,
      description: null
    };

    const action = new FormChangeAction(formId, formData);
    const newState = formReducer(initState, action);

    expect(newState).toEqual(state);
  });

  it('should change form status on form status change', () => {
    const initState = {
      testForm: {
        data: {
          author: null,
          title: ['test'],
          date: null,
          description: null
        },
        valid: false,
        errors: []
      }
    };
    const state = {
      testForm: {
        data: {
          author: null,
          title: ['test'],
          date: null,
          description: null
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
          author: null,
          title: ['test'],
          date: null,
          description: null
        },
        valid: true,
        errors: []
      }
    };

    const expectedErrors = [
      {
        fieldId: 'title',
        message: 'Not valid'
      }
    ];

    const formId = 'testForm';
    const fieldId = 'title';
    const message = 'Not valid';

    const action = new FormAddError(formId, fieldId, message);
    const newState = formReducer(initState, action);

    expect(newState.testForm.errors).toEqual(expectedErrors);
  });

  it('should remove errors from field', () => {
    const initState = {
      testForm: {
        data: {
          author: null,
          title: ['test'],
          date: null,
          description: null
        },
        valid: true,
        errors: [
          {
            fieldId: 'author',
            message: 'error.validation.required'
          },
          {
            fieldId: 'title',
            message: 'error.validation.required'
          }
        ]
      }
    };

    const expectedErrors = [
      {
        fieldId: 'title',
        message: 'error.validation.required'
      }
    ];

    const formId = 'testForm';

    const action = new FormRemoveErrorAction(formId, 'author');
    const newState = formReducer(initState, action);

    expect(newState.testForm.errors).toEqual(expectedErrors);
  });

  it('should remove form state', () => {
    const initState = {
      testForm: {
        data: {
          author: null,
          title: ['test'],
          date: null,
          description: null
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

  it('should clear form errors', () => {
    const initState = {
      testForm: {
        data: {
          author: null,
          title: ['test'],
          date: null,
          description: null
        },
        valid: true,
        errors: [
          {
            fieldId: 'author',
            message: 'error.validation.required'
          }
        ]
      }
    };

    const formId = 'testForm';

    const action = new FormClearErrorsAction(formId);
    const newState = formReducer(initState, action);

    expect(newState.testForm.errors).toEqual([]);
  });
});
