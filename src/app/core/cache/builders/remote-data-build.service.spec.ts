import { RemoteDataBuildService } from './remote-data-build.service';
import { Item } from '../../shared/item.model';
import { PaginatedList } from '../../data/paginated-list';
import { PageInfo } from '../../shared/page-info.model';
import { RemoteData } from '../../data/remote-data';
import { of as observableOf } from 'rxjs';

const pageInfo = new PageInfo();
const array = [
  Object.assign(new Item(), {
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'Item nr 1'
        }
      ]
    }
  }),
  Object.assign(new Item(), {
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'Item nr 2'
        }
      ]
    }
  })
];
const paginatedList = new PaginatedList(pageInfo, array);
const arrayRD = new RemoteData(false, false, true, undefined, array);
const paginatedListRD = new RemoteData(false, false, true, undefined, paginatedList);

describe('RemoteDataBuildService', () => {
  let service: RemoteDataBuildService;

  beforeEach(() => {
    service = new RemoteDataBuildService(undefined, undefined);
  });

  describe('when toPaginatedList is called', () => {
    let expected: RemoteData<PaginatedList<Item>>;

    beforeEach(() => {
      expected = paginatedListRD;
    });

    it('should return the correct remoteData of a paginatedList when the input is a (remoteData of an) array', () => {
      const result = (service as any).toPaginatedList(observableOf(arrayRD), pageInfo);
      result.subscribe((resultRD) => {
        expect(resultRD).toEqual(expected);
      });
    });

    it('should return the correct remoteData of a paginatedList when the input is a (remoteData of a) paginated list', () => {
      const result = (service as any).toPaginatedList(observableOf(paginatedListRD), pageInfo);
      result.subscribe((resultRD) => {
        expect(resultRD).toEqual(expected);
      });
    });
  });
});
