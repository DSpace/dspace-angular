import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGooglescholarComponent } from './metric-googlescholar.component';

describe('MetricGooglescholarComponent', () => {
  let component: MetricGooglescholarComponent;
  let fixture: ComponentFixture<MetricGooglescholarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricGooglescholarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGooglescholarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
