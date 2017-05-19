import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";
import { NormalizedBitstream } from "./normalized-bitstream.model";
import { NormalizedBundle } from "./normalized-bundle.model";
import { NormalizedItem } from "./normalized-item.model";
import { NormalizedCollection } from "./normalized-collection.model";
import { GenericConstructor } from "../../shared/generic-constructor";
import { NormalizedDSOType } from "./normalized-dspace-object-type";
import { NormalizedCommunity } from "./normalized-community.model";

export class NormalizedDSOFactory {
  public static getConstructor(type: NormalizedDSOType): GenericConstructor<NormalizedDSpaceObject> {
    switch (type) {
      case NormalizedDSOType.NormalizedBitstream: {
        return NormalizedBitstream
      }
      case NormalizedDSOType.NormalizedBundle: {
        return NormalizedBundle
      }
      case NormalizedDSOType.NormalizedItem: {
        return NormalizedItem
      }
      case NormalizedDSOType.NormalizedCollection: {
        return NormalizedCollection
      }
      case NormalizedDSOType.NormalizedCommunity: {
        return NormalizedCommunity
      }
      default: {
        return undefined;
      }
    }
  }
}
