import { TestBed } from '@angular/core/testing';

import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import {
  CANONICAL_PREFIX_KEY,
  HandleService,
} from './handle.service';
import { createSuccessfulRemoteDataObject$ } from './remote-data.utils';
import { ConfigurationDataServiceStub } from './testing/configuration-data.service.stub';

describe('HandleService', () => {
  let service: HandleService;

  let configurationService: ConfigurationDataServiceStub;

  beforeEach(() => {
    configurationService = new ConfigurationDataServiceStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigurationDataService, useValue: configurationService },
      ],
    });
    service = TestBed.inject(HandleService);
  });

  describe(`normalizeHandle`, () => {
    it('should normalize a handle url with custom conical prefix with trailing slash', (done: DoneFn) => {
      spyOn(configurationService, 'findByPropertyName').and.returnValue(createSuccessfulRemoteDataObject$({
        ... new ConfigurationProperty(),
        name: CANONICAL_PREFIX_KEY,
        values: ['https://hdl.handle.net/'],
      }));

      service.normalizeHandle('https://hdl.handle.net/123456789/123456').subscribe((handle: string | null) => {
        expect(handle).toBe('123456789/123456');
        done();
      });
    });

    it('should normalize a handle url with custom conical prefix without trailing slash', (done: DoneFn) => {
      spyOn(configurationService, 'findByPropertyName').and.returnValue(createSuccessfulRemoteDataObject$({
        ... new ConfigurationProperty(),
        name: CANONICAL_PREFIX_KEY,
        values: ['https://hdl.handle.net/'],
      }));

      service.normalizeHandle('https://hdl.handle.net/123456789/123456').subscribe((handle: string | null) => {
        expect(handle).toBe('123456789/123456');
        done();
      });
    });

    describe('should simply return an already normalized handle', () => {
      it('123456789/123456', (done: DoneFn) => {
        service.normalizeHandle('123456789/123456').subscribe((handle: string | null) => {
          expect(handle).toBe('123456789/123456');
          done();
        });
      });

      it('12.3456.789/123456', (done: DoneFn) => {
        service.normalizeHandle('12.3456.789/123456').subscribe((handle: string | null) => {
          expect(handle).toBe('12.3456.789/123456');
          done();
        });
      });
    });

    it('should normalize handle urls starting with handle', (done: DoneFn) => {
      service.normalizeHandle('https://rest.api/server/handle/123456789/123456').subscribe((handle: string | null) => {
        expect(handle).toBe('123456789/123456');
        done();
      });
    });

    it('should return null if the input doesn\'t contain a valid handle', (done: DoneFn) => {
      service.normalizeHandle('https://hdl.handle.net/123456789').subscribe((handle: string | null) => {
        expect(handle).toBeNull();
        done();
      });
    });

    it('should return null if the input doesn\'t contain a handle', (done: DoneFn) => {
      service.normalizeHandle('something completely different').subscribe((handle: string | null) => {
        expect(handle).toBeNull();
        done();
      });
    });
  });
});
