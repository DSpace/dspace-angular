import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutVerticalComponent } from './cris-layout-vertical.component';

describe('CrisLayoutVerticalComponent', () => {
  let component: CrisLayoutVerticalComponent;
  let fixture: ComponentFixture<CrisLayoutVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
