import { Component, Input } from '@angular/core';
import { BadgesComponent } from './badges.component';
import { ThemedComponent } from '../../theme-support/themed.component';
import { Observable } from 'rxjs/internal/Observable';
import { SearchFiltersComponent } from '../../search/search-filters/search-filters.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

/**
 * Themed wrapper for BadgesComponent
 */
@Component({
  selector: 'ds-themed-badges',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedBadgesComponent extends ThemedComponent<BadgesComponent> {
  @Input() object: DSpaceObject;

  protected inAndOutputNames: (keyof BadgesComponent & keyof this)[] = ['object'];

  protected getComponentName(): string {
    return 'BadgesComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/object-list/badges/badges.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./badges.component`);
  }
}
