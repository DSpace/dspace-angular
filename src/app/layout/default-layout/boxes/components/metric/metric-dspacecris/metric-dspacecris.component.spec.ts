import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDspacecrisComponent } from './metric-dspacecris.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';
import { metric1Mock } from '../../../metrics/cris-layout-metrics-box.component.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MetricDspacecrisComponent', () => {
  let component: MetricDspacecrisComponent;
  let fixture: ComponentFixture<MetricDspacecrisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ MetricDspacecrisComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDspacecrisComponent);
    component = fixture.componentInstance;
    component.metric = metric1Mock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
