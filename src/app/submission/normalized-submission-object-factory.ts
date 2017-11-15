import { AccessCondition } from '../core/shared/access-condition.model';
import { SubmissionDefinitionsModel } from '../core/shared/config/config-submission-definitions.model';
import { SubmissionFormsModel } from '../core/shared/config/config-submission-forms.model';
import { SubmissionSectionModel } from '../core/shared/config/config-submission-section.model';
import { ConfigAuthorityModel } from '../core/shared/config/config-authority.model';
import { GenericConstructor } from '../core/shared/generic-constructor';
import { NormalizedBitstream } from '../core/cache/models/normalized-bitstream.model';
import { NormalizedBitstreamFormat } from '../core/cache/models/normalized-bitstream-format.model';
import { NormalizedBundle } from '../core/cache/models/normalized-bundle.model';
import { NormalizedCollection } from '../core/cache/models/normalized-collection.model';
import { NormalizedCommunity } from '../core/cache/models/normalized-community.model';
import { NormalizedItem } from '../core/cache/models/normalized-item.model';
import { NormalizedLicense } from '../core/cache/models/normalized-license.model';
import { NormalizedWorkspaceItem } from '../core/cache/models/normalized-workspaceitem.model';
import { NormalizedObject } from '../core/cache/models/normalized-object.model';
import { ConfigObject } from '../core/shared/config/config.model';
import { SubmissionResourceType } from './submission-resource-type';

export class NormalizedSubmissionObjectFactory {
  public static getConstructor(type: SubmissionResourceType): GenericConstructor<NormalizedObject|ConfigObject> {
    switch (type) {
      case SubmissionResourceType.Bitstream: {
        return NormalizedBitstream
      }
      case SubmissionResourceType.BitstreamFormat: {
        return NormalizedBitstreamFormat
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
      case SubmissionResourceType.AccessCondition: {
        return AccessCondition
      }
      case SubmissionResourceType.License: {
        return NormalizedLicense
      }
      case SubmissionResourceType.WorkspaceItem: {
        return NormalizedWorkspaceItem
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
      case SubmissionResourceType.Authority: {
        return ConfigAuthorityModel
      }
      default: {
        return undefined;
      }
    }
  }
}
