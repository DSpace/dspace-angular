import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { SubmissionSectionLicenseComponent } from './section-license.component';

@Component({
  selector: 'ds-submission-section-license',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
  imports: [
    SubmissionSectionLicenseComponent,
  ],
})

/**
 * Component to render the deposit license.
 */
export class ThemedSubmissionSectionLicenseComponent
  extends ThemedComponent<SubmissionSectionLicenseComponent> {

  protected getComponentName(): string {
    return 'SubmissionSectionLicenseComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/submission/sections/license/section-license.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./section-license.component`);
  }

}
