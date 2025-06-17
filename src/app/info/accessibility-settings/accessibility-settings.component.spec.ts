import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ContextHelpDirective } from 'src/app/shared/context-help.directive';

import { AccessibilitySettingsService } from '../../accessibility/accessibility-settings.service';
import { getAccessibilitySettingsServiceStub } from '../../accessibility/accessibility-settings.service.stub';
import { AuthService } from '../../core/auth/auth.service';
import { KlaroService } from '../../shared/cookies/klaro.service';
import { KlaroServiceStub } from '../../shared/cookies/klaro.service.stub';
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
  let klaroService: KlaroServiceStub;

  beforeEach(waitForAsync(() => {
    authService = new AuthServiceStub();
    settingsService = getAccessibilitySettingsServiceStub();
    notificationsService = new NotificationsServiceStub();
    klaroService = new KlaroServiceStub();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AccessibilitySettingsService, useValue: settingsService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: KlaroService, useValue: klaroService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(AccessibilitySettingsComponent, {
      remove: {
        imports: [ContextHelpDirective],
      },
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
    it('should retrieve the current settings', () => {
      expect(settingsService.getAll).toHaveBeenCalled();
    });

    it('should convert retrieved settings to form format', () => {
      expect(settingsService.convertStoredValuesToFormValues).toHaveBeenCalled();
    });
  });

  describe('saveSettings', () => {
    it('should save the settings in the service', () => {
      settingsService.setSettings = jasmine.createSpy('setSettings').and.returnValue(of('cookie'));
      component.saveSettings();
      expect(settingsService.setSettings).toHaveBeenCalled();
    });

    it('should convert form settings to stored format', () => {
      settingsService.setSettings = jasmine.createSpy('setSettings').and.returnValue(of('cookie'));
      component.saveSettings();
      expect(settingsService.convertFormValuesToStoredValues).toHaveBeenCalled();
    });

    it('should give the user a notification mentioning where the settings were saved', () => {
      settingsService.setSettings = jasmine.createSpy('setSettings').and.returnValue(of('cookie'));
      component.saveSettings();
      expect(notificationsService.success).toHaveBeenCalled();
    });

    it('should give the user a notification mentioning why saving failed, if it failed', () => {
      settingsService.setSettings = jasmine.createSpy('setSettings').and.returnValue(of('failed'));
      component.saveSettings();
      expect(notificationsService.error).toHaveBeenCalled();
    });
  });
});
