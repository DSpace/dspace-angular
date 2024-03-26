import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricDimensionsComponent } from './metric-dimensions.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { ListMetricPropsPipe } from '../pipes/list-metric-props/list-metric-props.pipe';
import { By } from '@angular/platform-browser';

describe('MetricDimensionsComponent', () => {
  let component: MetricDimensionsComponent;
  let fixture: ComponentFixture<MetricDimensionsComponent>;
  const metricMock = {
    acquisitionDate: new Date(),
    deltaPeriod1: null,
    deltaPeriod2: null,
    endDate: null,
    id: '1',
    last: true,
    metricCount: 0,
    metricType: 'dimensions',
    rank: null,
    remark: '{"data-legend":"hover-right","data-style":"small_rectangle","data-doi":"10.1056/Test","data-pmid":"1234567890","list-data-badge-enabled":"true","data-badge-enabled":"true"}',
    startDate: null,
    type: null,
    _links: null
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [MetricDimensionsComponent, ListMetricPropsPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDimensionsComponent);
    component = fixture.componentInstance;
    component.metric = metricMock;
    component.success = true;
    component.maxRetry = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render badge div', () => {
    const div = fixture.debugElement.queryAll(By.css('div'))[1];
    expect(div.nativeElement.className).toEqual('__dimensions_badge_embed__');
    expect(div.nativeElement.dataset.doi).toEqual('10.1056/Test');
    expect(div.nativeElement.dataset.style).toEqual('small_rectangle');
    expect(div.nativeElement.dataset.legend).toEqual('hover-right');
  });
});
