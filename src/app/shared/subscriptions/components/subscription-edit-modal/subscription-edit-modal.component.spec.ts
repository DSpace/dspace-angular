import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionEditModalComponent } from './subscription-edit-modal.component';

describe('SubscriptionEditModalComponent', () => {
  let component: SubscriptionEditModalComponent;
  let fixture: ComponentFixture<SubscriptionEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
