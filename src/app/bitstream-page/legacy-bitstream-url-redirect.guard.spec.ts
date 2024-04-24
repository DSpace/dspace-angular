import { EMPTY } from 'rxjs';
import { BitstreamDataService } from '../core/data/bitstream-data.service';
import { RemoteData } from '../core/data/remote-data';
import { RequestEntryState } from '../core/data/request-entry-state.model';
import { legacyBitstreamURLRedirectGuard } from './legacy-bitstream-url-redirect.guard';
import { RouterStub } from '../shared/testing/router.stub';
import { ServerResponseServiceStub } from '../shared/testing/server-response-service.stub';
import { fakeAsync } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { PAGE_NOT_FOUND_PATH } from '../app-routing-paths';
import { Bitstream } from '../core/shared/bitstream.model';

describe('legacyBitstreamURLRedirectGuard', () => {
  let resolver: any;
  let bitstreamDataService: BitstreamDataService;
  let remoteDataMocks: { [type: string]: RemoteData<any> };
  let route;
  let state;
  let serverResponseService: ServerResponseServiceStub;
  let router: RouterStub;

  beforeEach(() => {
    route = {
      params: {},
      queryParams: {}
    };
    router = new RouterStub();
    serverResponseService = new ServerResponseServiceStub();
    state = {};
    remoteDataMocks = {
      RequestPending: new RemoteData(undefined, 0, 0, RequestEntryState.RequestPending, undefined, undefined, undefined),
      ResponsePending: new RemoteData(undefined, 0, 0, RequestEntryState.ResponsePending, undefined, undefined, undefined),
      Success: new RemoteData(0, 0, 0, RequestEntryState.Success, undefined, new Bitstream(), 200),
      NoContent: new RemoteData(0, 0, 0, RequestEntryState.Success, undefined, undefined, 204),
      Error: new RemoteData(0, 0, 0, RequestEntryState.Error, 'Internal server error', undefined, 500),
    };
    bitstreamDataService = {
      findByItemHandle: () => undefined
    } as any;
    resolver = legacyBitstreamURLRedirectGuard;
  });

  describe(`resolve`, () => {
    describe(`For JSPUI-style URLs`, () => {
      beforeEach(() => {
        spyOn(bitstreamDataService, 'findByItemHandle').and.returnValue(EMPTY);
        route = Object.assign({}, route, {
          params: {
            prefix: '123456789',
            suffix: '1234',
            filename: 'some-file.pdf',
            sequence_id: '5'
          }
        });
      });
      it(`should call findByItemHandle with the handle, sequence id, and filename from the route`, () => {
        resolver(route, state, bitstreamDataService, serverResponseService, router);
        expect(bitstreamDataService.findByItemHandle).toHaveBeenCalledWith(
          `${route.params.prefix}/${route.params.suffix}`,
          route.params.sequence_id,
          route.params.filename
        );
      });
    });

    describe(`For XMLUI-style URLs`, () => {
      describe(`when there is a sequenceId query parameter`, () => {
        beforeEach(() => {
          spyOn(bitstreamDataService, 'findByItemHandle').and.returnValue(EMPTY);
          route = Object.assign({}, route, {
            params: {
              prefix: '123456789',
              suffix: '1234',
              filename: 'some-file.pdf',
            },
            queryParams: {
              sequenceId: '5'
            }
          });
        });
        it(`should call findByItemHandle with the handle and filename from the route, and the sequence ID from the queryParams`, () => {
          resolver(route, state, bitstreamDataService, serverResponseService, router);
          expect(bitstreamDataService.findByItemHandle).toHaveBeenCalledWith(
            `${route.params.prefix}/${route.params.suffix}`,
            route.queryParams.sequenceId,
            route.params.filename
          );
        });
      });
      describe(`when there's no sequenceId query parameter`, () => {
        beforeEach(() => {
          spyOn(bitstreamDataService, 'findByItemHandle').and.returnValue(EMPTY);
          route = Object.assign({}, route, {
            params: {
              prefix: '123456789',
              suffix: '1234',
              filename: 'some-file.pdf',
            },
          });
        });
        it(`should call findByItemHandle with the handle, and filename from the route`, () => {
          resolver(route, state, bitstreamDataService, serverResponseService, router);
          expect(bitstreamDataService.findByItemHandle).toHaveBeenCalledWith(
            `${route.params.prefix}/${route.params.suffix}`,
            undefined,
            route.params.filename
          );
        });
      });
    });
    describe('should return and complete after the RemoteData has...', () => {
      it('...failed', fakeAsync(() => {
        spyOn(router, 'createUrlTree').and.callThrough();
        spyOn(bitstreamDataService, 'findByItemHandle').and.returnValue(cold('a-b-c', {
          a: remoteDataMocks.RequestPending,
          b: remoteDataMocks.ResponsePending,
          c: remoteDataMocks.Error,
        }));
        resolver(route, state, bitstreamDataService, serverResponseService, router).subscribe(() => {
          expect(bitstreamDataService.findByItemHandle).toHaveBeenCalled();
          expect(router.createUrlTree).toHaveBeenCalledWith([PAGE_NOT_FOUND_PATH]);
        });
      }));

      it('...succeeded without content', fakeAsync(() => {
        spyOn(router, 'createUrlTree').and.callThrough();
        spyOn(bitstreamDataService, 'findByItemHandle').and.returnValue(cold('a-b-c', {
          a: remoteDataMocks.RequestPending,
          b: remoteDataMocks.ResponsePending,
          c: remoteDataMocks.NoContent,
        }));
        resolver(route, state, bitstreamDataService, serverResponseService, router).subscribe(() => {
          expect(bitstreamDataService.findByItemHandle).toHaveBeenCalled();
          expect(router.createUrlTree).toHaveBeenCalledWith([PAGE_NOT_FOUND_PATH]);
        });
      }));

      it('...succeeded', fakeAsync(() => {
        spyOn(serverResponseService, 'setStatus').and.callThrough();
        spyOn(bitstreamDataService, 'findByItemHandle').and.returnValue(cold('a-b-c', {
          a: remoteDataMocks.RequestPending,
          b: remoteDataMocks.ResponsePending,
          c: remoteDataMocks.Success,
        }));
        resolver(route, state, bitstreamDataService, serverResponseService, router).subscribe(() => {
          expect(bitstreamDataService.findByItemHandle).toHaveBeenCalled();
          expect(serverResponseService.setStatus).toHaveBeenCalledWith(301);
          expect(router.parseUrl).toHaveBeenCalled();
        });
      }));
    });
  });
});
