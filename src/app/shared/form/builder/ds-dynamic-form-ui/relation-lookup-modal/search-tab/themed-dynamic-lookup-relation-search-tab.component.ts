import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import { RelationshipType } from '@dspace/core/shared/item-relationships/relationship-type.model';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { RelationshipOptions } from '@dspace/core/shared/relationship-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { Observable } from 'rxjs';

import { ThemedComponent } from '../../../../../theme-support/themed.component';
import { DsDynamicLookupRelationSearchTabComponent } from './dynamic-lookup-relation-search-tab.component';

@Component({
  selector: 'ds-dynamic-lookup-relation-search-tab',
  styleUrls: [],
  templateUrl: '../../../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    DsDynamicLookupRelationSearchTabComponent,
  ],
})
export class ThemedDynamicLookupRelationSearchTabComponent extends ThemedComponent<DsDynamicLookupRelationSearchTabComponent> {
  protected inAndOutputNames: (keyof DsDynamicLookupRelationSearchTabComponent & keyof this)[] = ['relationship', 'listId',
    'query', 'hiddenQuery', 'repeatable', 'selection$', 'context', 'relationshipType', 'item', 'isLeft', 'toRemove', 'isEditRelationship',
    'deselectObject', 'selectObject', 'resultFound'];

  @Input() relationship: RelationshipOptions;

  @Input() listId: string;

  @Input() query: string;

  @Input() hiddenQuery: string;

  @Input() repeatable: boolean;

  @Input() selection$: Observable<ListableObject[]>;

  @Input() context: Context;

  @Input() relationshipType: RelationshipType;

  @Input() item: Item;

  @Input() isLeft: boolean;

  @Input() toRemove: SearchResult<Item>[];

  @Input() isEditRelationship: boolean;

  @Output() deselectObject: EventEmitter<SearchResult<DSpaceObject>> = new EventEmitter();

  @Output() selectObject: EventEmitter<SearchResult<DSpaceObject>> = new EventEmitter();

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
