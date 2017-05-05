import { DSpaceObject } from "./dspace-object.model";
import { Collection } from "./collection.model";
import { RemoteData } from "../data/remote-data";
import { Bundle } from "./bundle.model";

export class Item extends DSpaceObject {

  /**
   * A string representing the unique handle of this Item
   */
  handle: string;

  /**
   * The Date of the last modification of this Item
   */
  lastModified: Date;

  /**
   * A boolean representing if this Item is currently archived or not
   */
  isArchived: boolean;

  /**
   * A boolean representing if this Item is currently withdrawn or not
   */
  isWithdrawn: boolean;

  /**
   * An array of Collections that are direct parents of this Item
   */
  parents: Array<Collection>;

  /**
   * The Collection that owns this Item
   */
  owner: Collection;

  bundles: Array<RemoteData<Bundle>>

}
