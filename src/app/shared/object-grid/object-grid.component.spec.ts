import { cold, hot } from 'jasmine-marbles';
import { ObjectGridComponent } from './object-grid.component';

describe('ObjectGridComponent', () => {
  const testObjects = [
    { one: 1 },
    { two: 2 },
    { three: 3 },
    { four: 4 },
    { five: 5 },
    { six: 6 },
    { seven: 7 },
    { eight: 8 },
    { nine: 9 },
    { ten: 10 }
  ];
  const mockRD = {
    payload: {
      page: testObjects
    }
  } as any;

  describe('the number of elements', () => {

    // 10 elements are declared in testObject
    it('should be 10 for all screens', () => {
      const comp = new ObjectGridComponent();

      (comp as any)._objects$ = hot('b', { b: mockRD });

      comp.ngOnInit();

      const expected = cold('c', {
        c: [
          testObjects[0], testObjects[1], testObjects[2], testObjects[3], testObjects[4],
          testObjects[5], testObjects[6], testObjects[7], testObjects[8], testObjects[9],
        ]
      });

      const result = comp.results$;

      expect(result).toBeObservable(expected);
    });

    // 5 elements are declared in testObject
    it('should be 5 for all screens', () => {
      const newTestObjects = [
        { one: 1 },
        { two: 2 },
        { three: 3 },
        { four: 4 },
        { five: 5 }
      ];
      const newMockRD = {
        payload: {
          page: newTestObjects
        }
      } as any;
      const comp = new ObjectGridComponent();

      (comp as any)._objects$ = hot('b', { b: newMockRD });

      comp.ngOnInit();

      const expected = cold('c', {
        c: [
          newTestObjects[0], newTestObjects[1], newTestObjects[2], newTestObjects[3], newTestObjects[4]
        ]
      });

      const result = comp.results$;

      expect(result).toBeObservable(expected);
    });

  });

});
