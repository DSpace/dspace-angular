import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricLoaderComponent } from './metric-loader.component';

describe('MetricLoaderComponent', () => {
  let component: MetricLoaderComponent;
  let fixture: ComponentFixture<MetricLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
