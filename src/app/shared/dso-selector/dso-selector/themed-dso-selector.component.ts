import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemedComponent } from '../../theme-support/themed.component';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSOSelectorComponent } from './dso-selector.component';

/**
 * Themed wrapper for {@link DSOSelectorComponent}
 */
@Component({
  selector: 'ds-themed-dso-selector',
  templateUrl: '../../theme-support/themed.component.html',
})
export class ThemedDSOSelectorComponent extends ThemedComponent<DSOSelectorComponent> {

  @Input() currentDSOId: string;

  @Input() types: DSpaceObjectType[];

  @Input() sort: SortOptions;

  @Output() onSelect: EventEmitter<DSpaceObject> = new EventEmitter();

  protected inAndOutputNames: (keyof DSOSelectorComponent & keyof this)[] = [
    'currentDSOId',
    'types',
    'sort',
    'onSelect',
  ];

  protected getComponentName(): string {
    return 'DSOSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/dso-selector/dso-selector/dso-selector.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./dso-selector.component');
  }

}
