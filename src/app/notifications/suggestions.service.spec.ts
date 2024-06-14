import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import {
  SortDirection,
  SortOptions,
} from '../core/cache/models/sort-options.model';
import { FindListOptions } from '../core/data/find-list-options.model';
import { SuggestionTarget } from '../core/notifications/suggestions/models/suggestion-target.model';
import { SuggestionDataService } from '../core/notifications/suggestions/suggestion-data.service';
import { SuggestionTargetDataService } from '../core/notifications/suggestions/target/suggestion-target-data.service';
import { ResearcherProfile } from '../core/profile/model/researcher-profile.model';
import { ResearcherProfileDataService } from '../core/profile/researcher-profile-data.service';
import { ResourceType } from '../core/shared/resource-type';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { mockSuggestionPublicationOne } from '../shared/mocks/publication-claim.mock';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { followLink } from '../shared/utils/follow-link-config.model';
import { SuggestionsService } from './suggestions.service';

describe('SuggestionsService test', () => {
  let scheduler: TestScheduler;
  let service: SuggestionsService;
  let researcherProfileService: ResearcherProfileDataService;
  let suggestionsDataService: SuggestionDataService;
  let suggestionTargetDataService: SuggestionTargetDataService;
  let translateService: any = {
    instant: (str) => str,
  };
  const suggestionTarget = {
    id: '1234:4321',
    display: 'display',
    source: 'source',
    total: 8,
    type: new ResourceType('suggestiontarget'),
  };

  const mockResercherProfile = {
    id: '1234',
    uuid: '1234',
    visible: true,
  };

  function initTestService() {
    return new SuggestionsService(
      researcherProfileService,
      suggestionsDataService,
      suggestionTargetDataService,
      translateService,
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();

    researcherProfileService = jasmine.createSpyObj('researcherProfileService', {
      findById: createSuccessfulRemoteDataObject$(mockResercherProfile as ResearcherProfile),
      findRelatedItemId: observableOf('1234'),
    });

    suggestionTargetDataService = jasmine.createSpyObj('suggestionTargetsDataService', {
      getTargetsBySource: observableOf(null),
      findById: observableOf(null),
    });

    suggestionsDataService = jasmine.createSpyObj('suggestionsDataService', {
      searchBy: observableOf(null),
      delete: observableOf(null),
      deleteSuggestion: createSuccessfulRemoteDataObject$({}),
      getSuggestionsByTargetAndSource : observableOf(null),
      clearSuggestionRequests : null,
      getTargetsByUser: observableOf(null),
    });

    service = initTestService();

  });

  describe('Suggestion service', () => {
    it('should create', () => {
      expect(service).toBeDefined();
    });

    it('should get targets', () => {
      const sortOptions = new SortOptions('display', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: 10,
        currentPage: 1,
        sort: sortOptions,
      };
      service.getTargets('source', 10, 1);
      expect(suggestionTargetDataService.getTargetsBySource).toHaveBeenCalledWith('source', findListOptions);
    });

    it('should get suggestions', () => {
      const sortOptions = new SortOptions('display', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: 10,
        currentPage: 1,
        sort: sortOptions,
      };
      service.getSuggestions('source:target', 10, 1, sortOptions);
      expect(suggestionsDataService.getSuggestionsByTargetAndSource).toHaveBeenCalledWith('target', 'source', findListOptions);
    });

    it('should clear suggestions', () => {
      service.clearSuggestionRequests();
      expect(suggestionsDataService.clearSuggestionRequests).toHaveBeenCalled();
    });

    it('should delete reviewed suggestion', () => {
      service.deleteReviewedSuggestion('1234');
      expect(suggestionsDataService.deleteSuggestion).toHaveBeenCalledWith('1234');
    });

    it('should retrieve current user suggestions', () => {
      service.retrieveCurrentUserSuggestions('1234');
      expect(researcherProfileService.findById).toHaveBeenCalledWith('1234', true, true, followLink('item'));
    });

    it('should approve and import suggestion', () => {
      spyOn(service, 'resolveCollectionId');
      const workspaceitemService = { importExternalSourceEntry: (x,y) => observableOf(null) };
      service.approveAndImport(workspaceitemService as unknown as WorkspaceitemDataService, mockSuggestionPublicationOne, '1234');
      expect(service.resolveCollectionId).toHaveBeenCalled();
    });

    it('should approve and import suggestions', () => {
      spyOn(service, 'approveAndImport');
      const workspaceitemService = { importExternalSourceEntry: (x,y) => observableOf(null) };
      service.approveAndImportMultiple(workspaceitemService as unknown as WorkspaceitemDataService, [mockSuggestionPublicationOne], '1234');
      expect(service.approveAndImport).toHaveBeenCalledWith(workspaceitemService as unknown as WorkspaceitemDataService, mockSuggestionPublicationOne, '1234');
    });

    it('should delete suggestion', () => {
      spyOn(service, 'deleteReviewedSuggestion').and.returnValue(createSuccessfulRemoteDataObject$({}));
      service.ignoreSuggestion('1234');
      expect(service.deleteReviewedSuggestion).toHaveBeenCalledWith('1234');
    });

    it('should delete suggestions', () => {
      spyOn(service, 'ignoreSuggestion');
      service.ignoreSuggestionMultiple([mockSuggestionPublicationOne]);
      expect(service.ignoreSuggestion).toHaveBeenCalledWith(mockSuggestionPublicationOne.id);
    });

    it('should get target Uuid', () => {
      expect(service.getTargetUuid(suggestionTarget as SuggestionTarget)).toBe('4321');
      expect(service.getTargetUuid({ id: '' } as SuggestionTarget)).toBe(null);
    });

    it('should get suggestion interpolation', () => {
      const result = service.getNotificationSuggestionInterpolation(suggestionTarget as SuggestionTarget);
      expect(result.count).toEqual(suggestionTarget.total);
      expect(result.source).toEqual('suggestion.source.' + suggestionTarget.source);
      expect(result.type).toEqual('suggestion.type.' + suggestionTarget.source);
      expect(result.suggestionId).toEqual(suggestionTarget.id);
      expect(result.displayName).toEqual(suggestionTarget.display);
    });

    it('should translate suggestion type', () => {
      expect(service.translateSuggestionType('source')).toEqual('suggestion.type.source');
    });

    it('should translate suggestion source', () => {
      expect(service.translateSuggestionSource('source')).toEqual('suggestion.source.source');
    });

    it('should resolve collection id', () => {
      expect(service.resolveCollectionId(mockSuggestionPublicationOne, '1234')).toEqual('1234');
    });

    it('should check if collection is fixed', () => {
      expect(service.isCollectionFixed([mockSuggestionPublicationOne])).toBeFalse();
    });
  });
});
