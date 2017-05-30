import { DSpaceObject } from "./dspace-object.model";
import { Collection } from "./collection.model";
import { RemoteData } from "../data/remote-data";
import { Bundle } from "./bundle.model";
import { Bitstream } from "./bitstream.model";
import { Observable } from "rxjs";
import { hasValue } from "../../shared/empty.util";

export class Item extends DSpaceObject {

    /**
     * A string representing the unique handle of this Item
     */
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
    parents: RemoteData<Collection[]>;

    /**
     * The Collection that owns this Item
     */
    owner: Collection;

    bundles: RemoteData<Bundle[]>;


    /**
     * Retrieves the thumbnail of this item
     * @returns {Observable<Bitstream>} the primaryBitstream of the "THUMBNAIL" bundle
     */
    getThumbnail(): Observable<Bitstream> {
        const bundle: Observable<Bundle> = this.getBundle("THUMBNAIL");
        return bundle
            .filter(bundle => hasValue(bundle))
            .flatMap(bundle => bundle.primaryBitstream.payload)
            .startWith(undefined);
    }

    /**
     * Retrieves the thumbnail for the given original of this item
     * @returns {Observable<Bitstream>} the primaryBitstream of the "THUMBNAIL" bundle
     */
    getThumbnailForOriginal(original: Bitstream): Observable<Bitstream> { //returns obs of obs of bitstream instead...
        const bundle: Observable<Bundle> = this.getBundle("THUMBNAIL");
        return bundle
            .filter(bundle => hasValue(bundle))
            .flatMap(bundle => bundle
                .bitstreams.payload.map(files => files
                    .find(thumbnail => thumbnail
                        .name.startsWith(original.name)
                    )
                )
            )
            .startWith(undefined);;
    }

    /**
     * Retrieves all files that should be displayed on the item page of this item
     * @returns {Observable<Array<Observable<Bitstream>>>} an array of all Bitstreams in the "ORIGINAL" bundle
     */
    getFiles(name: String = "ORIGINAL"): Observable<Bitstream[]> {
        const bundle: Observable <Bundle> = this.getBundle(name);
        return bundle
            .filter(bundle => hasValue(bundle))
            .flatMap(bundle => bundle.bitstreams.payload)
            .startWith([]);
    }

    /**
     * Retrieves the bundle of this item by its name
     * @param name The name of the Bundle that should be returned
     * @returns {Observable<Bundle>} the Bundle that belongs to this item with the given name
     */
    getBundle(name: String): Observable<Bundle> {
        return this.bundles.payload
            .filter(bundles => hasValue(bundles))
            .map(bundles => {
                return bundles.find((bundle: Bundle) => {
                    return bundle.name === name
                });
            })
            .startWith(undefined);
    }

}
