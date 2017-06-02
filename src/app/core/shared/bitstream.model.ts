import { DSpaceObject } from "./dspace-object.model";
import { Bundle } from "./bundle.model";
import { RemoteData } from "../data/remote-data";

export class Bitstream extends DSpaceObject {

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
    parents: RemoteData<Bundle[]>;

    /**
     * The Bundle that owns this Bitstream
     */
    owner: Bundle;

    /**
     * The Bundle that owns this Bitstream
     */
    retrieve: string;

}
