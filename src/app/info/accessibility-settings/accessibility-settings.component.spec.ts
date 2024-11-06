import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  AccessibilitySetting,
  AccessibilitySettingsService,
} from '../../accessibility/accessibility-settings.service';
import { getAccessibilitySettingsServiceStub } from '../../accessibility/accessibility-settings.service.stub';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { AuthServiceStub } from '../../shared/testing/auth-service.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { AccessibilitySettingsComponent } from './accessibility-settings.component';


describe('AccessibilitySettingsComponent', () => {
  let component: AccessibilitySettingsComponent;
  let fixture: ComponentFixture<AccessibilitySettingsComponent>;

  let authService: AuthServiceStub;
  let settingsService: AccessibilitySettingsService;
  let notificationsService: NotificationsServiceStub;

  beforeEach(waitForAsync(() => {
    authService = new AuthServiceStub();
    settingsService = getAccessibilitySettingsServiceStub();
    notificationsService = new NotificationsServiceStub();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AccessibilitySettingsService, useValue: settingsService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilitySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Init', () => {
    it('should retrieve all accessibility settings options', () => {
      expect(settingsService.getAllAccessibilitySettingKeys).toHaveBeenCalled();
    });

    it('should retrieve the current settings', () => {
      expect(settingsService.getAll).toHaveBeenCalled();
    });
  });

  describe('getInputType', () => {
    it('should retrieve the input type for the setting from the service', () => {
      component.getInputType(AccessibilitySetting.LiveRegionTimeOut);
      expect(settingsService.getInputType).toHaveBeenCalledWith(AccessibilitySetting.LiveRegionTimeOut);
    });
  });

  describe('saveSettings', () => {
    it('should save the settings in the service', () => {
      settingsService.setSettings = jasmine.createSpy('setSettings').and.returnValue(of('cookie'));
      component.saveSettings();
      expect(settingsService.setSettings).toHaveBeenCalled();
    });

    it('should give the user a notification mentioning where the settings were saved', () => {
      settingsService.setSettings = jasmine.createSpy('setSettings').and.returnValue(of('cookie'));
      component.saveSettings();
      expect(notificationsService.success).toHaveBeenCalled();
    });
  });
});
