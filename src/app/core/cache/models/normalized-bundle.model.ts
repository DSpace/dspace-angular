import { autoserialize, inheritSerialization } from "cerialize";
import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";
import { Bundle } from "../../shared/bundle.model";
import { mapsTo, relationship } from "../builders/build-decorators";
import { NormalizedDSOType } from "./normalized-dspace-object-type";

@mapsTo(Bundle)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedBundle extends NormalizedDSpaceObject {
  /**
   * The primary bitstream of this Bundle
   */
  @autoserialize
  @relationship(NormalizedDSOType.NormalizedBitstream)
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
  @relationship(NormalizedDSOType.NormalizedBitstream)
  bitstreams: Array<string>;
}
