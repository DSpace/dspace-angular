import { TestBed } from '@angular/core/testing';

import { NotifyInfoService } from './notify-info.service';
import { ConfigurationDataService } from '../../data/configuration-data.service';
import { of } from 'rxjs';

describe('NotifyInfoService', () => {
  let service: NotifyInfoService;
  let configurationDataService: any;

  beforeEach(() => {
    configurationDataService = {
      findByPropertyName: jasmine.createSpy('findByPropertyName').and.returnValue(of({})),
    };
    TestBed.configureTestingModule({
      providers: [
        NotifyInfoService,
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ]
    });
    service = TestBed.inject(NotifyInfoService);
    configurationDataService = TestBed.inject(ConfigurationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve and map coar configuration', () => {
    const mockResponse = { payload: { values: ['true'] } };
    (configurationDataService.findByPropertyName as jasmine.Spy).and.returnValue(of(mockResponse));

    service.isCoarConfigEnabled().subscribe((result) => {
      expect(result).toBe(true);
    });
  });

  it('should retrieve and map LDN local inbox URLs', () => {
    const mockResponse = { values: ['inbox1', 'inbox2'] };
    (configurationDataService.findByPropertyName as jasmine.Spy).and.returnValue(of(mockResponse));

    service.getCoarLdnLocalInboxUrls().subscribe((result) => {
      expect(result).toEqual(['inbox1', 'inbox2']);
    });
  });

  it('should return the inbox relation link', () => {
    expect(service.getInboxRelationLink()).toBe('http://www.w3.org/ns/ldp#inbox');
  });
});
