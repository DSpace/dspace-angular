import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { ConfigurationDataService } from '../../data/configuration-data.service';
import { AuthorizationDataService } from '../../data/feature-authorization/authorization-data.service';
import { NotifyInfoService } from './notify-info.service';

describe('NotifyInfoService', () => {
  let service: NotifyInfoService;
  let configurationDataService: any;
  let authorizationDataService: any;
  beforeEach(() => {
    authorizationDataService = {
      isAuthorized: jasmine.createSpy('isAuthorized').and.returnValue(of(true)),
    };
    configurationDataService = {
      findByPropertyName: jasmine.createSpy('findByPropertyName').and.returnValue(of({})),
    };
    TestBed.configureTestingModule({
      providers: [
        NotifyInfoService,
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    });
    service = TestBed.inject(NotifyInfoService);
    authorizationDataService = TestBed.inject(AuthorizationDataService);
    configurationDataService = TestBed.inject(ConfigurationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve and map coar configuration', (done: DoneFn) => {
    (configurationDataService.findByPropertyName as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$({ values: ['true'] }));

    service.isCoarConfigEnabled().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should retrieve and map LDN local inbox URLs', (done: DoneFn) => {
    (configurationDataService.findByPropertyName as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$({ values: ['inbox1', 'inbox2'] }));

    service.getCoarLdnLocalInboxUrls().subscribe((result) => {
      expect(result).toEqual(['inbox1', 'inbox2']);
      done();
    });
  });

  it('should return the inbox relation link', () => {
    expect(service.getInboxRelationLink()).toBe('http://www.w3.org/ns/ldp#inbox');
  });
});
