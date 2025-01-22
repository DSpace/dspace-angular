import {
  Component,
  Input,
} from '@angular/core';
import { Bitstream } from 'src/app/core/shared/bitstream.model';

import { ThemedComponent } from '../../../../theme-support/themed.component';
import { EmbargoBadgeComponent } from './embargo-badge.component';

/**
 * Themed wrapper for EmbargoBadgeComponent
 */
@Component({
  selector: 'ds-embargo-badge',
  styleUrls: [],
  templateUrl: '../../../../theme-support/themed.component.html',
  standalone: true,
  imports: [EmbargoBadgeComponent],
})
export class ThemedEmbargoBadgeComponent extends ThemedComponent<EmbargoBadgeComponent> {
  @Input() bitstream: Bitstream;

  protected inAndOutputNames: (keyof EmbargoBadgeComponent & keyof this)[] = ['bitstream'];

  protected getComponentName(): string {
    return 'EmbargoBadgeComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/object-collection/shared/badges/embargo-badge/embargo-badge.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./embargo-badge.component`);
  }
}
