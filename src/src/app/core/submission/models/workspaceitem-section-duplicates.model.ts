/*
 * Object model for the data returned by the REST API to present potential duplicates in a submission section
 */
import { Duplicate } from '../../../shared/object-list/duplicate-data/duplicate.model';

export interface WorkspaceitemSectionDuplicatesObject {
  potentialDuplicates?: Duplicate[]
}
