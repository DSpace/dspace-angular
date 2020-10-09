import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotificationsOpenairebrokerPageComponent } from './admin-notifications-openairebroker-page.component';

describe('AdminNotificationsOpenairebrokerPageComponent', () => {
  let component: AdminNotificationsOpenairebrokerPageComponent;
  let fixture: ComponentFixture<AdminNotificationsOpenairebrokerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsOpenairebrokerPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsOpenairebrokerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminNotificationsOpenairebrokerPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
