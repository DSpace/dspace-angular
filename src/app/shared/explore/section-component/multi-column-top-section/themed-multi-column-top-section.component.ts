import { ThemedComponent } from '../../../theme-support/themed.component';
import { Component, Input } from '@angular/core';
import { MultiColumnTopSection } from '../../../../core/layout/models/section.model';
import { MultiColumnTopSectionComponent } from './multi-column-top-section.component';

@Component({
  selector: 'ds-themed-multi-column-top-section',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedMultiColumnTopSectionComponent extends ThemedComponent<MultiColumnTopSectionComponent> {

  @Input()
  sectionId: string;

  @Input()
  topSection: MultiColumnTopSection;

  protected inAndOutputNames: (keyof MultiColumnTopSectionComponent & keyof this)[] = ['sectionId', 'topSection'];

  protected getComponentName(): string {
    return 'MultiColumnTopSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/explore/section-component/multi-column-top-section/multi-column-top-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./multi-column-top-section.component`);
  }

}
