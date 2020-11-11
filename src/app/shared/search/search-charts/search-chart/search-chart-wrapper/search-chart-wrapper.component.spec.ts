import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FILTER_CONFIG, IN_PLACE_SEARCH } from 'src/app/core/shared/search/search-filter.service';
import { FilterType } from '../../../filter-type.model';
import { SearchFilterConfig } from '../../../search-filter-config.model';
import { SearchChartFilterWrapperComponent } from './search-chart-wrapper.component';

describe('SearchChartFilterWrapperComponent', () => {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      declarations: [
        SearchChartFilterWrapperComponent
      ],
      providers: [
        { provide: FILTER_CONFIG, userValue: mockFilterConfig},
        { provide: IN_PLACE_SEARCH, userValue: inPlaceSearch}
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
});
