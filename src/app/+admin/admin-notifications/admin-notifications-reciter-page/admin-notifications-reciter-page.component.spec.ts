import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationsReciterPageComponent } from './admin-notifications-reciter-page.component';

describe('AdminNotificationsReciterPageComponent', () => {
  let component: AdminNotificationsReciterPageComponent;
  let fixture: ComponentFixture<AdminNotificationsReciterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsReciterPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsReciterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
