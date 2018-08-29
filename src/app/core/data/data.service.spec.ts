import { DataService } from './data.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { Store } from '@ngrx/store';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Observable } from 'rxjs/Observable';
import { FindAllOptions } from './request.models';
import { SortOptions, SortDirection } from '../cache/models/sort-options.model';

const LINK_NAME = 'test';
const ENDPOINT = 'https://rest.api/core';

// tslint:disable:max-classes-per-file
class NormalizedTestObject extends NormalizedObject {
}

class TestService extends DataService<NormalizedTestObject, any> {
    constructor(
        protected responseCache: ResponseCacheService,
        protected requestService: RequestService,
        protected rdbService: RemoteDataBuildService,
        protected store: Store<CoreState>,
        protected linkPath: string,
        protected halService: HALEndpointService
    ) {
        super();
    }

    public getBrowseEndpoint(options: FindAllOptions): Observable<string> {
        return Observable.of(ENDPOINT);
    }

}

describe('DataService', () => {
    let service: TestService;
    let options: FindAllOptions;
    const responseCache = {} as ResponseCacheService;
    const requestService = {} as RequestService;
    const halService = {} as HALEndpointService;
    const rdbService = {} as RemoteDataBuildService;
    const store = {} as Store<CoreState>;

    function initTestService(): TestService {
        return new TestService(
            responseCache,
            requestService,
            rdbService,
            store,
            LINK_NAME,
            halService
          );
    }

    service = initTestService();

    describe('getFindAllHref', () => {

        it('should return an observable with the endpoint', () => {
            options = {};

            (service as any).getFindAllHref(options).subscribe((value) => {
                    expect(value).toBe(ENDPOINT);
                }
            );
        });

        it('should include page in href if currentPage provided in options', () => {
            options = { currentPage: 2 };
            const expected = `${ENDPOINT}?page=${options.currentPage - 1}`;

            (service as any).getFindAllHref(options).subscribe((value) => {
                expect(value).toBe(expected);
            });
        });

        it('should include size in href if elementsPerPage provided in options', () => {
            options = { elementsPerPage: 5 };
            const expected = `${ENDPOINT}?size=${options.elementsPerPage}`;

            (service as any).getFindAllHref(options).subscribe((value) => {
                expect(value).toBe(expected);
            });
        });

        it('should include sort href if SortOptions provided in options', () => {
            const sortOptions = new SortOptions('field1', SortDirection.ASC);
            options = { sort:  sortOptions};
            const expected = `${ENDPOINT}?sort=${sortOptions.field},${sortOptions.direction}`;

            (service as any).getFindAllHref(options).subscribe((value) => {
                expect(value).toBe(expected);
            });
        });

        it('should include startsWith in href if startsWith provided in options', () => {
            options = { startsWith: 'ab' };
            const expected = `${ENDPOINT}?startsWith=${options.startsWith}`;

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
            }
            const expected = `${ENDPOINT}?page=${options.currentPage - 1}&size=${options.elementsPerPage}` +
                `&sort=${sortOptions.field},${sortOptions.direction}&startsWith=${options.startsWith}`;

            (service as any).getFindAllHref(options).subscribe((value) => {
                expect(value).toBe(expected);
        });
        })
    });

});
