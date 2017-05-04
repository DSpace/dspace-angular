import { autoserialize, inheritSerialization, autoserializeAs } from "cerialize";
import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";
import { Collection } from "../../shared/collection.model";
import { mapsTo, relationship } from "../builders/build-decorators";
import { NormalizedItem } from "./normalized-item.model";

@mapsTo(Collection)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedCollection extends NormalizedDSpaceObject {

  /**
   * A string representing the unique handle of this Collection
   */
  @autoserialize
  handle: string;

  /**
   * The Bitstream that represents the logo of this Collection
   */
  logo: string;

  /**
   * An array of Collections that are direct parents of this Collection
   */
  parents: Array<string>;

  /**
   * The Collection that owns this Collection
   */
  owner: string;

  @autoserialize
  @relationship(NormalizedItem)
  items: Array<string>;

}
