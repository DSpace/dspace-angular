import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
import { SearchConfigurationServiceStub } from '../../shared/testing/search-configuration-service.stub';
import { SearchConfigurationService } from '../shared/search/search-configuration.service';
import { AutocompleteService } from './autocomplete.service';

describe('AutocompleteService', () => {
  let service: AutocompleteService;
  let searchConfigurationService: SearchConfigurationServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
      ],
    });
    service = TestBed.inject(AutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
