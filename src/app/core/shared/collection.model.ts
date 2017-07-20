import { DSpaceObject } from './dspace-object.model';
import { Bitstream } from './bitstream.model';
import { Item } from './item.model';
import { RemoteData } from '../data/remote-data';

export class Collection extends DSpaceObject {

  /**
   * A string representing the unique handle of this Collection
   */
  handle: string;

  /**
   * The introductory text of this Collection
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
   * The copyright text of this Collection
   * Corresponds to the metadata field dc.rights
   */
  get copyrightText(): string {
    return this.findMetadata('dc.rights');
  }

  /**
   * The license of this Collection
   * Corresponds to the metadata field dc.rights.license
   */
  get license(): string {
    return this.findMetadata('dc.rights.license');
  }

  /**
   * The sidebar text of this Collection
   * Corresponds to the metadata field dc.description.tableofcontents
   */
  get sidebarText(): string {
    return this.findMetadata('dc.description.tableofcontents');
  }

  /**
   * The Bitstream that represents the logo of this Collection
   */
  logo: RemoteData<Bitstream>;

  /**
   * An array of Collections that are direct parents of this Collection
   */
  parents: RemoteData<Collection[]>;

  /**
   * The Collection that owns this Collection
   */
  owner: RemoteData<Collection>;

  items: RemoteData<Item[]>;

}
