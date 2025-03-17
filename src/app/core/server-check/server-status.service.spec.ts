import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ServerStatusService } from './server-status.service';
import { RootDataService } from '../data/root-data.service';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';
import { UpdateServerStatusAction } from '../history/server-status.actions';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Root } from '../data/root.model';

describe('ServerStatusService', () => {
  let service: ServerStatusService;
  let rootDataServiceMock;
  let storeMock;
  let routerMock;

  beforeEach(() => {
    rootDataServiceMock = jasmine.createSpyObj('RootDataService', ['invalidateRootCache', 'findRoot']);
    storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        ServerStatusService,
        {provide: RootDataService, useValue: rootDataServiceMock},
        {provide: Store, useValue: storeMock},
        {provide: Router, useValue: routerMock},
      ],
    });

    service = TestBed.inject(ServerStatusService);
  });

  describe('checkServerAvailabilityFromStore', () => {
    it('should return true if the server status is available in the store', (done) => {
      const serverState = {isAvailable: true};
      storeMock.select.and.returnValue(of(serverState));

      service.checkServerAvailabilityFromStore().subscribe((result) => {
        expect(result).toBeTrue();
        expect(storeMock.select).toHaveBeenCalled();
        expect(rootDataServiceMock.invalidateRootCache).not.toHaveBeenCalled();
        done();
      });
    });

    it('should verify root availability if the server status is unavailable in the store', (done) => {
      const serverState = {isAvailable: false};
      storeMock.select.and.returnValue(of(serverState));
      spyOn(service, 'isRootServerAvailable').and.returnValue(of(true));

      service.checkServerAvailabilityFromStore().subscribe((result) => {
        expect(result).toBeTrue();
        expect(storeMock.select).toHaveBeenCalled();
        expect(rootDataServiceMock.invalidateRootCache).toHaveBeenCalled();
        expect(service.isRootServerAvailable).toHaveBeenCalled();
        done();
      });
    });

    it('should return false if the root endpoint is unavailable', (done) => {
      const serverState = {isAvailable: false};
      storeMock.select.and.returnValue(of(serverState));
      spyOn(service, 'isRootServerAvailable').and.returnValue(of(false));

      service.checkServerAvailabilityFromStore().subscribe((result) => {
        expect(result).toBeFalse();
        expect(storeMock.select).toHaveBeenCalled();
        expect(rootDataServiceMock.invalidateRootCache).toHaveBeenCalled();
        expect(service.isRootServerAvailable).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('isRootServerAvailable', () => {
    it('should return true if the root endpoint is available', (done) => {
      rootDataServiceMock.findRoot.and.returnValue(createSuccessfulRemoteDataObject$(new Root()));
      service.isRootServerAvailable().subscribe((result) => {
        expect(result).toBeTrue();
        expect(rootDataServiceMock.findRoot).toHaveBeenCalled();
        done();
      });
    });
    it('should return false if the root endpoint is not available', (done) => {
      rootDataServiceMock.findRoot.and.returnValue(createFailedRemoteDataObject$('error', 500));
      service.isRootServerAvailable().subscribe((result) => {
        expect(result).toBeFalse();
        expect(rootDataServiceMock.findRoot).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('checkAndUpdateServerStatus', () => {
    it('should dispatch an UpdateServerStatusAction if the server is down', (done) => {
      const request = {method: 'GET'} as any;
      const error = {statusCode: 500} as any;
      spyOn(service, 'isRootServerAvailable').and.returnValue(of(false));

      service.checkAndUpdateServerStatus(request, error).subscribe((result) => {
        expect(result).toBeFalse();
        expect(service.isRootServerAvailable).toHaveBeenCalled();
        expect(storeMock.dispatch).toHaveBeenCalledWith(new UpdateServerStatusAction(false));
        done();
      });
    });

    it('should return true if the server is available during the status check', (done) => {
      const request = {method: 'GET'} as any;
      const error = {statusCode: 500} as any;
      spyOn(service, 'isRootServerAvailable').and.returnValue(of(true));

      service.checkAndUpdateServerStatus(request, error).subscribe((result) => {
        expect(result).toBeTrue();
        expect(service.isRootServerAvailable).toHaveBeenCalled();
        expect(storeMock.dispatch).not.toHaveBeenCalled();
        done();
      });
    });

    it('should return true if the error does not match the specified criteria', (done) => {
      const request = {method: 'POST'} as any;
      const error = {statusCode: 500} as any;
      spyOn(service, 'isRootServerAvailable');

      service.checkAndUpdateServerStatus(request, error).subscribe((result) => {
        expect(result).toBeTrue();
        expect(service.isRootServerAvailable).not.toHaveBeenCalled();
        expect(storeMock.dispatch).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('navigateToInternalServerErrorPage', () => {
    it('should invalidate the root cache and navigate to the internal server error page', () => {
      const errorPageRoute = getPageInternalServerErrorRoute();

      service.navigateToInternalServerErrorPage();

      expect(rootDataServiceMock.invalidateRootCache).toHaveBeenCalled();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(errorPageRoute);
    });
  });
});
