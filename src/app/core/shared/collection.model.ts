import { Observable } from 'rxjs';
import { link } from '../cache/builders/build-decorators';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { Bitstream } from './bitstream.model';
import { BITSTREAM } from './bitstream.resource-type';
import { COLLECTION } from './collection.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';
import { License } from './license.model';
import { LICENSE } from './license.resource-type';
import { ResourcePolicy } from './resource-policy.model';
import { RESOURCE_POLICY } from './resource-policy.resource-type';

export class Collection extends DSpaceObject {
  static type = COLLECTION;

  /**
   * A string representing the unique handle of this Collection
   */
  handle: string;

  /**
   * The introductory text of this Collection
   * Corresponds to the metadata field dc.description
   */
  get introductoryText(): string {
    return this.firstMetadataValue('dc.description');
  }

  /**
   * The short description: HTML
   * Corresponds to the metadata field dc.description.abstract
   */
  get shortDescription(): string {
    return this.firstMetadataValue('dc.description.abstract');
  }

  /**
   * The copyright text of this Collection
   * Corresponds to the metadata field dc.rights
   */
  get copyrightText(): string {
    return this.firstMetadataValue('dc.rights');
  }

  /**
   * The license of this Collection
   * Corresponds to the metadata field dc.rights.license
   */
  get dcLicense(): string {
    return this.firstMetadataValue('dc.rights.license');
  }

  /**
   * The sidebar text of this Collection
   * Corresponds to the metadata field dc.description.tableofcontents
   */
  get sidebarText(): string {
    return this.firstMetadataValue('dc.description.tableofcontents');
  }

  /**
   * The deposit license of this Collection
   */
  @link(LICENSE)
  license?: Observable<RemoteData<License>>;

  /**
   * The Bitstream that represents the logo of this Collection
   */
  @link(BITSTREAM)
  logo?: Observable<RemoteData<Bitstream>>;

  /**
   * The default access conditions of this Collection
   */
  @link(RESOURCE_POLICY, true)
  defaultAccessConditions?: Observable<RemoteData<PaginatedList<ResourcePolicy>>>;

  _links: {
    license: HALLink;
    harvester: HALLink;
    mappedItems: HALLink;
    itemtemplate: HALLink;
    defaultAccessConditions: HALLink;
    logo: HALLink;
    self: HALLink;
  }
}
