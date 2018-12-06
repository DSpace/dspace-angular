import { NormalizedBitstreamFormat } from './normalized-bitstream-format.model';
import { NormalizedBitstream } from './normalized-bitstream.model';
import { NormalizedBundle } from './normalized-bundle.model';
import { NormalizedCollection } from './normalized-collection.model';
import { NormalizedCommunity } from './normalized-community.model';
import { NormalizedItem } from './normalized-item.model';
import { NormalizedObject } from './normalized-object.model';
import { NormalizedResourcePolicy } from './normalized-resource-policy.model';
import { NormalizedEPerson } from '../../eperson/models/normalized-eperson.model';
import { NormalizedGroup } from '../../eperson/models/normalized-group.model';
import { GenericConstructor } from '../../shared/generic-constructor';
import { ResourceType } from '../../shared/resource-type';

export class NormalizedObjectFactory {
  public static getConstructor(type: ResourceType): GenericConstructor<NormalizedObject> {
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
      case ResourceType.BitstreamFormat: {
        return NormalizedBitstreamFormat
      }
      case ResourceType.ResourcePolicy: {
        return NormalizedResourcePolicy
      }
      case ResourceType.EPerson: {
        return NormalizedEPerson
      }
      case ResourceType.Group: {
        return NormalizedGroup
      }
      default: {
        return undefined;
      }
    }
  }
}
