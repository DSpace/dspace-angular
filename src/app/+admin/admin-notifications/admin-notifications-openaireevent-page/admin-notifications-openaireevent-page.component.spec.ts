import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotificationsOpenaireeventPageComponent } from './admin-notifications-openaireevent-page.component';

describe('AdminNotificationsOpenaireeventPageComponent', () => {
  let component: AdminNotificationsOpenaireeventPageComponent;
  let fixture: ComponentFixture<AdminNotificationsOpenaireeventPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsOpenaireeventPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsOpenaireeventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminNotificationsOpenaireeventPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
