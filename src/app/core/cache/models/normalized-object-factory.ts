import { NormalizedDSpaceObject } from "./normalized-dspace-object.model";
import { NormalizedBitstream } from "./normalized-bitstream.model";
import { NormalizedBundle } from "./normalized-bundle.model";
import { NormalizedItem } from "./normalized-item.model";
import { NormalizedCollection } from "./normalized-collection.model";
import { GenericConstructor } from "../../shared/generic-constructor";
import { NormalizedCommunity } from "./normalized-community.model";
import { ResourceType } from "../../shared/resource-type";

export class NormalizedObjectFactory {
  public static getConstructor(type: ResourceType): GenericConstructor<NormalizedDSpaceObject> {
    switch (type) {
      case ResourceType.Bitstream: {
        return NormalizedBitstream
      }
      case ResourceType.Bundle: {
        return NormalizedBundle
      }
      case ResourceType.Item: {
        return NormalizedItem
      }
      case ResourceType.Collection: {
        return NormalizedCollection
      }
      case ResourceType.Community: {
        return NormalizedCommunity
      }
      default: {
        return undefined;
      }
    }
  }
}
