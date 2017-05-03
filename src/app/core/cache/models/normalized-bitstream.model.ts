import { inheritSerialization, autoserialize } from "cerialize";
import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";

@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedBitstream extends NormalizedDSpaceObject {

    /**
     * The size of this bitstream in bytes(?)
     */
    size: number;

    /**
     * The relative path to this Bitstream's file
     */
    url: string;

    /**
     * The mime type of this Bitstream
     */
    mimetype: string;

    /**
     * The description of this Bitstream
     */
    description: string;

    /**
     * An array of Bundles that are direct parents of this Bitstream
     */
    parents: Array<string>;

    /**
     * The Bundle that owns this Bitstream
     */
    owner: string;

    @autoserialize
    retrieve: string;
}
