
// REST Mock ---------------------------------------------------------------------
// -------------------------------------------------------------------------------

import { Suggestion } from '../../core/notifications/suggestions/models/suggestion.model';
import { SUGGESTION } from '../../core/notifications/suggestions/models/suggestion-objects.resource-type';

export const mockSuggestionPublicationOne: Suggestion =  {
  id: '24694773',
  display: 'publication one',
  source: 'reciter',
  externalSourceUri: 'https://dspace7.4science.cloud/server/api/integration/reciterSourcesEntry/pubmed/entryValues/24694772',
  score: '48',
  evidences: {
    acceptedRejectedEvidence: {
      score: '2.7',
      notes: 'some notes, eventually empty or null',
    },
    authorNameEvidence: {
      score: '0',
      notes: 'some notes, eventually empty or null',
    },
    journalCategoryEvidence: {
      score: '6',
      notes: 'some notes, eventually empty or null',
    },
    affiliationEvidence: {
      score: 'xxx',
      notes: 'some notes, eventually empty or null',
    },
    relationshipEvidence: {
      score: '9',
      notes: 'some notes, eventually empty or null',
    },
    educationYearEvidence: {
      score: '3.6',
      notes: 'some notes, eventually empty or null',
    },
    personTypeEvidence: {
      score: '4',
      notes: 'some notes, eventually empty or null',
    },
    articleCountEvidence: {
      score: '6.7',
      notes: 'some notes, eventually empty or null',
    },
    averageClusteringEvidence: {
      score: '7',
      notes: 'some notes, eventually empty or null',
    },
  },
  metadata: {
    'dc.identifier.uri': [
      {
        value: 'https://publication/0000-0003-3681-2038',
        language: null,
        authority: null,
        confidence: -1,
        place: -1,
      } as any,
    ],
    'dc.title': [
      {
        value: 'publication one',
        language: null,
        authority: null,
        confidence: -1,
      } as any,
    ],
    'dc.date.issued': [
      {
        value: '2010-11-03',
        language: null,
        authority: null,
        confidence: -1,
      }  as any,
    ],
    'dspace.entity.type': [
      {
        uuid: '95f21fe6-ce38-43d6-96d4-60ae66385a06',
        language: null,
        value: 'OrgUnit',
        place: 0,
        authority: null,
        confidence: -1,
      } as any,
    ],
    'dc.description': [
      {
        uuid: '95f21fe6-ce38-43d6-96d4-60ae66385a06',
        language: null,
        value: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        place: 0,
        authority: null,
        confidence: -1,
      } as any,
    ],
  },
  type: SUGGESTION,
  _links: {
    target: {
      href: 'https://dspace7.4science.cloud/server/api/core/items/gf3d657-9d6d-4a87-b905-fef0f8cae26',
    },
    self: {
      href: 'https://dspace7.4science.cloud/server/api/integration/suggestions/reciter:gf3d657-9d6d-4a87-b905-fef0f8cae26c:24694772',
    },
  },
};

export const mockSuggestionPublicationTwo: Suggestion =  {
  id: '24694772',
  display: 'publication two',
  source: 'reciter',
  externalSourceUri: 'https://dspace7.4science.cloud/server/api/integration/reciterSourcesEntry/pubmed/entryValues/24694772',
  score: '48',
  evidences: {
    acceptedRejectedEvidence: {
      score: '2.7',
      notes: 'some notes, eventually empty or null',
    },
    authorNameEvidence: {
      score: '0',
      notes: 'some notes, eventually empty or null',
    },
    journalCategoryEvidence: {
      score: '6',
      notes: 'some notes, eventually empty or null',
    },
    affiliationEvidence: {
      score: 'xxx',
      notes: 'some notes, eventually empty or null',
    },
    relationshipEvidence: {
      score: '9',
      notes: 'some notes, eventually empty or null',
    },
    educationYearEvidence: {
      score: '3.6',
      notes: 'some notes, eventually empty or null',
    },
    personTypeEvidence: {
      score: '4',
      notes: 'some notes, eventually empty or null',
    },
    articleCountEvidence: {
      score: '6.7',
      notes: 'some notes, eventually empty or null',
    },
    averageClusteringEvidence: {
      score: '7',
      notes: 'some notes, eventually empty or null',
    },
  },
  metadata: {
    'dc.identifier.uri': [
      {
        value: 'https://publication/0000-0003-3681-2038',
        language: null,
        authority: null,
        confidence: -1,
        place: -1,
      } as any,
    ],
    'dc.title': [
      {
        value: 'publication one',
        language: null,
        authority: null,
        confidence: -1,
      } as any,
    ],
    'dc.date.issued': [
      {
        value: '2010-11-03',
        language: null,
        authority: null,
        confidence: -1,
      } as any,
    ],
    'dspace.entity.type': [
      {
        uuid: '95f21fe6-ce38-43d6-96d4-60ae66385a06',
        language: null,
        value: 'OrgUnit',
        place: 0,
        authority: null,
        confidence: -1,
      } as any,
    ],
    'dc.description': [
      {
        uuid: '95f21fe6-ce38-43d6-96d4-60ae66385a06',
        language: null,
        value: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        place: 0,
        authority: null,
        confidence: -1,
      } as any,
    ],
  },
  type: SUGGESTION,
  _links: {
    target: {
      href: 'https://dspace7.4science.cloud/server/api/core/items/gf3d657-9d6d-4a87-b905-fef0f8cae26',
    },
    self: {
      href: 'https://dspace7.4science.cloud/server/api/integration/suggestions/reciter:gf3d657-9d6d-4a87-b905-fef0f8cae26c:24694772',
    },
  },
};
