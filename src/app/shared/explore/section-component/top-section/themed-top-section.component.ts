import { ThemedComponent } from '../../../theme-support/themed.component';
import { TopSectionComponent } from './top-section.component';
import { Component, Input } from '@angular/core';
import { TopSection } from '../../../../core/layout/models/section.model';
import { Context } from '../../../../core/shared/context.model';

@Component({
selector: 'ds-themed-top-section',
styleUrls: [],
templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedTopSectionComponent extends ThemedComponent<TopSectionComponent> {

  @Input()
  sectionId: string;

  @Input()
  topSection: TopSection;

  @Input()
  context: Context = Context.BrowseMostElements;

  protected inAndOutputNames: (keyof TopSectionComponent & keyof this)[] = ['sectionId', 'topSection', 'context'];

  protected getComponentName(): string {
  return 'TopSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
  return import(`../../../../../themes/${themeName}/app/shared/explore/section-component/top-section/top-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
  return import(`./top-section.component`);
  }

  }
