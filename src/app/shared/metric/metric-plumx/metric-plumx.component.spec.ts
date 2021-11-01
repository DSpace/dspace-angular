import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MetricPlumxComponent} from './metric-plumx.component';
import {Injector} from '@angular/core';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateLoaderMock} from '../../mocks/translate-loader.mock';
import {By} from '@angular/platform-browser';

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
    remark: null,
    startDate: null,
    type: null,
    _links: null
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetricPlumxComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      providers: [
        {provide: Injector, useValue: Injector}
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
  beforeEach(() => {
    metricMock.remark = "\"<a href ='https://plu.mx/plum/a/?doi=10.1016/j.procs.2017.03.038' class = 'plumx-plum-print-popup'></a><script type = 'text/javascript' src= '//cdn.plu.mx/widget-popup.js'></script>";
    fixture = TestBed.createComponent(MetricPlumxComponent);
    component = fixture.componentInstance;
    component.metric = metricMock;
    fixture.detectChanges();
  });
  it('should create', () => {
    const innerHtmlMetric = fixture.debugElement.queryAll(By.css('div'))[1];
    expect(innerHtmlMetric.nativeElement.innerHTML).toBe( '<a href="https://plu.mx/plum/a/?doi=10.1016/j.procs.2017.03.038" class="plumx-plum-print-popup"></a>');
  });
});

