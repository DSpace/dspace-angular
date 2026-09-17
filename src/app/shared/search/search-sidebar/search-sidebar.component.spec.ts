import {
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { SearchConfigurationServiceStub } from '@dspace/core/testing/search-configuration-service.stub';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment.test';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';
import { SearchConfigurationService } from '../search-configuration.service';
import { ThemedSearchFiltersComponent } from '../search-filters/themed-search-filters.component';
import { ThemedSearchSettingsComponent } from '../search-settings/themed-search-settings.component';
import { SearchSidebarComponent } from './search-sidebar.component';

describe('SearchSidebarComponent', () => {
  let comp: SearchSidebarComponent;
  let fixture: ComponentFixture<SearchSidebarComponent>;

  let searchConfigurationService: SearchConfigurationServiceStub;

  beforeEach(waitForAsync(() => {
    searchConfigurationService = new SearchConfigurationServiceStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NgbCollapseModule,
        SearchSidebarComponent,
      ],
      providers: [
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).overrideProvider(APP_CONFIG, {
      useValue: environment,
    }).overrideComponent(SearchSidebarComponent, {
      remove:{
        imports: [
          AdvancedSearchComponent,
          ThemedSearchFiltersComponent,
          ThemedSearchSettingsComponent,
        ],
      },
      add: {
        changeDetection: ChangeDetectionStrategy.Default,
      },
    }).compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSidebarComponent);

    comp = fixture.componentInstance;

  });

  describe('when the close sidebar button is clicked in mobile view', () => {

    beforeEach(() => {
      spyOn(comp.toggleSidebar, 'emit');
      const closeSidebarButton = fixture.debugElement.query(By.css('button.close-sidebar'));

      closeSidebarButton.triggerEventHandler('click', null);
    });

    it('should emit a toggleSidebar event', () => {
      expect(comp.toggleSidebar.emit).toHaveBeenCalled();
    });

  });
});
