import { ThemedComponent } from '../../../../../theme-support/themed.component';
import { DsDynamicLookupRelationSearchTabComponent } from './dynamic-lookup-relation-search-tab.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RelationshipOptions } from '../../../models/relationship-options.model';
import { Observable } from 'rxjs';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { Context } from '../../../../../../core/shared/context.model';
import { RelationshipType } from '../../../../../../core/shared/item-relationships/relationship-type.model';
import { Item } from '../../../../../../core/shared/item.model';
import { SearchResult } from '../../../../../search/models/search-result.model';
import { SearchObjects } from '../../../../../search/models/search-objects.model';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';

@Component({
    selector: 'ds-themed-dynamic-lookup-relation-search-tab',
    styleUrls: [],
    templateUrl: '../../../../../theme-support/themed.component.html',
    standalone: true
})
export class ThemedDynamicLookupRelationSearchTabComponent extends ThemedComponent<DsDynamicLookupRelationSearchTabComponent> {
  protected inAndOutputNames: (keyof DsDynamicLookupRelationSearchTabComponent & keyof this)[] = ['relationship', 'listId',
    'query', 'repeatable', 'selection$', 'context', 'relationshipType', 'item', 'isLeft', 'toRemove', 'isEditRelationship',
    'deselectObject', 'selectObject', 'resultFound'];

  @Input() relationship: RelationshipOptions;

  @Input() listId: string;

  @Input() query: string;

  @Input() repeatable: boolean;

  @Input() selection$: Observable<ListableObject[]>;

  @Input() context: Context;

  @Input() relationshipType: RelationshipType;

  @Input() item: Item;

  @Input() isLeft: boolean;

  @Input() toRemove: SearchResult<Item>[];

  @Input() isEditRelationship: boolean;

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter();

  protected getComponentName(): string {
    return 'DsDynamicLookupRelationSearchTabComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../../themes/${themeName}/app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./dynamic-lookup-relation-search-tab.component`);
  }
}
