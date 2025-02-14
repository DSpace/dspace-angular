// eslint-disable-next-line import/no-namespace
import * as deepFreeze from 'deep-freeze';

import {
  CommitPatchOperationsAction,
  DeletePendingJsonPatchOperationsAction,
  FlushPatchOperationsAction,
  NewPatchAddOperationAction,
  NewPatchRemoveOperationAction,
  RollbacktPatchOperationsAction,
  StartTransactionPatchOperationsAction,
} from './json-patch-operations.actions';
import {
  JsonPatchOperationsEntry,
  jsonPatchOperationsReducer,
  JsonPatchOperationsResourceEntry,
  JsonPatchOperationsState,
} from './json-patch-operations.reducer';

class NullAction extends NewPatchAddOperationAction {
  resourceType: string;
  resourceId: string;
  path: string;
  value: any;

  constructor() {
    super(null, null, null, null);
    this.type = null;
  }
}

describe('jsonPatchOperationsReducer test suite', () => {
  const testJsonPatchResourceType = 'testResourceType';
  const testJsonPatchResourceId = 'testResourceId';
  const testJsonPatchResourceAnotherId = 'testResourceAnotherId';
  const testJsonPatchResourcePath = '/testResourceType/testResourceId/testField';
  const testJsonPatchResourceValue = ['test'];
  const patchOpBody = [{
    op: 'add',
    path: '/testResourceType/testResourceId/testField',
    value: ['test'],
  }];
  const timestampBeforeStart = 1545994811991;
  const timestampAfterStart = 1545994837492;
  const startTimestamp = 1545994827492;
  const testState: JsonPatchOperationsState = {
    testResourceType: {
      children: {
        testResourceId: {
          body: [
            {
              operation: {
                op: 'add',
                path: '/testResourceType/testResourceId/testField',
                value: ['test'],
              },
              timeCompleted: timestampBeforeStart,
            },
          ],
        } as JsonPatchOperationsEntry,
      },
      transactionStartTime: null,
      commitPending: false,
    } as JsonPatchOperationsResourceEntry,
  };

  let initState: JsonPatchOperationsState;

  const anotherTestState: JsonPatchOperationsState = {
    testResourceType: {
      children: {
        testResourceId: {
          body: [
            {
              operation: {
                op: 'add',
                path: '/testResourceType/testResourceId/testField',
                value: ['test'],
              },
              timeCompleted: timestampBeforeStart,
            },
            {
              operation: {
                op: 'remove',
                path: '/testResourceType/testResourceId/testField',
              },
              timeCompleted: timestampBeforeStart,
            },
          ],
        } as JsonPatchOperationsEntry,
      },
      transactionStartTime: null,
      commitPending: false,
    } as JsonPatchOperationsResourceEntry,
  };
  deepFreeze(testState);

  beforeEach(() => {
    spyOn(Date.prototype, 'getTime').and.callFake(() => {
      return timestampBeforeStart;
    });
  });

  it('should start with an empty state', () => {
    const action = new NullAction();
    const initialState = jsonPatchOperationsReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = jsonPatchOperationsReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  describe('When a new patch operation actions have been dispatched', () => {

    it('should return the properly state when it is empty', () => {
      const action = new NewPatchAddOperationAction(
        testJsonPatchResourceType,
        testJsonPatchResourceId,
        testJsonPatchResourcePath,
        testJsonPatchResourceValue);
      const newState = jsonPatchOperationsReducer(undefined, action);

      expect(newState).toEqual(testState);
    });

    it('should return the properly state when it is not empty', () => {
      const action = new NewPatchRemoveOperationAction(
        testJsonPatchResourceType,
        testJsonPatchResourceId,
        testJsonPatchResourcePath);
      const newState = jsonPatchOperationsReducer(testState, action);

      expect(newState).toEqual(anotherTestState);
    });
  });

  describe('When StartTransactionPatchOperationsAction has been dispatched', () => {
    it('should set \'transactionStartTime\' and \'commitPending\' to true', () => {
      const action = new StartTransactionPatchOperationsAction(
        testJsonPatchResourceType,
        testJsonPatchResourceId,
        startTimestamp);
      const newState = jsonPatchOperationsReducer(testState, action);

      expect(newState[testJsonPatchResourceType].transactionStartTime).toEqual(startTimestamp);
      expect(newState[testJsonPatchResourceType].commitPending).toBeTruthy();
    });
  });

  describe('When CommitPatchOperationsAction has been dispatched', () => {
    it('should set \'commitPending\' to false ', () => {
      const action = new CommitPatchOperationsAction(
        testJsonPatchResourceType,
        testJsonPatchResourceId);
      initState = Object.assign({}, testState, {
        [testJsonPatchResourceType]: Object.assign({}, testState[testJsonPatchResourceType], {
          transactionStartTime: startTimestamp,
          commitPending: true,
        }),
      });
      const newState = jsonPatchOperationsReducer(initState, action);

      expect(newState[testJsonPatchResourceType].transactionStartTime).toEqual(startTimestamp);
      expect(newState[testJsonPatchResourceType].commitPending).toBeFalsy();
    });
  });

  describe('When RollbacktPatchOperationsAction has been dispatched', () => {
    it('should set \'transactionStartTime\' to null and \'commitPending\' to false ', () => {
      const action = new RollbacktPatchOperationsAction(
        testJsonPatchResourceType,
        testJsonPatchResourceId);
      initState = Object.assign({}, testState, {
        [testJsonPatchResourceType]: Object.assign({}, testState[testJsonPatchResourceType], {
          transactionStartTime: startTimestamp,
          commitPending: true,
        }),
      });
      const newState = jsonPatchOperationsReducer(initState, action);

      expect(newState[testJsonPatchResourceType].transactionStartTime).toBeNull();
      expect(newState[testJsonPatchResourceType].commitPending).toBeFalsy();
    });
  });

  describe('When FlushPatchOperationsAction has been dispatched', () => {

    it('should flush only committed operations', () => {
      const action = new FlushPatchOperationsAction(
        testJsonPatchResourceType,
        testJsonPatchResourceId);
      initState = Object.assign({}, testState, {
        [testJsonPatchResourceType]: Object.assign({}, testState[testJsonPatchResourceType], {
          children: {
            testResourceId: {
              body: [
                {
                  operation: {
                    op: 'add',
                    path: '/testResourceType/testResourceId/testField',
                    value: ['test'],
                  },
                  timeCompleted: timestampBeforeStart,
                },
                {
                  operation: {
                    op: 'remove',
                    path: '/testResourceType/testResourceId/testField',
                  },
                  timeCompleted: timestampAfterStart,
                },
              ],
            } as JsonPatchOperationsEntry,
          },
          transactionStartTime: startTimestamp,
          commitPending: false,
        }),
      });
      const newState = jsonPatchOperationsReducer(initState, action);
      const expectedBody: any = [
        {
          operation: {
            op: 'remove',
            path: '/testResourceType/testResourceId/testField',
          },
          timeCompleted: timestampAfterStart,
        },
      ];
      expect(newState[testJsonPatchResourceType].transactionStartTime).toBeNull();
      expect(newState[testJsonPatchResourceType].commitPending).toBeFalsy();
      expect(newState[testJsonPatchResourceType].children[testJsonPatchResourceId].body).toEqual(expectedBody);
    });

    beforeEach(() => {
      initState = Object.assign({}, testState, {
        [testJsonPatchResourceType]: Object.assign({}, testState[testJsonPatchResourceType], {
          children: {
            testResourceId: {
              body: [
                {
                  operation: {
                    op: 'add',
                    path: '/testResourceType/testResourceId/testField',
                    value: ['test'],
                  },
                  timeCompleted: timestampBeforeStart,
                },
                {
                  operation: {
                    op: 'remove',
                    path: '/testResourceType/testResourceId/testField',
                  },
                  timeCompleted: timestampBeforeStart,
                },
              ],
            } as JsonPatchOperationsEntry,
            testResourceAnotherId: {
              body: [
                {
                  operation: {
                    op: 'add',
                    path: '/testResourceType/testResourceAnotherId/testField',
                    value: ['test'],
                  },
                  timeCompleted: timestampBeforeStart,
                },
                {
                  operation: {
                    op: 'remove',
                    path: '/testResourceType/testResourceAnotherId/testField',
                  },
                  timeCompleted: timestampBeforeStart,
                },
              ],
            } as JsonPatchOperationsEntry,
          },
          transactionStartTime: startTimestamp,
          commitPending: false,
        }),
      });
    });

    it('should flush committed operations for specified resource id', () => {
      const action = new FlushPatchOperationsAction(
        testJsonPatchResourceType,
        testJsonPatchResourceId);
      const newState = jsonPatchOperationsReducer(initState, action);
      const expectedBody: any = [
        {
          operation: {
            op: 'add',
            path: '/testResourceType/testResourceAnotherId/testField',
            value: ['test'],
          },
          timeCompleted: timestampBeforeStart,
        },
        {
          operation: {
            op: 'remove',
            path: '/testResourceType/testResourceAnotherId/testField',
          },
          timeCompleted: timestampBeforeStart,
        },
      ];
      expect(newState[testJsonPatchResourceType].transactionStartTime).toBeNull();
      expect(newState[testJsonPatchResourceType].commitPending).toBeFalsy();
      expect(newState[testJsonPatchResourceType].children[testJsonPatchResourceId].body).toEqual([]);
      expect(newState[testJsonPatchResourceType].children[testJsonPatchResourceAnotherId].body).toEqual(expectedBody);
    });

    it('should flush operation list', () => {
      const action = new FlushPatchOperationsAction(testJsonPatchResourceType, undefined);
      const newState = jsonPatchOperationsReducer(initState, action);

      expect(newState[testJsonPatchResourceType].transactionStartTime).toBeNull();
      expect(newState[testJsonPatchResourceType].commitPending).toBeFalsy();
      expect(newState[testJsonPatchResourceType].children[testJsonPatchResourceId].body).toEqual([]);
      expect(newState[testJsonPatchResourceType].children[testJsonPatchResourceAnotherId].body).toEqual([]);
    });

  });

  describe('When DeletePendingJsonPatchOperationsAction has been dispatched', () => {
    it('should set set the JsonPatchOperationsState to null ', () => {
      const action = new DeletePendingJsonPatchOperationsAction();
      initState = Object.assign({}, testState, {
        [testJsonPatchResourceType]: Object.assign({}, testState[testJsonPatchResourceType], {
          transactionStartTime: startTimestamp,
          commitPending: true,
        }),
      });
      const newState = jsonPatchOperationsReducer(initState, action);

      expect(newState).toBeNull();
    });
  });

  describe('dedupeOperationEntries', () => {
    it('should not remove duplicated keys if operations are not sequential', () => {
      initState = {
        sections: {
          children: {
            publicationStep: {
              body: [
                {
                  operation: {
                    op: 'add',
                    path: '/sections/publicationStep/dc.date.issued',
                    value: [
                      {
                        value: '2024-06',
                        language: null,
                        authority: null,
                        display: '2024-06',
                        confidence: -1,
                        place: 0,
                        otherInformation: null,
                      },
                    ],
                  },
                  timeCompleted: timestampBeforeStart,
                },
                {
                  operation: {
                    op: 'replace',
                    path: '/sections/publicationStep/dc.date.issued/0',
                    value: {
                      value: '2023-06-19',
                      language: null,
                      authority: null,
                      display: '2023-06-19',
                      confidence: -1,
                      place: 0,
                      otherInformation: null,
                    },
                  },
                  timeCompleted: timestampBeforeStart,
                },
              ],
            } as JsonPatchOperationsEntry,
          },
          transactionStartTime: null,
          commitPending: false,
        } as JsonPatchOperationsResourceEntry,
      };

      const value = [
        {
          value: '2024-06-19',
          language: null,
          authority: null,
          display: '2024-06-19',
          confidence: -1,
          place: 0,
          otherInformation: null,
        },
      ];
      const action = new NewPatchAddOperationAction(
        'sections',
        'publicationStep',
        '/sections/publicationStep/dc.date.issued',
        value);
      const newState = jsonPatchOperationsReducer(initState, action);

      const expectedBody: any =  [
        {
          'operation': {
            'op': 'add',
            'path': '/sections/publicationStep/dc.date.issued',
            'value': [
              {
                'value': '2024-06',
                'language': null,
                'authority': null,
                'display': '2024-06',
                'confidence': -1,
                'place': 0,
                'otherInformation': null,
              },
            ],
          },
          'timeCompleted': timestampBeforeStart,
        },
        {
          'operation': {
            'op': 'replace',
            'path': '/sections/publicationStep/dc.date.issued/0',
            'value': {
              'value': '2023-06-19',
              'language': null,
              'authority': null,
              'display': '2023-06-19',
              'confidence': -1,
              'place': 0,
              'otherInformation': null,
            },
          },
          'timeCompleted': timestampBeforeStart,
        },
        {
          'operation': {
            'op': 'add',
            'path': '/sections/publicationStep/dc.date.issued',
            'value': [
              {
                'value': '2024-06-19',
                'language': null,
                'authority': null,
                'display': '2024-06-19',
                'confidence': -1,
                'place': 0,
                'otherInformation': null,
              },
            ],
          },
          'timeCompleted': timestampBeforeStart,
        },
      ];

      expect(newState.sections.children.publicationStep.body).toEqual(expectedBody);

    });

    it('should remove duplicated keys if operations are sequential', () => {
      initState = {
        sections: {
          children: {
            publicationStep: {
              body: [
                {
                  operation: {
                    op: 'add',
                    path: '/sections/publicationStep/dc.date.issued',
                    value: [
                      {
                        value: '2024-06',
                        language: null,
                        authority: null,
                        display: '2024-06',
                        confidence: -1,
                        place: 0,
                        otherInformation: null,
                      },
                    ],
                  },
                  timeCompleted: timestampBeforeStart,
                },
                {
                  operation: {
                    op: 'replace',
                    path: '/sections/publicationStep/dc.date.issued/0',
                    value: {
                      value: '2023-06-19',
                      language: null,
                      authority: null,
                      display: '2023-06-19',
                      confidence: -1,
                      place: 0,
                      otherInformation: null,
                    },
                  },
                  timeCompleted: timestampBeforeStart,
                },
                {
                  'operation': {
                    'op': 'add',
                    'path': '/sections/publicationStep/dc.date.issued',
                    'value': [
                      {
                        'value': '2024-06-19',
                        'language': null,
                        'authority': null,
                        'display': '2024-06-19',
                        'confidence': -1,
                        'place': 0,
                        'otherInformation': null,
                      },
                    ],
                  },
                  'timeCompleted': timestampBeforeStart,
                },
              ],
            } as JsonPatchOperationsEntry,
          },
          transactionStartTime: null,
          commitPending: false,
        } as JsonPatchOperationsResourceEntry,
      };

      const value = [
        {
          value: '2024-06-20',
          language: null,
          authority: null,
          display: '2024-06-20',
          confidence: -1,
          place: 0,
          otherInformation: null,
        },
      ];
      const action = new NewPatchAddOperationAction(
        'sections',
        'publicationStep',
        '/sections/publicationStep/dc.date.issued',
        value);
      const newState = jsonPatchOperationsReducer(initState, action);

      const expectedBody: any =  [
        {
          'operation': {
            'op': 'add',
            'path': '/sections/publicationStep/dc.date.issued',
            'value': [
              {
                'value': '2024-06',
                'language': null,
                'authority': null,
                'display': '2024-06',
                'confidence': -1,
                'place': 0,
                'otherInformation': null,
              },
            ],
          },
          'timeCompleted': timestampBeforeStart,
        },
        {
          'operation': {
            'op': 'replace',
            'path': '/sections/publicationStep/dc.date.issued/0',
            'value': {
              'value': '2023-06-19',
              'language': null,
              'authority': null,
              'display': '2023-06-19',
              'confidence': -1,
              'place': 0,
              'otherInformation': null,
            },
          },
          'timeCompleted': timestampBeforeStart,
        },
        {
          'operation': {
            'op': 'add',
            'path': '/sections/publicationStep/dc.date.issued',
            'value': [
              {
                'value': '2024-06-20',
                'language': null,
                'authority': null,
                'display': '2024-06-20',
                'confidence': -1,
                'place': 0,
                'otherInformation': null,
              },
            ],
          },
          'timeCompleted': timestampBeforeStart,
        },
      ];

      expect(newState.sections.children.publicationStep.body).toEqual(expectedBody);

    });

    it('should remove duplicated keys if all operations have same key', () => {
      initState = {
        sections: {
          children: {
            publicationStep: {
              body: [
                {
                  operation: {
                    op: 'add',
                    path: '/sections/publicationStep/dc.date.issued',
                    value: [
                      {
                        value: '2024',
                        language: null,
                        authority: null,
                        display: '2024-06',
                        confidence: -1,
                        place: 0,
                        otherInformation: null,
                      },
                    ],
                  },
                  timeCompleted: timestampBeforeStart,
                },
                {
                  'operation': {
                    'op': 'add',
                    'path': '/sections/publicationStep/dc.date.issued',
                    'value': [
                      {
                        'value': '2024-06',
                        'language': null,
                        'authority': null,
                        'display': '2024-06',
                        'confidence': -1,
                        'place': 0,
                        'otherInformation': null,
                      },
                    ],
                  },
                  'timeCompleted': timestampBeforeStart,
                },
                {
                  'operation': {
                    'op': 'add',
                    'path': '/sections/publicationStep/dc.date.issued',
                    'value': [
                      {
                        'value': '2024-06-19',
                        'language': null,
                        'authority': null,
                        'display': '2024-06-19',
                        'confidence': -1,
                        'place': 0,
                        'otherInformation': null,
                      },
                    ],
                  },
                  'timeCompleted': timestampBeforeStart,
                },
              ],
            } as JsonPatchOperationsEntry,
          },
          transactionStartTime: null,
          commitPending: false,
        } as JsonPatchOperationsResourceEntry,
      };

      const value = [
        {
          value: '2024-06-20',
          language: null,
          authority: null,
          display: '2024-06-20',
          confidence: -1,
          place: 0,
          otherInformation: null,
        },
      ];
      const action = new NewPatchAddOperationAction(
        'sections',
        'publicationStep',
        '/sections/publicationStep/dc.date.issued',
        value);
      const newState = jsonPatchOperationsReducer(initState, action);

      const expectedBody: any =  [
        {
          'operation': {
            'op': 'add',
            'path': '/sections/publicationStep/dc.date.issued',
            'value': [
              {
                'value': '2024-06-20',
                'language': null,
                'authority': null,
                'display': '2024-06-20',
                'confidence': -1,
                'place': 0,
                'otherInformation': null,
              },
            ],
          },
          'timeCompleted': timestampBeforeStart,
        },
      ];

      expect(newState.sections.children.publicationStep.body).toEqual(expectedBody);

    });
  });
});
