import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SubmissionDefinitionActionTypes = {
  NEW_DEFINITION: type('dspace/submission/definition/NEW_DEFINITION'),
  NEW_SECTION_DEFINITION: type('dspace/submission/definition/NEW_SECTION_DEFINITION'),
  INIT_DEFAULT_DEFINITION: type('dspace/submission/definition/INIT_DEFAULT_DEFINITION'),
  COMPLETE_INIT_DEFAULT_DEFINITION: type('dspace/submission/definition/COMPLETE_INIT_DEFAULT_DEFINITION'),
};

/* tslint:disable:max-classes-per-file */

export class InitDefaultDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.INIT_DEFAULT_DEFINITION;
  payload: {
    collectionId: string;
    submissionId: string;
    selfUrl: string;
    sections: WorkspaceitemSectionsObject;
  };

  /**
   * Create a new InitDefaultDefinitionAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param submissionId
   *    the submission's ID
   */
  constructor(collectionId: string, submissionId: string, selfUrl: string, sections: WorkspaceitemSectionsObject) {
    this.payload = { collectionId, submissionId, selfUrl, sections };
  }
}

export class CompleteInitAction implements Action {
  type = SubmissionDefinitionActionTypes.COMPLETE_INIT_DEFAULT_DEFINITION;
  payload: {
    collectionId: string;
    definitionId: string;
    submissionId: string;
    selfUrl: string;
    sections: WorkspaceitemSectionsObject;
  };

  /**
   * Create a new CompleteInitAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param definitionId
   *    the definition's ID to use
   * @param submissionId
   *    the submission's ID
   */
  constructor(collectionId: string, definitionId: string, submissionId: string, selfUrl: string, sections: WorkspaceitemSectionsObject) {
    this.payload = { collectionId, definitionId, submissionId, selfUrl, sections };
  }
}

export class NewDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.NEW_DEFINITION;
  payload: {
    definition: SubmissionDefinitionsModel;
  };

  /**
   * Create a new NewDefinitionAction
   *
   * @param definition
   *    the definition's model to instantiate
   */
  constructor(definition: SubmissionDefinitionsModel) {
    this.payload = { definition };
  }
}

export class NewSectionDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.NEW_SECTION_DEFINITION;
  payload: {
    definitionId: string;
    sectionId: string;
    sectionObject: SubmissionSectionModel;
  };

  /**
   * Create a new NewSectionDefinitionAction
   *
   * @param definitionId
   *    the definition's ID where to add section's definition
   * @param sectionId
   *    the section's ID to add
   * @param sectionObject
   *    the section's properties
   */
  constructor(definitionId: string, sectionId: string, sectionObject: SubmissionSectionModel) {
    this.payload = { definitionId, sectionId, sectionObject};
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type DefinitionsAction
  = InitDefaultDefinitionAction
  | CompleteInitAction
  | NewDefinitionAction
  | NewSectionDefinitionAction
