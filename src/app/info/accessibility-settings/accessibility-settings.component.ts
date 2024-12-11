import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { take } from 'rxjs';

import {
  AccessibilitySetting,
  AccessibilitySettingsFormValues,
  AccessibilitySettingsService,
} from '../../accessibility/accessibility-settings.service';
import { AuthService } from '../../core/auth/auth.service';
import { ContextHelpDirective } from '../../shared/context-help.directive';
import { NotificationsService } from '../../shared/notifications/notifications.service';

/**
 * Component providing the form where users can update accessibility settings.
 */
@Component({
  selector: 'ds-accessibility-settings',
  templateUrl: './accessibility-settings.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    UiSwitchModule,
    ContextHelpDirective,
  ],
  standalone: true,
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

  getPlaceholder(setting: AccessibilitySetting): string {
    return this.settingsService.getPlaceholder(setting);
  }

  /**
   * Saves the user-configured settings
   */
  saveSettings() {
    const formValues = this.formValues;
    const convertedValues = this.settingsService.convertFormValuesToStoredValues(formValues);
    this.settingsService.setSettings(convertedValues).pipe(take(1)).subscribe(location => {
      this.notificationsService.success(null, this.translateService.instant('info.accessibility-settings.save-notification.' + location));
      this.updateFormValues();
    });
  }

  /**
   * Updates the form values with the currently stored accessibility settings
   */
  updateFormValues() {
    this.settingsService.getAll().pipe(take(1)).subscribe(storedSettings => {
      this.formValues = this.settingsService.convertStoredValuesToFormValues(storedSettings);
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
