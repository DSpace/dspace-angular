import { TestScheduler } from 'rxjs/testing';
import { RequestService } from '../../../core/data/request.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RequestEntry } from '../../../core/data/request-entry.model';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestEntryState } from '../../../core/data/request-entry-state.model';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { RestResponse } from '../../../core/cache/response.models';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { FindAllData } from '../../../core/data/base/find-all-data';
import { testFindAllDataImplementation } from '../../../core/data/base/find-all-data.spec';
import { LdnServicesService } from './ldn-services-data.service';
import { testDeleteDataImplementation } from '../../../core/data/base/delete-data.spec';
import { DeleteData } from '../../../core/data/base/delete-data';
import { testSearchDataImplementation } from '../../../core/data/base/search-data.spec';
import { SearchData } from '../../../core/data/base/search-data';
import { testPatchDataImplementation } from '../../../core/data/base/patch-data.spec';
import { PatchData } from '../../../core/data/base/patch-data';
import { CreateData } from '../../../core/data/base/create-data';
import { testCreateDataImplementation } from '../../../core/data/base/create-data.spec';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';
import { mockLdnService } from '../ldn-service-serviceMock/ldnServicesRD$-mock';
import { createPaginatedList } from '../../../shared/testing/utils.test';


describe('LdnServicesService test', () => {
    let scheduler: TestScheduler;
    let service: LdnServicesService;
    let requestService: RequestService;
    let rdbService: RemoteDataBuildService;
    let objectCache: ObjectCacheService;
    let halService: HALEndpointService;
    let notificationsService: NotificationsService;
    let responseCacheEntry: RequestEntry;

    const endpointURL = `https://rest.api/rest/api/ldn/ldnservices`;
    const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

    const remoteDataMocks = {
        Success: new RemoteData(null, null, null, RequestEntryState.Success, null, null, 200),
    };

    function initTestService() {
        return new LdnServicesService(
            requestService,
            rdbService,
            objectCache,
            halService,
            notificationsService,
        );
    }

    beforeEach(() => {
        scheduler = getTestScheduler();

        objectCache = {} as ObjectCacheService;
        notificationsService = {} as NotificationsService;
        responseCacheEntry = new RequestEntry();
        responseCacheEntry.request = { href: 'https://rest.api/' } as any;
        responseCacheEntry.response = new RestResponse(true, 200, 'Success');

        requestService = jasmine.createSpyObj('requestService', {
            generateRequestId: requestUUID,
            send: true,
            removeByHrefSubstring: {},
            getByHref: observableOf(responseCacheEntry),
            getByUUID: observableOf(responseCacheEntry),
        });

        halService = jasmine.createSpyObj('halService', {
            getEndpoint: observableOf(endpointURL)
        });

        rdbService = jasmine.createSpyObj('rdbService', {
            buildSingle: createSuccessfulRemoteDataObject$({}, 500),
            buildList: cold('a', { a: remoteDataMocks.Success })
        });


        service = initTestService();
    });

    describe('composition', () => {
        const initFindAllService = () => new LdnServicesService(null, null, null, null, null) as unknown as FindAllData<any>;
        const initDeleteService = () => new LdnServicesService(null, null, null, null, null) as unknown as DeleteData<any>;
        const initSearchService = () => new LdnServicesService(null, null, null, null, null) as unknown as SearchData<any>;
        const initPatchService = () => new LdnServicesService(null, null, null, null, null) as unknown as PatchData<any>;
        const initCreateService = () => new LdnServicesService(null, null, null, null, null) as unknown as CreateData<any>;

        testFindAllDataImplementation(initFindAllService);
        testDeleteDataImplementation(initDeleteService);
        testSearchDataImplementation(initSearchService);
        testPatchDataImplementation(initPatchService);
        testCreateDataImplementation(initCreateService);
    });

    describe('custom methods', () => {
        it('should find service by inbound pattern', (done) => {
            const params = [new RequestParam('pattern', 'testPattern')];
            const findListOptions = Object.assign(new FindListOptions(), {}, {searchParams: params});
            spyOn(service, 'searchBy').and.returnValue(observableOf(null));
            spyOn((service as any).searchData, 'searchBy').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([mockLdnService])));

            service.findByInboundPattern('testPattern').subscribe(() => {
                expect(service.searchBy).toHaveBeenCalledWith('byInboundPattern', findListOptions, undefined, undefined );
                done();
            });
        });
    });

});
