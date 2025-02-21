import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { RouterStub } from '@dspace/core';
import { SearchConfigurationServiceStub } from '@dspace/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { MockActivatedRoute } from '../../../../shared/mocks/active-router.mock';
import { SearchLabelsComponent } from '../../../../shared/search/search-labels/search-labels.component';
import { ThemedSearchComponent } from '../../../../shared/search/themed-search.component';
import { AdminNotifyLogsResultComponent } from './admin-notify-logs-result.component';

describe('AdminNotifyLogsResultComponent', () => {
  let component: AdminNotifyLogsResultComponent;
  let fixture: ComponentFixture<AdminNotifyLogsResultComponent>;

  let searchConfigurationService: SearchConfigurationServiceStub;

  beforeEach(async () => {
    searchConfigurationService = new SearchConfigurationServiceStub();

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AdminNotifyLogsResultComponent],
      providers: [
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
      ],
    }).overrideProvider(SEARCH_CONFIG_SERVICE, {
      useValue: searchConfigurationService,
    }).overrideComponent(AdminNotifyLogsResultComponent, {
      remove: {
        imports: [
          SearchLabelsComponent,
          ThemedSearchComponent,
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNotifyLogsResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
