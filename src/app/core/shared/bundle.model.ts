import { inheritSerialization } from "cerialize";
import { DSpaceObject } from "./dspace-object.model";
import { Bitstream } from "./bitstream.model";
import { Item } from "./item.model";

@inheritSerialization(DSpaceObject)
export class Bundle extends DSpaceObject {
  /**
   * The primary bitstream of this Bundle
   */
  primaryBitstream: Bitstream;

  /**
   * An array of Items that are direct parents of this Bundle
   */
  parents: Array<Item>;

  /**
   * The Item that owns this Bundle
   */
  owner: Item;

}
