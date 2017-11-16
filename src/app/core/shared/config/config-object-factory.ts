
import { GenericConstructor } from '../../shared/generic-constructor';

import { SubmissionSectionModel } from './config-submission-section.model';
import { SubmissionFormsModel } from './config-submission-forms.model';
import { SubmissionDefinitionsModel } from './config-submission-definitions.model';
import { ConfigType } from './config-type';
import { ConfigObject } from './config.model';

export class ConfigObjectFactory {
  public static getConstructor(type): GenericConstructor<ConfigObject> {
    switch (type) {
      case ConfigType.SubmissionDefinition:
      case ConfigType.SubmissionDefinitions: {
        return SubmissionDefinitionsModel
      }
      case ConfigType.SubmissionForm:
      case ConfigType.SubmissionForms: {
        return SubmissionFormsModel
      }
      case ConfigType.SubmissionSection:
      case ConfigType.SubmissionSections: {
        return SubmissionSectionModel
      }
      default: {
        return undefined;
      }
    }
  }
}
