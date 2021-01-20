import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricAltmetricComponent } from './metric-altmetric.component';

describe('MetricAltmetricComponent', () => {
  let component: MetricAltmetricComponent;
  let fixture: ComponentFixture<MetricAltmetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricAltmetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricAltmetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
