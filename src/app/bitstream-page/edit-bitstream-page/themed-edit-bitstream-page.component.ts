import { Component } from '@angular/core';
import { EditBitstreamPageComponent } from './edit-bitstream-page.component';
import { ThemedComponent } from '../../shared/theme-support/themed.component';

@Component({
    selector: 'ds-themed-edit-bitstream-page',
    styleUrls: [],
    templateUrl: '../../shared/theme-support/themed.component.html',
    standalone: true
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
