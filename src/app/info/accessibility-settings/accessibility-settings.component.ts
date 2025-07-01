import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import {
  AccessibilitySetting,
  AccessibilitySettingsService,
  AccessibilitySettingsFormValues,
} from '../../accessibility/accessibility-settings.service';
import { BehaviorSubject, distinctUntilChanged, map, Subscription, take } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { hasValue, isEmpty } from 'src/app/shared/empty.util';
import { AlertType } from '../../shared/alert/alert-type';
import { KlaroService } from '../../shared/cookies/klaro.service';

/**
 * Component providing the form where users can update accessibility settings.
 */
@Component({
  selector: 'ds-accessibility-settings',
  templateUrl: './accessibility-settings.component.html'
})
export class AccessibilitySettingsComponent implements OnInit, OnDestroy {
  // Redeclared for use in template
  protected readonly AlertType = AlertType;

  protected formValues: AccessibilitySettingsFormValues;

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  cookieIsAccepted: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private subscriptions: Subscription[] = [];

  constructor(
    protected authService: AuthService,
    protected settingsService: AccessibilitySettingsService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    @Optional() protected klaroService: KlaroService,
  ) {
  }

  ngOnInit() {
    this.updateFormValues();

    this.subscriptions.push(
      this.authService.isAuthenticated().pipe(distinctUntilChanged())
        .subscribe(val => this.isAuthenticated.next(val)),
    );

    if (hasValue(this.klaroService)) {
      this.subscriptions.push(
        this.klaroService.getSavedPreferences().pipe(
          map(preferences => preferences?.accessibility === true),
          distinctUntilChanged(),
        ).subscribe(val => this.cookieIsAccepted.next(val))
      );
    } else {
      this.cookieIsAccepted.next(false);
    }

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Saves the user-configured settings
   */
  saveSettings() {
    const formValues = this.formValues;

    if (this.settingsService.formValuesValid(formValues)) {
      const convertedValues = this.settingsService.convertFormValuesToStoredValues(formValues);
      this.settingsService.setSettings(convertedValues).pipe(take(1)).subscribe(location => {
        if (location !== 'failed') {
          this.notificationsService.success(null, this.translateService.instant('info.accessibility-settings.save-notification.' + location));
          this.updateFormValues();
        } else {
          this.notificationsService.error(null, this.translateService.instant('info.accessibility-settings.failed-notification'));
        }
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
    this.settingsService.clearSettings().pipe(take(1)).subscribe(([cookieReset, metadataReset]) => {
      if (cookieReset === 'failed' && metadataReset === 'failed') {
        this.notificationsService.warning(null, this.translateService.instant('info.accessibility-settings.reset-failed'));
      } else {
        this.notificationsService.success(null, this.translateService.instant('info.accessibility-settings.reset-notification'));
        this.updateFormValues();
      }
    });
  }

}
