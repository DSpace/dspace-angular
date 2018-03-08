import { NormalizedBitstream } from './normalized-bitstream.model';
import { NormalizedBundle } from './normalized-bundle.model';
import { NormalizedItem } from './normalized-item.model';
import { NormalizedCollection } from './normalized-collection.model';
import { GenericConstructor } from '../../shared/generic-constructor';
import { NormalizedCommunity } from './normalized-community.model';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedObject } from './normalized-object.model';
import { NormalizedBitstreamFormat } from './normalized-bitstream-format.model';
import { NormalizedLicense } from './normalized-license.model';
import { NormalizedResourcePolicy } from './normalized-resource-policy.model';
import { NormalizedWorkspaceItem } from '../../submission/models/normalized-workspaceitem.model';
import { NormalizedEpersonModel } from '../../eperson/models/NormalizedEperson.model';
import { NormalizedGroupModel } from '../../eperson/models/NormalizedGroup.model';
import { NormalizedWorkflowItem } from '../../submission/models/normalized-workflowitem.model';
import { NormalizedClaimedTask } from '../../tasks/models/normalized-claimed-task-object.model';
import { NormalizedPoolTask } from '../../tasks/models/normalized-pool-task-object.model';

export class NormalizedObjectFactory {
  public static getConstructor(type: ResourceType): GenericConstructor<NormalizedObject> {
    switch (type) {
      case ResourceType.Bitstream: {
        return NormalizedBitstream
      }
      case ResourceType.BitstreamFormat: {
        return NormalizedBitstreamFormat
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
      case ResourceType.License: {
        return NormalizedLicense
      }
      case ResourceType.ResourcePolicy: {
        return NormalizedResourcePolicy
      }
      case ResourceType.Workspaceitem: {
        return NormalizedWorkspaceItem
      }
      case ResourceType.Eperson: {
       return NormalizedEpersonModel
      }
      case ResourceType.Group: {
       return NormalizedGroupModel
      }
      case ResourceType.Workflowitem: {
        return NormalizedWorkflowItem
      }
      case ResourceType.ClaimedTask: {
        return NormalizedClaimedTask
      }
      case ResourceType.PoolTask: {
        return NormalizedPoolTask
      }
      default: {
        return undefined;
      }
    }
  }
}
