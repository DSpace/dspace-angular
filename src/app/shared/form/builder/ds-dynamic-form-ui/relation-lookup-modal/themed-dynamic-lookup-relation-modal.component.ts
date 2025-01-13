import { ThemedComponent } from '../../../../theme-support/themed.component';
import { DynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';
import { Component, Input } from '@angular/core';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { Item } from '../../../../../core/shared/item.model';
import { Collection } from '../../../../../core/shared/collection.model';
import { Observable } from 'rxjs';
import { Context } from '../../../../../core/shared/context.model';
import { RelationshipType } from '../../../../../core/shared/item-relationships/relationship-type.model';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';

/**
 * Themed wrapper for {@link DynamicLookupRelationModalComponent}
 */
@Component({
  selector: 'ds-themed-dynamic-lookup-relation-modal',
  templateUrl: '../../../../theme-support/themed.component.html',
})
export class ThemedDynamicLookupRelationModalComponent extends ThemedComponent<DynamicLookupRelationModalComponent> {

  @Input() label: string;

  @Input() relationshipOptions: RelationshipOptions;

  @Input() listId: string;

  @Input() item: Item;

  @Input() collection: Collection;

  @Input() repeatable: boolean;

  @Input() context: Context;

  @Input() metadataFields: string;

  @Input() query: string;

  @Input() relationshipType: RelationshipType;

  @Input() currentItemIsLeftItem$: Observable<boolean>;

  @Input() isEditRelationship: boolean;

  @Input() toAdd: ItemSearchResult[];

  @Input() toRemove: ItemSearchResult[];

  @Input() isPending: boolean;

  @Input() submissionId: string;

  protected inAndOutputNames: (keyof DynamicLookupRelationModalComponent & keyof this)[] = [
    'label',
    'relationshipOptions',
    'listId',
    'item',
    'collection',
    'repeatable',
    'context',
    'metadataFields',
    'query',
    'relationshipType',
    'currentItemIsLeftItem$',
    'isEditRelationship',
    'toAdd',
    'toRemove',
    'isPending',
    'submissionId',
  ];

  protected getComponentName(): string {
    return 'DynamicLookupRelationModalComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./dynamic-lookup-relation-modal.component');
  }

}
