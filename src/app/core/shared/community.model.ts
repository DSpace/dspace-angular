import { Observable } from 'rxjs';
import { link } from '../cache/builders/build-decorators';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { Bitstream } from './bitstream.model';
import { BITSTREAM } from './bitstream.resource-type';
import { Collection } from './collection.model';
import { COLLECTION } from './collection.resource-type';
import { COMMUNITY } from './community.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';

export class Community extends DSpaceObject {
  static type = COMMUNITY;

  /**
   * A string representing the unique handle of this Community
   */
  handle: string;

  /**
   * The introductory text of this Community
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
   * The copyright text of this Community
   * Corresponds to the metadata field dc.rights
   */
  get copyrightText(): string {
    return this.firstMetadataValue('dc.rights');
  }

  /**
   * The sidebar text of this Community
   * Corresponds to the metadata field dc.description.tableofcontents
   */
  get sidebarText(): string {
    return this.firstMetadataValue('dc.description.tableofcontents');
  }

  /**
   * The Bitstream that represents the logo of this Community
   */
  @link(BITSTREAM)
  logo?: Observable<RemoteData<Bitstream>>;

  @link(COLLECTION, true)
  collections?: Observable<RemoteData<PaginatedList<Collection>>>;

  @link(COMMUNITY, true)
  subcommunities?: Observable<RemoteData<PaginatedList<Community>>>;

  _links: {
    collections: HALLink;
    logo: HALLink;
    subcommunities: HALLink;
    self: HALLink;
  }
}
