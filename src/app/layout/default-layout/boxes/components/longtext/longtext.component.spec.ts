import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongtextComponent } from './longtext.component';

describe('LongtextComponent', () => {
  let component: LongtextComponent;
  let fixture: ComponentFixture<LongtextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongtextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongtextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
