import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAccountInfoComponent } from './review-account-info.component';

describe('ReviewAccountInfoComponent', () => {
  let component: ReviewAccountInfoComponent;
  let fixture: ComponentFixture<ReviewAccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewAccountInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
