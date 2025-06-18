/* eslint-disable no-empty, @typescript-eslint/no-empty-function */
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { Relationship } from '../../core/shared/item-relationships/relationship.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { MetadataRepresentation } from '../../core/shared/metadata-representation/metadata-representation.model';
import { NoContent } from '../../core/shared/NoContent.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { FollowLinkConfig } from '../utils/follow-link-config.model';

/**
 * Stub class of {@link RelationshipDataService}
 */
export class RelationshipDataServiceStub {

  deleteRelationship(_id: string, _copyVirtualMetadata: string, _shouldRefresh = true): Observable<RemoteData<NoContent>> {
    return createSuccessfulRemoteDataObject$({});
  }

  addRelationship(_typeId: string, _item1: Item, _item2: Item, _leftwardValue?: string, _rightwardValue?: string, _shouldRefresh = true): Observable<RemoteData<Relationship>> {
    return createSuccessfulRemoteDataObject$(new Relationship());
  }

  refreshRelationshipItemsInCache(_item: Item): void {
  }

  getItemRelationshipsArray(_item: Item, ..._linksToFollow: FollowLinkConfig<Relationship>[]): Observable<Relationship[]> {
    return observableOf([]);
  }

  getRelatedItems(_item: Item): Observable<Item[]> {
    return observableOf([]);
  }

  getRelatedItemsByLabel(_item: Item, _label: string, _options?: FindListOptions): Observable<RemoteData<PaginatedList<Item>>> {
    return createSuccessfulRemoteDataObject$(new PaginatedList<Item>());
  }

  getItemRelationshipsByLabel(_item: Item, _label: string, _options?: FindListOptions, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<Relationship>[]): Observable<RemoteData<PaginatedList<Relationship>>> {
    return createSuccessfulRemoteDataObject$(new PaginatedList<Relationship>());
  }

  getRelationshipByItemsAndLabel(_item1: Item, _item2: Item, _label: string, _options?: FindListOptions): Observable<Relationship> {
    return observableOf(new Relationship());
  }

  setNameVariant(_listID: string, _itemID: string, _nameVariant: string): void {
  }

  getNameVariant(_listID: string, _itemID: string): Observable<string> {
    return observableOf('');
  }

  updateNameVariant(_item1: Item, _item2: Item, _relationshipLabel: string, _nameVariant: string): Observable<RemoteData<Relationship>> {
    return createSuccessfulRemoteDataObject$(new Relationship());
  }

  isLeftItem(_relationship: Relationship, _item: Item): Observable<boolean> {
    return observableOf(false);
  }

  update(_object: Relationship): Observable<RemoteData<Relationship>> {
    return createSuccessfulRemoteDataObject$(new Relationship());
  }

  searchByItemsAndType(_typeId: string, _itemUuid: string, _relationshipLabel: string, _arrayOfItemIds: string[]): Observable<RemoteData<PaginatedList<Relationship>>> {
    return createSuccessfulRemoteDataObject$(new PaginatedList<Relationship>());
  }

  searchBy(_searchMethod: string, _options?: FindListOptions, _useCachedVersionIfAvailable?: boolean, _reRequestOnStale?: boolean, ..._linksToFollow: FollowLinkConfig<Relationship>[]): Observable<RemoteData<PaginatedList<Relationship>>> {
    return createSuccessfulRemoteDataObject$(new PaginatedList<Relationship>());
  }

  resolveMetadataRepresentation(_metadatum: MetadataValue, _parentItem: DSpaceObject, _itemType: string): Observable<MetadataRepresentation> {
    return observableOf({} as MetadataRepresentation);
  }

}
