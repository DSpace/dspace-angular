import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../shared/theme-support/themed.component';
import { RelatedEntitiesSearchComponent } from './related-entities-search.component';

/**
 * Themed wrapper for {@link RelatedEntitiesSearchComponent}
 */
@Component({
  selector: 'ds-related-entities-search',
  templateUrl: '../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    RelatedEntitiesSearchComponent,
  ],
})
export class ThemedRelatedEntitiesSearchComponent extends ThemedComponent<RelatedEntitiesSearchComponent> {

  @Input() relationType: string;

  @Input() configuration: string;

  @Input() item: Item;

  @Input() searchEnabled: boolean;

  @Input() sideBarWidth: number;

  protected inAndOutputNames: (keyof RelatedEntitiesSearchComponent & keyof this)[] = [
    'relationType',
    'configuration',
    'item',
    'searchEnabled',
    'sideBarWidth',
  ];

  protected getComponentName(): string {
    return 'RelatedEntitiesSearchComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/item-page/simple/related-entities/related-entities-search/related-entities-search.component.ts`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./related-entities-search.component');
  }

}
