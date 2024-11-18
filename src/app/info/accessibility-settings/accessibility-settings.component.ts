import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import {
  AccessibilitySetting,
  AccessibilitySettingsService,
  AccessibilitySettings
} from '../../accessibility/accessibility-settings.service';
import { take } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-accessibility-settings',
  templateUrl: './accessibility-settings.component.html'
})
export class AccessibilitySettingsComponent implements OnInit {

  protected accessibilitySettingsOptions: AccessibilitySetting[];

  protected formValues: AccessibilitySettings = { };

  constructor(
    protected authService: AuthService,
    protected settingsService: AccessibilitySettingsService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.accessibilitySettingsOptions = this.settingsService.getAllAccessibilitySettingKeys();
    this.updateFormValues();
  }

  getInputType(setting: AccessibilitySetting): string {
    return this.settingsService.getInputType(setting);
  }

  getPlaceholder(setting: AccessibilitySetting): string {
    return this.settingsService.getPlaceholder(setting);
  }

  /**
   * Saves the user-configured settings
   */
  saveSettings() {
    const formValues = this.formValues;
    const convertedValues = this.settingsService.convertAllFormValuesToStoredValues(formValues);
    this.settingsService.setSettings(convertedValues).pipe(take(1)).subscribe(location => {
      this.notificationsService.success(null, this.translateService.instant('info.accessibility-settings.save-notification.' + location));
    });

    this.updateFormValues();
  }

  /**
   * Updates the form values with the currently stored accessibility settings
   */
  updateFormValues() {
    this.settingsService.getAll().pipe(take(1)).subscribe(storedSettings => {
      this.formValues = this.settingsService.convertAllStoredValuesToFormValues(storedSettings);
    });
  }

}
