import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  APP_CONFIG,
  RouterStub,
  SearchConfigurationService,
  SearchConfigurationServiceStub,
  SearchFilterService,
  SearchFilterServiceStub,
  SearchService,
  SearchServiceStub,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment.test';
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
