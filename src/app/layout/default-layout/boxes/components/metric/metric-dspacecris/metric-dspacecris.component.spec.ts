import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDspacecrisComponent } from './metric-dspacecris.component';

describe('MetricDspacecrisComponent', () => {
  let component: MetricDspacecrisComponent;
  let fixture: ComponentFixture<MetricDspacecrisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricDspacecrisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDspacecrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
