import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricPlumxComponent } from './metric-plumx.component';
import { Injector } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { ListMetricPropsPipe } from '../pipes/list-metric-props/list-metric-props.pipe';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';

describe('MetricPlumxComponent', () => {
  let component: MetricPlumxComponent;
  let fixture: ComponentFixture<MetricPlumxComponent>;
  const metricMock = {
    acquisitionDate: new Date(),
    deltaPeriod1: null,
    deltaPeriod2: null,
    endDate: null,
    id: '1',
    last: true,
    metricCount: 333,
    metricType: 'plumX',
    rank: null,
    remark: '{"type":"Publication","src":"//cdn.plu.mx/widget-popup.js","href":"https://plu.mx/plum/a/?doi=10.1056/NEJMe2025111"}',
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
    done();
  });
});

