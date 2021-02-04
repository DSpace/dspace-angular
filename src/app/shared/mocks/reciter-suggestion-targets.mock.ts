import { ResourceType } from '../../core/shared/resource-type';
import { OpenaireSuggestionTarget } from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';

// REST Mock ---------------------------------------------------------------------
// -------------------------------------------------------------------------------
export const mockSuggestionTargetsObjectOne: OpenaireSuggestionTarget = {
  type: new ResourceType('suggestiontarget'),
  id: 'reciter:gf3d657-9d6d-4a87-b905-fef0f8cae26',
  display: 'Bollini, Andrea',
  source: 'reciter',
  total: 31,
  _links: {
    target: {
      href: 'https://rest.api/rest/api/core/items/gf3d657-9d6d-4a87-b905-fef0f8cae26'
    },
    suggestions: {
      href: 'https://rest.api/rest/api/integration/suggestions/search/findByTargetAndSource?target=gf3d657-9d6d-4a87-b905-fef0f8cae26c&source=reciter'
    },
    self: {
      href: 'https://rest.api/rest/api/integration/suggestiontargets/reciter:gf3d657-9d6d-4a87-b905-fef0f8cae26'
    }
  }
};

export const mockSuggestionTargetsObjectTwo: OpenaireSuggestionTarget = {
  type: new ResourceType('suggestiontarget'),
  id: 'reciter:nhy567-9d6d-ty67-b905-fef0f8cae26',
  display: 'Digilio, Andrea',
  source: 'reciter',
  total: 12,
  _links: {
    target: {
      href: 'https://rest.api/rest/api/core/items/nhy567-9d6d-ty67-b905-fef0f8cae26'
    },
    suggestions: {
      href: 'https://rest.api/rest/api/integration/suggestions/search/findByTargetAndSource?target=nhy567-9d6d-ty67-b905-fef0f8cae26&source=reciter'
    },
    self: {
      href: 'https://rest.api/rest/api/integration/suggestiontargets/reciter:nhy567-9d6d-ty67-b905-fef0f8cae26'
    }
  }
};
