import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBoxComponent } from './notification-box.component';

describe('NotificationBoxComponent', () => {
  let component: NotificationBoxComponent;
  let fixture: ComponentFixture<NotificationBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
