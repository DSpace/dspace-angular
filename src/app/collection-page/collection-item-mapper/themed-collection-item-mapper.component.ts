import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { CollectionItemMapperComponent } from './collection-item-mapper.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ds-themed-collection-item-mapper',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedCollectionItemMapperComponent extends ThemedComponent<CollectionItemMapperComponent> {
    protected getComponentName(): string {
        return 'CollectionItemMapperComponent';
    }
    protected importThemedComponent(themeName: string): Promise<any> {
        return import(`../../../themes/${themeName}/app/collection-page/collection-item-mapper/collection-item-mapper.component`);
    }
    protected importUnthemedComponent(): Promise<any> {
        return import(`./collection-item-mapper.component`);
    }
}
