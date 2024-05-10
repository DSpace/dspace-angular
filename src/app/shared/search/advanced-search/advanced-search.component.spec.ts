import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment.test';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { RouterStub } from '../../testing/router.stub';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { SearchFilterServiceStub } from '../../testing/search-filter-service.stub';
import { SearchServiceStub } from '../../testing/search-service.stub';
import { AdvancedSearchComponent } from './advanced-search.component';

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;

  let router: RouterStub;
  let searchService: SearchServiceStub;
  let searchConfigurationService: SearchConfigurationServiceStub;
  let searchFilterService: SearchFilterServiceStub;

  beforeEach(async () => {
    router = new RouterStub();
    searchService = new SearchServiceStub();
    searchConfigurationService = new SearchConfigurationServiceStub();
    searchFilterService = new SearchFilterServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        AdvancedSearchComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: SearchService, useValue: searchService },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: APP_CONFIG, useValue: environment },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
