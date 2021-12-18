import { ThemedComponent } from '../../../theme-support/themed.component';
import { CountersSectionComponent } from './counters-section.component';
import { Component, Input } from '@angular/core';
import { CountersSection } from './counters-section.component';

@Component({
  selector: 'ds-themed-counters-section',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
})
export class ThemedCountersSectionComponent extends ThemedComponent<CountersSectionComponent> {

  @Input()
  sectionId: string;

  @Input()
  countersSection: CountersSection;

  protected inAndOutputNames: (keyof CountersSectionComponent & keyof this)[] = ['sectionId', 'countersSection'];

  protected getComponentName(): string {
    return 'CountersSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/explore/section-component/counters-section/counters-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./counters-section.component`);
  }

}
