/*
 * Object model for the data returned by the REST API to present minted identifiers in a submission section
 */
export interface WorkspaceitemSectionIdentifiersObject {
  doi?: string
  handle?: string
  otherIdentifiers?: string[]
}
