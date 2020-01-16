import { DataService } from './data.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { Store } from '@ngrx/store';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Observable, of as observableOf } from 'rxjs';
import { FindListOptions } from './request.models';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { compare, Operation } from 'fast-json-patch';
import { DSpaceObject } from '../shared/dspace-object.model';
import { ChangeAnalyzer } from './change-analyzer';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { Item } from '../shared/item.model';
import * as uuidv4 from 'uuid/v4';
import { createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';

const endpoint = 'https://rest.api/core';

// tslint:disable:max-classes-per-file
class NormalizedTestObject extends NormalizedObject<Item> {
}

class TestService extends DataService<any> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected linkPath: string,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<NormalizedTestObject>
  ) {
    super();
  }

  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return observableOf(endpoint);
  }
}

class DummyChangeAnalyzer implements ChangeAnalyzer<NormalizedTestObject> {
  diff(object1: NormalizedTestObject, object2: NormalizedTestObject): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }

}

describe('DataService', () => {
  let service: TestService;
  let options: FindListOptions;
  const requestService = {generateRequestId: () => uuidv4()} as RequestService;
  const halService = {} as HALEndpointService;
  const rdbService = {} as RemoteDataBuildService;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = new DummyChangeAnalyzer() as any;
  const dataBuildService = {
    normalize: (object) => object
  } as NormalizedObjectBuildService;
  const objectCache = {
    addPatch: () => {
      /* empty */
    },
    getObjectBySelfLink: () => {
      /* empty */
    }
  } as any;
  const store = {} as Store<CoreState>;

  function initTestService(): TestService {
    return new TestService(
      requestService,
      rdbService,
      dataBuildService,
      store,
      endpoint,
      halService,
      objectCache,
      notificationsService,
      http,
      comparator,
    );
  }

  service = initTestService();

  describe('getFindAllHref', () => {

    it('should return an observable with the endpoint', () => {
      options = {};

      (service as any).getFindAllHref(options).subscribe((value) => {
          expect(value).toBe(endpoint);
        }
      );
    });

    it('should include page in href if currentPage provided in options', () => {
      options = { currentPage: 2 };
      const expected = `${endpoint}?page=${options.currentPage - 1}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include size in href if elementsPerPage provided in options', () => {
      options = { elementsPerPage: 5 };
      const expected = `${endpoint}?size=${options.elementsPerPage}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include sort href if SortOptions provided in options', () => {
      const sortOptions = new SortOptions('field1', SortDirection.ASC);
      options = { sort: sortOptions };
      const expected = `${endpoint}?sort=${sortOptions.field},${sortOptions.direction}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include startsWith in href if startsWith provided in options', () => {
      options = { startsWith: 'ab' };
      const expected = `${endpoint}?startsWith=${options.startsWith}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    });

    it('should include all provided options in href', () => {
      const sortOptions = new SortOptions('field1', SortDirection.DESC)
      options = {
        currentPage: 6,
        elementsPerPage: 10,
        sort: sortOptions,
        startsWith: 'ab'
      };
      const expected = `${endpoint}?page=${options.currentPage - 1}&size=${options.elementsPerPage}` +
        `&sort=${sortOptions.field},${sortOptions.direction}&startsWith=${options.startsWith}`;

      (service as any).getFindAllHref(options).subscribe((value) => {
        expect(value).toBe(expected);
      });
    })
  });
  describe('patch', () => {
    let operations;
    let selfLink;

    beforeEach(() => {
      operations = [{ op: 'replace', path: '/metadata/dc.title', value: 'random string' } as Operation];
      selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
      spyOn(objectCache, 'addPatch');
    });

    it('should call addPatch on the object cache with the right parameters', () => {
      service.patch(selfLink, operations);
      expect(objectCache.addPatch).toHaveBeenCalledWith(selfLink, operations);
    });
  });

  describe('update', () => {
    let operations;
    let selfLink;
    let dso;
    let dso2;
    const name1 = 'random string';
    const name2 = 'another random string';
    beforeEach(() => {
      operations = [{ op: 'replace', path: '/0/value', value: name2 } as Operation];
      selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';

      dso = new DSpaceObject();
      dso.self = selfLink;
      dso.metadata = [{ key: 'dc.title', value: name1 }];

      dso2 = new DSpaceObject();
      dso2.self = selfLink;
      dso2.metadata = [{ key: 'dc.title', value: name2 }];

      spyOn(service, 'findByHref').and.returnValue(createSuccessfulRemoteDataObject$(dso));
      spyOn(objectCache, 'addPatch');
    });

    it('should call addPatch on the object cache with the right parameters when there are differences', () => {
      service.update(dso2).subscribe();
      expect(objectCache.addPatch).toHaveBeenCalledWith(selfLink, operations);
    });

    it('should not call addPatch on the object cache with the right parameters when there are no differences', () => {
      service.update(dso).subscribe();
      expect(objectCache.addPatch).not.toHaveBeenCalled();
    });
  });
});
