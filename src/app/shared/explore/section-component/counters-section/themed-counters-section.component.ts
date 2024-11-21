import {
  Component,
  Input,
} from '@angular/core';

import { ThemedComponent } from '../../../theme-support/themed.component';
import {
  CountersSection,
  CountersSectionComponent,
} from './counters-section.component';

@Component({
  selector: 'ds-counters-section',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [CountersSectionComponent],
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
