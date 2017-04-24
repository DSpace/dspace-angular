import { autoserialize, inheritSerialization } from "cerialize";
import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";

@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedBundle extends NormalizedDSpaceObject {
  /**
   * The primary bitstream of this Bundle
   */
  @autoserialize
  primaryBitstream: string;

  /**
   * An array of Items that are direct parents of this Bundle
   */
  parents: Array<string>;

  /**
   * The Item that owns this Bundle
   */
  owner: string;

  @autoserialize
  bitstreams: Array<string>;
}
