import { autoserialize, inheritSerialization, autoserializeAs } from "cerialize";
import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";
import { Collection } from "../../shared/collection.model";
import { mapsTo, relationship } from "../builders/build-decorators";
import { ResourceType } from "../../shared/resource-type";

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
   * An array of Communities that are direct parents of this Collection
   */
  @autoserialize
  @relationship(ResourceType.Community)
  parents: Array<string>;

  /**
   * The Community that owns this Collection
   */
  @autoserialize
  @relationship(ResourceType.Community)
  owner: string;

  @autoserialize
  @relationship(ResourceType.Item)
  items: Array<string>;

}
