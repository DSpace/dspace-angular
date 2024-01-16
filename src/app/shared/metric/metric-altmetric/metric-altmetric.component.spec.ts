import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricAltmetricComponent } from './metric-altmetric.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { ListMetricPropsPipe } from '../pipes/list-metric-props/list-metric-props.pipe';

describe('MetricAltmetricComponent', () => {
  let component: MetricAltmetricComponent;
  let fixture: ComponentFixture<MetricAltmetricComponent>;
  const metricMock = {
    acquisitionDate: new Date(),
    deltaPeriod1: null,
    deltaPeriod2: null,
    endDate: null,
    id: '1',
    last: true,
    metricCount: 333,
    metricType: 'altmetric',
    rank: null,
    remark: '{"popover":"bottom","doiAttr":"10.1056/Test","pmidAttr":"1234567890","list-data-badge-enabled":"true","data-badge-enabled":"true"}',
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
      declarations: [MetricAltmetricComponent, ListMetricPropsPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricAltmetricComponent);
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
    const div = fixture.debugElement.queryAll(By.css('div'))[2];
    expect(div.nativeElement.className).toEqual('altmetric-embed');
    expect(div.nativeElement.dataset.badgePopover).toEqual('bottom');
    expect(div.nativeElement.dataset.doi).toEqual('10.1056/Test');
    expect(div.nativeElement.dataset.pmid).toEqual('1234567890');
  });
});
