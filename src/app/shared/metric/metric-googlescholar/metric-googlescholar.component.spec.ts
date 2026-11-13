import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { RedirectService } from '../../redirect/redirect.service';
import { RedirectDirective } from '../../utils/redirect.directive';
import { RedirectWithHrefDirective } from '../../utils/redirect-href.directive';
import { MetricGooglescholarComponent } from './metric-googlescholar.component';

describe('MetricGooglescholarComponent', () => {
  let component: MetricGooglescholarComponent;
  let fixture: ComponentFixture<MetricGooglescholarComponent>;
  let routerStub;
  let redirectServiceStub: RedirectService;
  const href = 'https://scholar.google.com/scholar?q=The+Covid-19+Vaccine-Development+Multiverse';
  const metricMock = {
    acquisitionDate: new Date(),
    deltaPeriod1: null,
    deltaPeriod2: null,
    endDate: null,
    id: '1',
    last: true,
    metricCount: 333,
    metricType: 'google-scholar',
    rank: null,
    remark: '{"href":"' + href + '"}',
    startDate: null,
    type: null,
    _links: null,
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), MetricGooglescholarComponent, RedirectDirective, RedirectWithHrefDirective],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: RedirectService, useValue: redirectServiceStub },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGooglescholarComponent);
    component = fixture.componentInstance;
    component.metric = metricMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render anchor with href', () => {
    const a = fixture.debugElement.queryAll(By.css('a'))[0];
    expect(a.nativeElement.href).toEqual(href);
  });
});
