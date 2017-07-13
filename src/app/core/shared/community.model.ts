import { DSpaceObject } from './dspace-object.model';
import { Bitstream } from './bitstream.model';
import { Collection } from './collection.model';
import { RemoteData } from '../data/remote-data';

export class Community extends DSpaceObject {

  /**
   * A string representing the unique handle of this Community
   */
  handle: string;

  /**
   * The introductory text of this Community
   * Corresponds to the metadata field dc.description
   */
  get introductoryText(): string {
    return this.findMetadata('dc.description');
  }

  /**
   * The short description: HTML
   * Corresponds to the metadata field dc.description.abstract
   */
  get shortDescription(): string {
    return this.findMetadata('dc.description.abstract');
  }

  /**
   * The copyright text of this Community
   * Corresponds to the metadata field dc.rights
   */
  get copyrightText(): string {
    return this.findMetadata('dc.rights');
  }

  /**
   * The sidebar text of this Community
   * Corresponds to the metadata field dc.description.tableofcontents
   */
  get sidebarText(): string {
    return this.findMetadata('dc.description.tableofcontents');
  }

  /**
   * The Bitstream that represents the logo of this Community
   */
  logo: RemoteData<Bitstream>;

  /**
   * An array of Communities that are direct parents of this Community
   */
  parents: RemoteData<DSpaceObject[]>;

  /**
   * The Community that owns this Community
   */
  owner: RemoteData<Community>;

  collections: RemoteData<Collection[]>;

}
