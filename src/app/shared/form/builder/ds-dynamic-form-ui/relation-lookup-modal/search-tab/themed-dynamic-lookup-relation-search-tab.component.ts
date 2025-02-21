import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';

import { ListableObject } from '@dspace/core';
import { Context } from '@dspace/core';
import { DSpaceObject } from '@dspace/core';
import { RelationshipOptions } from '@dspace/core';
import { Item } from '@dspace/core';
import { RelationshipType } from '@dspace/core';
import { SearchObjects } from '@dspace/core';
import { SearchResult } from '@dspace/core';
import { ThemedComponent } from '../../../../../theme-support/themed.component';
import { DsDynamicLookupRelationSearchTabComponent } from './dynamic-lookup-relation-search-tab.component';

@Component({
  selector: 'ds-dynamic-lookup-relation-search-tab',
  styleUrls: [],
  templateUrl: '../../../../../theme-support/themed.component.html',
  standalone: true,
  imports: [DsDynamicLookupRelationSearchTabComponent],
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
