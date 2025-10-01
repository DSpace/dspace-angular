import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Collection } from '@dspace/core/shared/collection.model';
import { Context } from '@dspace/core/shared/context.model';
import { ExternalSource } from '@dspace/core/shared/external-source.model';
import { Item } from '@dspace/core/shared/item.model';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { RelationshipOptions } from '@dspace/core/shared/relationship-options.model';

import { ThemedComponent } from '../../../../../theme-support/themed.component';
import { DsDynamicLookupRelationExternalSourceTabComponent } from './dynamic-lookup-relation-external-source-tab.component';

@Component({
  selector: 'ds-dynamic-lookup-relation-external-source-tab',
  styleUrls: [],
  templateUrl: '../../../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    DsDynamicLookupRelationExternalSourceTabComponent,
  ],
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
