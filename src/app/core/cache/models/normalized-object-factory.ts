import { NormalizedBitstream } from './normalized-bitstream.model';
import { NormalizedBundle } from './normalized-bundle.model';
import { NormalizedItem } from './normalized-item.model';
import { NormalizedCollection } from './normalized-collection.model';
import { GenericConstructor } from '../../shared/generic-constructor';
import { NormalizedCommunity } from './normalized-community.model';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedObject } from './normalized-object.model';
import { NormalizedLicense } from './normalized-license.model';
import { NormalizedResourcePolicy } from './normalized-resource-policy.model';
import { NormalizedWorkspaceItem } from '../../submission/models/normalized-workspaceitem.model';
import { NormalizedEPerson } from '../../eperson/models/normalized-eperson.model';
import { NormalizedGroup } from '../../eperson/models/normalized-group.model';
import { NormalizedWorkflowItem } from '../../submission/models/normalized-workflowitem.model';
import { NormalizedBitstreamFormat } from './normalized-bitstream-format.model';
import { SubmissionResourceType } from '../../submission/submission-resource-type';
import { SubmissionDefinitionsModel } from '../../shared/config/config-submission-definitions.model';
import { SubmissionFormsModel } from '../../shared/config/config-submission-forms.model';
import { SubmissionSectionModel } from '../../shared/config/config-submission-section.model';

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
      case ResourceType.License: {
        return NormalizedLicense
      }
      case ResourceType.ResourcePolicy: {
        return NormalizedResourcePolicy
      }
      case ResourceType.Workspaceitem: {
        return NormalizedWorkspaceItem
      }
      case ResourceType.EPerson: {
        return NormalizedEPerson
      }
      case ResourceType.Group: {
        return NormalizedGroup
      }
      case ResourceType.Workflowitem: {
        return NormalizedWorkflowItem
      }
      case ResourceType.BitstreamFormat: {
        return NormalizedBitstreamFormat
      }
      case ResourceType.SubmissionDefinition:
      case ResourceType.SubmissionDefinitions: {
        return SubmissionDefinitionsModel
      }
      case ResourceType.SubmissionForm:
      case ResourceType.SubmissionForms: {
        return SubmissionFormsModel
      }
      case ResourceType.SubmissionSection:
      case ResourceType.SubmissionSections: {
        return SubmissionSectionModel
      }
      default: {
        return undefined;
      }
    }
  }
}
