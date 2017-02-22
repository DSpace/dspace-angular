import { autoserialize, autoserializeAs } from "cerialize";
import { Metadatum } from "./metadatum.model"
import { isEmpty, isNotEmpty } from "../../shared/empty.util";
import { CacheableObject } from "../cache/object-cache.reducer";

/**
 * An abstract model class for a DSpaceObject.
 */
export abstract class DSpaceObject implements CacheableObject {

    /**
     * The human-readable identifier of this DSpaceObject
     */
    @autoserialize
    id: string;

    /**
     * The universally unique identifier of this DSpaceObject
     */
    @autoserialize
    uuid: string;

    /**
     * A string representing the kind of DSpaceObject, e.g. community, item, …
     */
    type: string;

    /**
     * The name for this DSpaceObject
     */
    @autoserialize
    name: string;

    /**
     * An array containing all metadata of this DSpaceObject
     */
    @autoserializeAs(Metadatum)
    metadata: Array<Metadatum>;

    /**
     * An array of DSpaceObjects that are direct parents of this DSpaceObject
     */
    parents: Array<DSpaceObject>;

    /**
     * The DSpaceObject that owns this DSpaceObject
     */
    owner: DSpaceObject;

  /**
   * Find a metadata field by key and language
   *
   * This method returns the value of the first element
   * in the metadata array that matches the provided
   * key and language
   *
   * @param key
   * @param language
   * @return string
   */
    findMetadata(key: string, language?: string): string {
      const metadatum = this.metadata
        .find((metadatum: Metadatum) => {
          return metadatum.key === key &&
            (isEmpty(language) || metadatum.language === language)
        });
      if (isNotEmpty(metadatum)) {
        return metadatum.value;
      }
      else {
        return undefined;
      }
    }
}
