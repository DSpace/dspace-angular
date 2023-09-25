import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { MetadataRepresentationListComponent } from './metadata-representation-list.component';
import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';

@Component({
    selector: 'ds-themed-metadata-representation-list',
    styleUrls: [],
    templateUrl: '../../../shared/theme-support/themed.component.html',
    standalone: true
})
export class ThemedMetadataRepresentationListComponent extends ThemedComponent<MetadataRepresentationListComponent> {
  protected inAndOutputNames: (keyof MetadataRepresentationListComponent & keyof this)[] = ['parentItem', 'itemType', 'metadataFields', 'label', 'incrementBy'];

  @Input() parentItem: Item;

  @Input() itemType: string;

  @Input() metadataFields: string[];

  @Input() label: string;

  @Input() incrementBy: number;

  protected getComponentName(): string {
    return 'MetadataRepresentationListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/simple/metadata-representation-list/metadata-representation-list.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./metadata-representation-list.component`);
  }
}
