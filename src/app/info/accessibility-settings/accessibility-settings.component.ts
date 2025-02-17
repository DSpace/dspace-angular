import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import {
  AccessibilitySetting,
  AccessibilitySettingsService,
  AccessibilitySettingsFormValues,
} from '../../accessibility/accessibility-settings.service';
import { take } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty } from 'src/app/shared/empty.util';

/**
 * Component providing the form where users can update accessibility settings.
 */
@Component({
  selector: 'ds-accessibility-settings',
  templateUrl: './accessibility-settings.component.html'
})
export class AccessibilitySettingsComponent implements OnInit {

  protected formValues: AccessibilitySettingsFormValues;

  constructor(
    protected authService: AuthService,
    protected settingsService: AccessibilitySettingsService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.updateFormValues();
  }

  /**
   * Saves the user-configured settings
   */
  saveSettings() {
    const formValues = this.formValues;
    const convertedValues = this.settingsService.convertFormValuesToStoredValues(formValues);

    if (this.settingsService.allValid(convertedValues)) {
      this.settingsService.setSettings(convertedValues).pipe(take(1)).subscribe(location => {
        this.notificationsService.success(null, this.translateService.instant('info.accessibility-settings.save-notification.' + location));
        this.updateFormValues();
      });
    } else {
      this.notificationsService.error(
        null,
        this.translateService.instant('info.accessibility-settings.invalid-form-notification'),
      );
    }
  }

  /**
   * Updates the form values with the currently stored accessibility settings and sets the default values for settings
   * that have no stored value.
   */
  updateFormValues() {
    this.settingsService.getAll().pipe(take(1)).subscribe(storedSettings => {
      const formValues = this.settingsService.convertStoredValuesToFormValues(storedSettings);

      const settingsRequiringDefaultValue: AccessibilitySetting[] = ['notificationTimeOut', 'liveRegionTimeOut'];

      for (const setting of settingsRequiringDefaultValue) {
        if (isEmpty(formValues[setting])) {
          const defaultValue = this.settingsService.getDefaultValue(setting);
          formValues[setting] = defaultValue;
        }
      }

      this.formValues = formValues;
    });
  }

  /**
   * Resets accessibility settings
   */
  resetSettings() {
    this.settingsService.clearSettings().pipe(take(1)).subscribe(() => {
      this.notificationsService.success(null, this.translateService.instant('info.accessibility-settings.reset-notification'));
      this.updateFormValues();
    });
  }

}
