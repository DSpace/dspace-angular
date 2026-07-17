import {
  Component,
  Input,
} from '@angular/core';
import { TextRowSection } from '@dspace/core/layout/models/section.model';
import { Site } from '@dspace/core/shared/site.model';

import { ThemedComponent } from '../../../theme-support/themed.component';
import { TextSectionComponent } from './text-section.component';

/**
 * Themed wrapper for {@link TextSectionComponent}.
 */
@Component({
  selector: 'ds-text-section',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedTextSectionComponent extends ThemedComponent<TextSectionComponent> {

  @Input()
    sectionId: string;

  @Input()
    textRowSection: TextRowSection;

  @Input()
    site: Site;

  protected inAndOutputNames: (keyof TextSectionComponent & keyof this)[] = ['sectionId', 'textRowSection', 'site'];

  protected getComponentName(): string {
    return 'TextSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/explore/section-component/text-section/text-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./text-section.component`);
  }

}
