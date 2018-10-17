import { SubmissionDefinitionsModel } from '../config/models/config-submission-definitions.model';
import { SubmissionFormsModel } from '../config/models/config-submission-forms.model';
import { SubmissionSectionModel } from '../config/models/config-submission-section.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { NormalizedBitstream } from '../cache/models/normalized-bitstream.model';
import { NormalizedBundle } from '../cache/models/normalized-bundle.model';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { NormalizedItem } from '../cache/models/normalized-item.model';
import { NormalizedLicense } from '../cache/models/normalized-license.model';
import { NormalizedWorkspaceItem } from './models/normalized-workspaceitem.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { ConfigObject } from '../config/models/config.model';
import { SubmissionResourceType } from './submission-resource-type';
import { NormalizedResourcePolicy } from '../cache/models/normalized-resource-policy.model';
import { NormalizedWorkflowItem } from './models/normalized-workflowitem.model';
import { NormalizedEditItem } from './models/normalized-edititem.model';
import { ResourceType } from '../shared/resource-type';
import { NormalizedEPerson } from '../eperson/models/normalized-eperson.model';
import { NormalizedGroup } from '../eperson/models/normalized-group.model';

export class NormalizedSubmissionObjectFactory {
  public static getConstructor(type: SubmissionResourceType): GenericConstructor<NormalizedObject | ConfigObject> {
    switch (type) {
      case SubmissionResourceType.Bitstream: {
        return NormalizedBitstream
      }
      case SubmissionResourceType.Bundle: {
        return NormalizedBundle
      }
      case SubmissionResourceType.Item: {
        return NormalizedItem
      }
      case SubmissionResourceType.Collection: {
        return NormalizedCollection
      }
      case SubmissionResourceType.Community: {
        return NormalizedCommunity
      }
      case SubmissionResourceType.ResourcePolicy: {
        return NormalizedResourcePolicy
      }
      case SubmissionResourceType.License: {
        return NormalizedLicense
      }
      case SubmissionResourceType.EPerson: {
        return NormalizedEPerson
      }
      case SubmissionResourceType.Group: {
        return NormalizedGroup
      }
      case SubmissionResourceType.WorkspaceItem: {
        return NormalizedWorkspaceItem
      }
      case SubmissionResourceType.WorkflowItem: {
        return NormalizedWorkflowItem
      }
      case SubmissionResourceType.EditItem: {
        return NormalizedEditItem
      }
      case SubmissionResourceType.SubmissionDefinition:
      case SubmissionResourceType.SubmissionDefinitions: {
        return SubmissionDefinitionsModel
      }
      case SubmissionResourceType.SubmissionForm:
      case SubmissionResourceType.SubmissionForms: {
        return SubmissionFormsModel
      }
      case SubmissionResourceType.SubmissionSection:
      case SubmissionResourceType.SubmissionSections: {
        return SubmissionSectionModel
      }
      default: {
        return undefined;
      }
    }
  }
}
