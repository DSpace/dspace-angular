import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchSidebarComponent } from './search-sidebar.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';

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
      ],
      declarations: [SearchSidebarComponent],
      providers: [
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
