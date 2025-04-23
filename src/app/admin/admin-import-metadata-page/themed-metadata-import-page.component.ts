import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { MetadataImportPageComponent } from './metadata-import-page.component';

/**
 * Themed wrapper for {@link MetadataImportPageComponent}.
 */
@Component({
  selector: 'ds-metadata-import-page',
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    MetadataImportPageComponent,
  ],
})
export class ThemedMetadataImportPageComponent extends ThemedComponent<MetadataImportPageComponent> {
  protected getComponentName(): string {
    return 'MetadataImportPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/admin/admin-import-metadata-page/metadata-import-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./metadata-import-page.component');
  }
}
