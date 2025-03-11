import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { EditBitstreamPageComponent } from './edit-bitstream-page.component';

@Component({
  selector: 'ds-edit-bitstream-page',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [EditBitstreamPageComponent],
})
export class ThemedEditBitstreamPageComponent extends ThemedComponent<EditBitstreamPageComponent> {
  protected getComponentName(): string {
    return 'EditBitstreamPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./edit-bitstream-page.component');
  }
}
