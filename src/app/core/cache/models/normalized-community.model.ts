import { autoserialize, inheritSerialization, autoserializeAs } from "cerialize";
import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";
import { Community } from "../../shared/community.model";
import { mapsTo, relationship } from "../builders/build-decorators";
import { ResourceType } from "../../shared/resource-type";

@mapsTo(Community)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedCommunity extends NormalizedDSpaceObject {

  /**
   * A string representing the unique handle of this Community
   */
  @autoserialize
  handle: string;

  /**
   * The Bitstream that represents the logo of this Community
   */
  @autoserialize
  @relationship(ResourceType.Bitstream)
  logo: string;

  /**
   * An array of Communities that are direct parents of this Community
   */
  parents: Array<string>;

  /**
   * The Community that owns this Community
   */
  owner: string;

  @autoserialize
  @relationship(ResourceType.Collection)
  collections: Array<string>;

}
