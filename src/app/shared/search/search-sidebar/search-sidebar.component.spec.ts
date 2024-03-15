import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedSearchFiltersComponent } from '../search-filters/themed-search-filters.component';
import { ThemedSearchSettingsComponent } from '../search-settings/themed-search-settings.component';
import { SearchSidebarComponent } from './search-sidebar.component';

describe('SearchSidebarComponent', () => {
  let comp: SearchSidebarComponent;
  let fixture: ComponentFixture<SearchSidebarComponent>;
  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NgbCollapseModule,
        SearchSidebarComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SearchSidebarComponent, {
        remove:{
          imports: [ThemedSearchFiltersComponent, ThemedSearchSettingsComponent],
        },
        add: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();  // compile template and css
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
