import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsBrokerSourceComponent } from './notifications-broker-source.component';

describe('NotificationsBrokerSourceComponent', () => {
  let component: NotificationsBrokerSourceComponent;
  let fixture: ComponentFixture<NotificationsBrokerSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsBrokerSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsBrokerSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
