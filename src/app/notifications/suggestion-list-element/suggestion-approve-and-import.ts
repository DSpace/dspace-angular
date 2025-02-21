import { Suggestion } from '../../../../modules/core/src/lib/core/notifications/suggestions/models/suggestion.model';

/**
 * A simple interface to unite a specific suggestion and the id of the chosen collection
 */
export interface SuggestionApproveAndImport {
  suggestion: Suggestion;
  collectionId: string;
}
