import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment.test';
import { APP_CONFIG } from '@dspace/core';
import { SearchService } from '@dspace/core';
import { SearchConfigurationService } from '@dspace/core';
import { SearchFilterService } from '@dspace/core';
import { RouterStub } from '@dspace/core';
import { SearchConfigurationServiceStub } from '@dspace/core';
import { SearchFilterServiceStub } from '@dspace/core';
import { SearchServiceStub } from '@dspace/core';
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
