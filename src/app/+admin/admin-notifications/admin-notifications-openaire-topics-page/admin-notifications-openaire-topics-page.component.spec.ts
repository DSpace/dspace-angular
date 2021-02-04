import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotificationsOpenaireTopicsPageComponent } from './admin-notifications-openaire-topics-page.component';

describe('AdminNotificationsOpenaireTopicsPageComponent', () => {
  let component: AdminNotificationsOpenaireTopicsPageComponent;
  let fixture: ComponentFixture<AdminNotificationsOpenaireTopicsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsOpenaireTopicsPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsOpenaireTopicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminNotificationsOpenaireTopicsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
