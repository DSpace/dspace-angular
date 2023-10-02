import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricPlumxComponent } from './metric-plumx.component';
import { Injector } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { ListMetricPropsPipe } from '../pipes/list-metric-props/list-metric-props.pipe';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { Metric } from '../../../core/shared/metric.model';

describe('MetricPlumxComponent', () => {
  let component: MetricPlumxComponent;
  let fixture: ComponentFixture<MetricPlumxComponent>;
  const metricMock: Metric = {
    acquisitionDate: new Date(),
    deltaPeriod1: null,
    deltaPeriod2: null,
    endDate: null,
    id: '1',
    last: true,
    metricCount: 333,
    metricType: 'plumX',
    rank: null,
    remark: JSON.stringify({
        'type': 'Publication',
        'src': '//cdn.plu.mx/widget-popup.js',
        'href': 'https://plu.mx/plum/a/?doi=10.1056/NEJMe2025111',
        'list-data-publication-badge-enabled': true,
        'data-publication-badge-enabled': true,
        'data-popup':  'left',
        'data-hide-when-empty':  true,
        'data-hide-usage':  false,
        'data-hide-captures':  false,
        'data-hide-mentions':  false,
        'data-hide-socialmedia':  false,
        'data-hide-citations':  false,
        'data-pass-hidden-categories':  false,
        'data-detail-same-page':  false,
        'list-data-lang':  'en',
        'list-data-no-name':  true,
        'list-data-num-artifacts':  5,
        'list-data-width':  '6em',
        'list-data-no-description':  true,
        'list-data-no-stats':  true,
        'list-data-no-thumbnail':  true,
        'list-data-no-artifacts':  true,
        'list-data-popup': 'bottom',
        'list-data-hide-when-empty':  true,
        'list-data-hide-usage':  false,
        'list-data-hide-captures':  false,
        'list-data-hide-mentions':  false,
        'list-data-hide-socialmedia':  false,
        'list-data-hide-citations':  false,
        'list-data-pass-hidden-categories':  false,
        'list-data-detail-same-page': false
      }),
    startDate: null,
    type: null,
    _links: null
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetricPlumxComponent, ListMetricPropsPipe],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      providers: [
        { provide: Injector, useValue: Injector },
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricPlumxComponent);
    component = fixture.componentInstance;
    component.metric = metricMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render plumx widget', (done) => {
    const innerHtmlMetric = fixture.debugElement.query(By.css('a'));
    expect(innerHtmlMetric.nativeElement.className).toEqual('plumx-plum-print-popup');
    expect(innerHtmlMetric.nativeElement.href).toEqual('https://plu.mx/plum/a/?doi=10.1056/NEJMe2025111');
    expect(innerHtmlMetric.nativeElement.attributes['data-popup'].nodeValue).toEqual('left');
    expect(innerHtmlMetric.nativeElement.attributes['data-hide-when-empty'].nodeValue).toEqual('true');
    expect(innerHtmlMetric.nativeElement.attributes['data-hide-usage']).toBeUndefined();
    expect(innerHtmlMetric.nativeElement.attributes['data-hide-captures']).toBeUndefined();
    expect(innerHtmlMetric.nativeElement.attributes['data-hide-mentions']).toBeUndefined();
    expect(innerHtmlMetric.nativeElement.attributes['data-hide-socialmedia']).toBeUndefined();
    expect(innerHtmlMetric.nativeElement.attributes['data-hide-citations']).toBeUndefined();
    expect(innerHtmlMetric.nativeElement.attributes['data-pass-hidden-categories']).toBeUndefined();
    expect(innerHtmlMetric.nativeElement.attributes['data-detail-same-page']).toBeUndefined();
    done();
  });
});

