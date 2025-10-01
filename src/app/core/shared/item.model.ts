import { AccessStatusObject } from '@dspace/core/shared/access-status.model';
import { ACCESS_STATUS } from '@dspace/core/shared/access-status.resource-type';
import { isEmpty } from '@dspace/shared/utils/empty.util';
import {
  autoserialize,
  autoserializeAs,
  deserialize,
  deserializeAs,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  link,
  typedObject,
} from '../cache/builders/build-decorators';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { Bitstream } from './bitstream.model';
import { BITSTREAM } from './bitstream.resource-type';
import { Bundle } from './bundle.model';
import { BUNDLE } from './bundle.resource-type';
import { ChildHALResource } from './child-hal-resource.model';
import { Collection } from './collection.model';
import { COLLECTION } from './collection.resource-type';
import { DSpaceObject } from './dspace-object.model';
import {
  followLink,
  FollowLinkConfig,
} from './follow-link-config.model';
import { GenericConstructor } from './generic-constructor';
import { HALLink } from './hal-link.model';
import { HandleObject } from './handle-object.model';
import { IdentifierData } from './identifiers-data/identifier-data.model';
import { IDENTIFIERS } from './identifiers-data/identifier-data.resource-type';
import { ITEM } from './item.resource-type';
import { Relationship } from './item-relationships/relationship.model';
import { RELATIONSHIP } from './item-relationships/relationship.resource-type';
import { ListableObject } from './object-collection/listable-object.model';
import { Version } from './version.model';
import { VERSION } from './version.resource-type';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export function getItemPageLinksToFollow(): FollowLinkConfig<Item>[] {
  const followLinks: FollowLinkConfig<Item>[] = [
    followLink('owningCollection', {},
      followLink('parentCommunity', {},
        followLink('parentCommunity')),
    ),
    followLink('relationships'),
    followLink('version', {}, followLink('versionhistory')),
    followLink('thumbnail'),
  ];
  if (environment.item.showAccessStatuses) {
    followLinks.push(followLink('accessStatus'));
  }
  return followLinks;
}

/**
 * Class representing a DSpace Item
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class Item extends DSpaceObject implements ChildHALResource, HandleObject {
  static type = ITEM;

  /**
   * A string representing the unique handle of this Item
   */
  @autoserialize
  handle: string;

  /**
   * The Date of the last modification of this Item
   */
  @deserializeAs(Date)
  lastModified: Date;

  /**
   * A boolean representing if this Item is currently archived or not
   */
  @autoserializeAs(Boolean, 'inArchive')
  isArchived: boolean;

  /**
   * A boolean representing if this Item is currently discoverable or not
   */
  @autoserializeAs(Boolean, 'discoverable')
  isDiscoverable: boolean;

  /**
   * A boolean representing if this Item is currently withdrawn or not
   */
  @autoserializeAs(Boolean, 'withdrawn')
  isWithdrawn: boolean;

  /**
   * The {@link HALLink}s for this Item
   */
  @deserialize
  _links: {
    mappedCollections: HALLink;
    relationships: HALLink;
    bundles: HALLink;
    owningCollection: HALLink;
    templateItemOf: HALLink;
    version: HALLink;
    thumbnail: HALLink;
    accessStatus: HALLink;
    identifiers: HALLink;
    self: HALLink;
  };

  /**
   * The owning Collection for this Item
   * Will be undefined unless the owningCollection {@link HALLink} has been resolved.
   */
  @link(COLLECTION)
  owningCollection?: Observable<RemoteData<Collection>>;

  /**
   * The version this item represents in its history
   * Will be undefined unless the version {@link HALLink} has been resolved.
   */
  @link(VERSION)
  version?: Observable<RemoteData<Version>>;

  /**
   * The list of Bundles inside this Item
   * Will be undefined unless the bundles {@link HALLink} has been resolved.
   */
  @link(BUNDLE, true)
  bundles?: Observable<RemoteData<PaginatedList<Bundle>>>;

  /**
   * The list of Relationships this Item has with others
   * Will be undefined unless the relationships {@link HALLink} has been resolved.
   */
  @link(RELATIONSHIP, true)
  relationships?: Observable<RemoteData<PaginatedList<Relationship>>>;

  /**
   * The thumbnail for this Item
   * Will be undefined unless the thumbnail {@link HALLink} has been resolved.
   */
  @link(BITSTREAM, false, 'thumbnail')
  thumbnail?: Observable<RemoteData<Bitstream>>;

  /**
   * The access status for this Item
   * Will be undefined unless the access status {@link HALLink} has been resolved.
   */
   @link(ACCESS_STATUS, false, 'accessStatus')
     accessStatus?: Observable<RemoteData<AccessStatusObject>>;

  /**
   * The identifier data for this Item
   * Will be undefined unless the identifiers {@link HALLink} has been resolved.
   */
  @link(IDENTIFIERS, false, 'identifiers')
  identifiers?: Observable<RemoteData<IdentifierData>>;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    const entityType = this.firstMetadataValue('dspace.entity.type');
    if (isEmpty(entityType)) {
      return super.getRenderTypes();
    }
    return [entityType, ...super.getRenderTypes()];
  }

  getParentLinkKey(): keyof this['_links'] {
    return 'owningCollection';
  }
}
