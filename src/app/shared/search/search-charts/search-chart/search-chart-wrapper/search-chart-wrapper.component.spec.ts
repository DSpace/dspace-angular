import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FILTER_CONFIG, IN_PLACE_SEARCH, SCOPE } from '../../../../../core/shared/search/search-filter.service';
import { FilterType } from '../../../models/filter-type.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { SearchChartFilterWrapperComponent } from './search-chart-wrapper.component';

xdescribe('SearchChartFilterWrapperComponent', () => {
  let component: SearchChartFilterWrapperComponent;
  let fixture: ComponentFixture<SearchChartFilterWrapperComponent>;
  const filterName1 = 'test name';

  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });

  const inPlaceSearch: any = '';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      declarations: [
        SearchChartFilterWrapperComponent
      ],
      providers: [
        { provide: FILTER_CONFIG, userValue: mockFilterConfig},
        { provide: IN_PLACE_SEARCH, userValue: inPlaceSearch},
        { provide: SCOPE, userValue: ''}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartFilterWrapperComponent);
    component = fixture.componentInstance;
    component.filterConfig = mockFilterConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject component properly', () => {
    spyOn(component, 'getSearchFilter').and.callThrough();
  });
});
