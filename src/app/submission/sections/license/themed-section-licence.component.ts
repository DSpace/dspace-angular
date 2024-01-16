import { Component } from '@angular/core';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { SubmissionSectionLicenseComponent } from './section-license.component';

/**
 * Themed wrapper for SubmissionSectionLicenseComponent
 */
@Component({
  selector: 'ds-themed-section-license',
  styleUrls: [],
  templateUrl: './../../../shared/theme-support/themed.component.html'
})
export class ThemedSubmissionSectionLicenseComponent extends ThemedComponent<SubmissionSectionLicenseComponent> {
  protected getComponentName(): string {
    return 'SubmissionSectionLicenseComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/submission/sections/section-license.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./section-license.component`);
  }
}
