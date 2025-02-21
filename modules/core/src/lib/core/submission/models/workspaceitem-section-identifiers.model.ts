/*
 * Object model for the data returned by the REST API to present minted identifiers in a submission section
 */
import { Identifier } from '../../data';

export interface WorkspaceitemSectionIdentifiersObject {
  identifiers?: Identifier[]
  displayTypes?: string[]
}
