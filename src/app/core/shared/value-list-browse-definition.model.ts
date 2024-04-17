import { inheritSerialization, deserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { VALUE_LIST_BROWSE_DEFINITION } from './value-list-browse-definition.resource-type';
import { ResourceType } from './resource-type';
import { NonHierarchicalBrowseDefinition } from './non-hierarchical-browse-definition';
import { HALLink } from './hal-link.model';

/**
 * BrowseDefinition model for browses of type 'valueList'
 */
@typedObject
@inheritSerialization(NonHierarchicalBrowseDefinition)
export class ValueListBrowseDefinition extends NonHierarchicalBrowseDefinition {
  static type = VALUE_LIST_BROWSE_DEFINITION;

  /**
   * The object type
   */
  @excludeFromEquals
  type: ResourceType = VALUE_LIST_BROWSE_DEFINITION;

  get self(): string {
    return this._links.self.href;
  }

  @deserialize
  _links: {
    self: HALLink;
    entries: HALLink;
  };

  getRenderType(): string {
    // FIXME
    // 4/17/2024 9:03 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/core/shared/non-hierarchical-browse-definition.ts
    // dataType: BrowseByDataType;

    // 4/17/2024 9:03 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/browse-by/browse-by-switcher/browse-by-decorator.ts#L9
    // export enum BrowseByDataType {
    //   Title = 'title',
    //   Metadata = 'text',
    //   Date = 'date'
    // }

    // 4/17/2024 9:03 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/core/shared/value-list-browse-definition.resource-type.ts
    // ...
    // 4/17/2024 9:05 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/shared/object-list/metadata-representation-list-element/browse-link/browse-link-metadata-list-element.component.ts
    // 4/17/2024 9:06 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/shared/object-list/metadata-representation-list-element/browse-link/browse-link-metadata-list-element.component.html#L5
    // ...
    // 4/17/2024 9:10 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/item-page/simple/metadata-representation-list/themed-metadata-representation-list.component.ts
    // 4/17/2024 9:10 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/item-page/simple/metadata-representation-list/metadata-representation-list.component.html
    // ...
    // 4/17/2024 9:11 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/shared/metadata-representation/metadata-representation-loader.component.ts
    // 4/17/2024 9:11 AM CDT https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/shared/metadata-representation/metadata-representation-loader.component.html

    // Return `VALUE_LIST_BROWSE_DEFINITION.value` for simple item view to render a link for 'dc.contributor.author' or 'dc.creator' of Person item type to the correct browse by URL with queryParam `value` and not `startsWith`.
    // https://github.com/DSpace/dspace-angular/blob/dspace-7.6.1/src/app/item-page/simple/item-types/untyped-item/untyped-item.component.html#L29

    // return this.dataType;
    return this.type.value;
  }
}
