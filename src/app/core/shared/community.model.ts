import { DSpaceObject } from './dspace-object.model';
import { Bitstream } from './bitstream.model';
import { Collection } from './collection.model';
import { RemoteData } from '../data/remote-data';
import { Observable } from 'rxjs';
import { PaginatedList } from '../data/paginated-list';
import { ResourceType } from './resource-type';

export class Community extends DSpaceObject {
  static type = new ResourceType('community');

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
  logo: Observable<RemoteData<Bitstream>>;

  /**
   * An array of Communities that are direct parents of this Community
   */
  parents: Observable<RemoteData<DSpaceObject[]>>;

  /**
   * The Community that owns this Community
   */
  owner: Observable<RemoteData<Community>>;

  collections: Observable<RemoteData<PaginatedList<Collection>>>;

  subcommunities: Observable<RemoteData<PaginatedList<Community>>>;

}
