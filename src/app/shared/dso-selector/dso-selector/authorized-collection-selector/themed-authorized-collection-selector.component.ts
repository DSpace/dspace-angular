import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { SortOptions } from '../../../../core/cache/models/sort-options.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { AuthorizedCollectionSelectorComponent } from './authorized-collection-selector.component';

/**
 * Themed wrapper for {@link AuthorizedCollectionSelectorComponent}
 */
@Component({
  selector: 'ds-authorized-collection-selector',
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    AuthorizedCollectionSelectorComponent,
  ],
})
export class ThemedAuthorizedCollectionSelectorComponent extends ThemedComponent<AuthorizedCollectionSelectorComponent> {

  @Input() currentDSOId: string;

  @Input() types: DSpaceObjectType[];

  @Input() sort: SortOptions;

  @Input() entityType: string;

  @Output() onSelect: EventEmitter<DSpaceObject> = new EventEmitter();

  protected inAndOutputNames: (keyof AuthorizedCollectionSelectorComponent & keyof this)[] = [
    'currentDSOId',
    'types',
    'sort',
    'entityType',
    'onSelect',
  ];

  protected getComponentName(): string {
    return 'AuthorizedCollectionSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./authorized-collection-selector.component');
  }

}
