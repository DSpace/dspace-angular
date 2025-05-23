import {
  Component,
  Input,
} from '@angular/core';

import { EPerson } from '../../core/eperson/models/eperson.model';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form.component';

/**
 * Themed wrapper for {@link ProfilePageMetadataFormComponent}
 */
@Component({
  selector: 'ds-profile-page-metadata-form',
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    ProfilePageMetadataFormComponent,
  ],
})
export class ThemedProfilePageMetadataFormComponent extends ThemedComponent<ProfilePageMetadataFormComponent> {

  @Input() user: EPerson;

  protected inAndOutputNames: (keyof ProfilePageMetadataFormComponent & keyof this)[] = [
    'user',
  ];

  protected getComponentName(): string {
    return 'ProfilePageMetadataFormComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/profile-page/profile-page-metadata-form/profile-page-metadata-form.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./profile-page-metadata-form.component');
  }

}
