import {RemoteData} from '../../core/data/remote-data';
import {hot} from 'jasmine-marbles';
import {Item} from '../../core/shared/item.model';
import {findSuccessfulAccordingTo} from './edit-item-operators';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject
} from '../../shared/remote-data.utils';

describe('findSuccessfulAccordingTo', () => {
  let mockItem1;
  let mockItem2;
  let predicate;

  beforeEach(() => {
    mockItem1 = new Item();
    mockItem1.isWithdrawn = true;

    mockItem2 = new Item();
    mockItem1.isWithdrawn = false;

    predicate = (rd: RemoteData<Item>) => rd.payload.isWithdrawn;
  });
  it('should return first successful RemoteData Observable that complies to predicate', () => {
    const testRD = {
      a: createSuccessfulRemoteDataObject(undefined),
      b: createFailedRemoteDataObject(mockItem1),
      c: createSuccessfulRemoteDataObject(mockItem2),
      d: createSuccessfulRemoteDataObject(mockItem1),
      e: createSuccessfulRemoteDataObject(mockItem2),
    };

    const source = hot('abcde', testRD);
    const result = source.pipe(findSuccessfulAccordingTo(predicate));

    result.subscribe((value) => expect(value).toEqual(testRD.d));
  });

});
