import { RemoteData } from '@dspace/core/data/remote-data';
import { Item } from '@dspace/core/shared/item.model';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
} from '@dspace/core/utilities/remote-data.utils';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { hot } from 'jasmine-marbles';

import { findSuccessfulAccordingTo } from './edit-item-operators';

describe('findSuccessfulAccordingTo', () => {
  let mockItem1;
  let mockItem2;
  let predicate;

  beforeEach(() => {
    mockItem1 = new Item();
    mockItem1.isWithdrawn = true;

    mockItem2 = new Item();
    mockItem2.isWithdrawn = false;

    predicate = (rd: RemoteData<Item>) => isNotEmpty(rd.payload) ? rd.payload.isWithdrawn : false;
  });
  it('should return first successful RemoteData Observable that complies to predicate', () => {
    const testRD = {
      a: createSuccessfulRemoteDataObject(undefined),
      b: createFailedRemoteDataObject(),
      c: createSuccessfulRemoteDataObject(mockItem2),
      d: createSuccessfulRemoteDataObject(mockItem1),
      e: createSuccessfulRemoteDataObject(mockItem2),
    };

    const source = hot('abcde', testRD);
    const result = source.pipe(findSuccessfulAccordingTo(predicate));

    expect(result).toBeObservable(hot('---(d|)', { d: testRD.d }));
  });

});
