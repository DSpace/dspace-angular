import { ThemedComponent } from '../../../theme-support/themed.component';
import { Component, Input } from '@angular/core';
import { BrowseSection } from '../../../../core/layout/models/section.model';
import { BrowseSectionComponent } from './browse-section.component';

@Component({
  selector: 'ds-themed-browse-section',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedBrowseSectionComponent extends ThemedComponent<BrowseSectionComponent> {

  @Input()
  sectionId: string;

  @Input()
  browseSection: BrowseSection;

  protected inAndOutputNames: (keyof BrowseSectionComponent & keyof this)[] = ['sectionId', 'browseSection'];

  protected getComponentName(): string {
    return 'BrowseSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/explore/section-component/browse-section/browse-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./browse-section.component`);
  }

}
