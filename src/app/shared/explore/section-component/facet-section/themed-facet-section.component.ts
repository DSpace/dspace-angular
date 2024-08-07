import {
  Component,
  Input,
} from '@angular/core';

import { FacetSection } from '../../../../core/layout/models/section.model';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { FacetSectionComponent } from './facet-section.component';

@Component({
  selector: 'ds-facet-section',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [FacetSectionComponent],
})
export class ThemedFacetSectionComponent extends ThemedComponent<FacetSectionComponent> {

  @Input()
    sectionId: string;

  @Input()
    facetSection: FacetSection;

  protected inAndOutputNames: (keyof FacetSectionComponent & keyof this)[] = ['sectionId', 'facetSection'];

  protected getComponentName(): string {
    return 'FacetSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/explore/section-component/facet-section/facet-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./facet-section.component`);
  }

}
