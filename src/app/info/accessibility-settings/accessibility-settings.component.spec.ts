import { AccessibilitySettingsComponent } from './accessibility-settings.component';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthServiceStub } from '../../shared/testing/auth-service.stub';
import { getAccessibilitySettingsServiceStub } from '../../accessibility/accessibility-settings.service.stub';
import { AccessibilitySettingsService } from '../../accessibility/accessibility-settings.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { of } from 'rxjs';
import { KlaroServiceStub } from '../../shared/cookies/klaro.service.stub';
import { KlaroService } from '../../shared/cookies/klaro.service';


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
      declarations: [AccessibilitySettingsComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AccessibilitySettingsService, useValue: settingsService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: KlaroService, useValue: klaroService },
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
