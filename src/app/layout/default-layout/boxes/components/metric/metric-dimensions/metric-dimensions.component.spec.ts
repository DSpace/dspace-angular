import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDimensionsComponent } from './metric-dimensions.component';

describe('MetricDimensionsComponent', () => {
  let component: MetricDimensionsComponent;
  let fixture: ComponentFixture<MetricDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
