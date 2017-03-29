import { inheritSerialization, autoserialize, autoserializeAs } from "cerialize";
import { DSpaceObject } from "./dspace-object.model";
import { Collection } from "./collection.model";

@inheritSerialization(DSpaceObject)
export class Item extends DSpaceObject {

  /**
   * A string representing the unique handle of this Item
   */
  @autoserialize
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
  @autoserializeAs(Collection)
  parents: Array<Collection>;

  /**
   * The Collection that owns this Item
   */
  owner: Collection;

}
