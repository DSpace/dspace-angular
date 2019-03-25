import { GenericConstructor } from '../../shared/generic-constructor';
import { ConfigType } from './config-type';
import { ConfigObject } from './config.model';
import { NormalizedSubmissionDefinitionsModel } from './normalized-config-submission-definitions.model';
import { NormalizedSubmissionFormsModel } from './normalized-config-submission-forms.model';
import { NormalizedSubmissionSectionModel } from './normalized-config-submission-section.model';
import { NormalizedSubmissionUploadsModel } from './normalized-config-submission-uploads.model';

/**
 * Class to return normalized models for config objects
 */
export class ConfigObjectFactory {
  public static getConstructor(type): GenericConstructor<ConfigObject> {
    switch (type) {
      case ConfigType.SubmissionDefinition:
      case ConfigType.SubmissionDefinitions: {
        return NormalizedSubmissionDefinitionsModel
      }
      case ConfigType.SubmissionForm:
      case ConfigType.SubmissionForms: {
        return NormalizedSubmissionFormsModel
      }
      case ConfigType.SubmissionSection:
      case ConfigType.SubmissionSections: {
        return NormalizedSubmissionSectionModel
      }
      case ConfigType.SubmissionUpload:
      case ConfigType.SubmissionUploads: {
        return NormalizedSubmissionUploadsModel
      }
      default: {
        return undefined;
      }
    }
  }
}
