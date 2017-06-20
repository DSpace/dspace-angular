import { inheritSerialization, autoserialize } from "cerialize";
import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";
import { Item } from "../../shared/item.model";
import { mapsTo, relationship } from "../builders/build-decorators";
import { ResourceType } from "../../shared/resource-type";

@mapsTo(Item)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedItem extends NormalizedDSpaceObject {

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
  @autoserialize
  @relationship(ResourceType.Collection)
  parents: Array<string>;

  /**
   * The Collection that owns this Item
   */
  owner: string;

  @autoserialize
  @relationship(ResourceType.Bundle)
  bundles: Array<string>;
}
