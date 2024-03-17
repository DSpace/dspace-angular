import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  NavigationExtras,
  Router,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { Context } from '../../../core/shared/context.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { MyDSpaceConfigurationValueType } from '../../../my-dspace-page/my-dspace-configuration-value-type';
import { MYDSPACE_ROUTE } from '../../../my-dspace-page/my-dspace-page.component';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { RouterStub } from '../../testing/router.stub';
import { SearchConfigurationServiceStub } from '../../testing/search-configuration-service.stub';
import { SearchSwitchConfigurationComponent } from './search-switch-configuration.component';

describe('SearchSwitchConfigurationComponent', () => {

  let comp: SearchSwitchConfigurationComponent;
  let fixture: ComponentFixture<SearchSwitchConfigurationComponent>;
  let searchConfService: SearchConfigurationServiceStub;
  let select: any;

  const searchServiceStub = jasmine.createSpyObj('SearchService', {
    getSearchLink: jasmine.createSpy('getSearchLink'),
  });

  const configurationList = [
    {
      value: MyDSpaceConfigurationValueType.Workspace,
      label: 'workspace',
      context: Context.Workspace,
    },
    {
      value: MyDSpaceConfigurationValueType.Workflow,
      label: 'workflow',
      context: Context.Workflow,
    },
  ];
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        SearchSwitchConfigurationComponent,
      ],
      providers: [
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchService, useValue: searchServiceStub },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSwitchConfigurationComponent);
    comp = fixture.componentInstance;
    searchConfService = TestBed.inject(SEARCH_CONFIG_SERVICE as any);

    spyOn(searchConfService, 'getCurrentConfiguration').and.returnValue(observableOf(MyDSpaceConfigurationValueType.Workspace));

    comp.configurationList = configurationList;

    // SearchSwitchConfigurationComponent test instance
    fixture.detectChanges();

  });

  it('should init the current configuration name', () => {
    expect(comp.selectedOption).toBe(configurationList[0]);
  });

  it('should display select field properly', () => {
    const selectField = fixture.debugElement.query(By.css('.form-control'));
    expect(selectField).not.toBeNull();

    const childElements = selectField.children;
    expect(childElements.length).toEqual(comp.configurationList.length);
  });

  it('should call onSelect method when selecting an option', waitForAsync(() => {
    fixture.whenStable().then(() => {
      spyOn(comp, 'onSelect');
      select = fixture.debugElement.query(By.css('select'));
      const selectEl = select.nativeElement;
      selectEl.value = selectEl.options[1].value;  // <-- select a new value
      selectEl.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(comp.onSelect).toHaveBeenCalled();
    });
  }));

  it('should navigate to the route when selecting an option', () => {
    spyOn((comp as any), 'getSearchLinkParts').and.returnValue([MYDSPACE_ROUTE]);
    spyOn((comp as any).changeConfiguration, 'emit');
    comp.selectedOption = configurationList[1];
    const navigationExtras: NavigationExtras = {
      queryParams: { configuration: MyDSpaceConfigurationValueType.Workflow },
    };

    fixture.detectChanges();

    comp.onSelect();

    expect((comp as any).router.navigate).toHaveBeenCalledWith([MYDSPACE_ROUTE], navigationExtras);
    expect((comp as any).changeConfiguration.emit).toHaveBeenCalled();
  });
});
