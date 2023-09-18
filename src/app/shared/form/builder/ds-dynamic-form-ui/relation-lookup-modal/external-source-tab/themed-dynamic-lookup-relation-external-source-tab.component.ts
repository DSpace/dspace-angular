import { ThemedComponent } from '../../../../../theme-support/themed.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RelationshipOptions } from '../../../models/relationship-options.model';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { Context } from '../../../../../../core/shared/context.model';
import { Item } from '../../../../../../core/shared/item.model';
import { Collection } from '../../../../../../core/shared/collection.model';
import { ExternalSource } from '../../../../../../core/shared/external-source.model';
import { DsDynamicLookupRelationExternalSourceTabComponent } from './dynamic-lookup-relation-external-source-tab.component';

@Component({
  selector: 'ds-themed-dynamic-lookup-relation-external-source-tab',
  styleUrls: [],
  templateUrl: '../../../../../theme-support/themed.component.html',
})
export class ThemedDynamicLookupRelationExternalSourceTabComponent extends ThemedComponent<DsDynamicLookupRelationExternalSourceTabComponent> {
  protected inAndOutputNames: (keyof DsDynamicLookupRelationExternalSourceTabComponent & keyof this)[] = ['label', 'listId',
    'item', 'collection', 'relationship', 'context', 'query', 'repeatable', 'importedObject', 'externalSource'];

  @Input() label: string;

  @Input() listId: string;

  @Input() item: Item;

  @Input() collection: Collection;

  @Input() relationship: RelationshipOptions;

  @Input() context: Context;

  @Input() query: string;

  @Input() repeatable: boolean;

  @Output() importedObject: EventEmitter<ListableObject> = new EventEmitter();

  @Input() externalSource: ExternalSource;

  protected getComponentName(): string {
    return 'DsDynamicLookupRelationExternalSourceTabComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../../themes/${themeName}/app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./dynamic-lookup-relation-external-source-tab.component`);
  }
}
