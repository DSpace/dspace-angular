import { throwError } from 'rxjs';

import { isNotEmpty } from '../../utils/empty.util';
import { getMockRemoteDataBuildService } from '../testing/remote-data-build.service.mock';
import { getMockRequestService } from '../testing/request.service.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../utilities/remote-data.utils';
import { HALEndpointServiceStub } from '../testing/hal-endpoint-service.stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { buildPaginatedList } from '../data/paginated-list.model';
import { RequestService } from '../data/request.service';
import { PageInfo } from '../shared/page-info.model';
import { ConfigDataService } from './config-data.service';
import { SubmissionDefinitionsModel } from './models/config-submission-definitions.model';
import { SubmissionSectionModel } from './models/config-submission-section.model';
import { SubmissionDefinitionsConfigDataService } from './submission-definitions-config-data.service';

describe('SubmissionDefinitionsConfigDataService', () => {
  let service: SubmissionDefinitionsConfigDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let halService: any;

  const sectionsHref = 'https://rest.api/config/submissiondefinitions/traditional/sections';

  const makeSection = (id: string): SubmissionSectionModel => ({
    sectionType: 'submission-form',
    _links: {
      self: { href: `https://rest.api/config/submissionsections/${id}` },
      config: { href: `https://rest.api/config/submissionforms/${id}` },
    },
  } as any);

  const makeDefinition = (withSectionsLink = true): SubmissionDefinitionsModel => ({
    name: 'traditional',
    _links: {
      self: { href: 'https://rest.api/config/submissiondefinitions/traditional' },
      collections: { href: 'https://rest.api/config/submissiondefinitions/traditional/collections' },
      ...(withSectionsLink ? { sections: { href: sectionsHref } } : {}),
    },
  } as any);

  /**
   * Build a page of sections. When `nextHref` is provided it is exposed as the `next` HAL link so
   * {@link SubmissionDefinitionsConfigDataService.findAllSections} keeps following pages.
   */
  const makePage = (sections: SubmissionSectionModel[], nextHref?: string) => {
    const pageInfo = new PageInfo({
      elementsPerPage: sections.length,
      totalElements: sections.length,
      totalPages: 1,
      currentPage: 0,
    });
    const links = isNotEmpty(nextHref) ? { next: { href: nextHref } } : undefined;
    return buildPaginatedList(pageInfo, sections, false, links);
  };

  beforeEach(() => {
    requestService = getMockRequestService();
    rdbService = getMockRemoteDataBuildService();
    halService = new HALEndpointServiceStub('https://rest.api/config');
    service = new SubmissionDefinitionsConfigDataService(requestService, rdbService, null, halService);
  });

  describe('findAllSections', () => {
    it('should emit undefined when the sections link is missing (old backend)', (done) => {
      const spy = spyOn(ConfigDataService.prototype, 'findListByHref');

      service.findAllSections(makeDefinition(false)).subscribe((rd) => {
        expect(rd).toBeUndefined();
        expect(spy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should follow the sections link and return a single page unchanged when there is only one page', (done) => {
      const sections = [makeSection('pageOne'), makeSection('pageTwo')];
      const page = makePage(sections);
      spyOn(ConfigDataService.prototype, 'findListByHref').and.returnValue(createSuccessfulRemoteDataObject$(page) as any);

      service.findAllSections(makeDefinition()).subscribe((rd) => {
        expect(rd.hasSucceeded).toBeTrue();
        expect(rd.payload.page.length).toBe(2);
        done();
      });
    });

    it('should fetch ALL pages and aggregate them into a single list', (done) => {
      const firstPageSections = [makeSection('s1'), makeSection('s2')];
      const secondPageSections = [makeSection('s21'), makeSection('s22')];
      const secondPageHref = `${sectionsHref}?page=1`;
      const firstPage = makePage(firstPageSections, secondPageHref);
      const secondPage = makePage(secondPageSections);

      const spy = spyOn(ConfigDataService.prototype, 'findListByHref').and.returnValues(
        createSuccessfulRemoteDataObject$(firstPage) as any,
        createSuccessfulRemoteDataObject$(secondPage) as any,
      );

      service.findAllSections(makeDefinition()).subscribe((rd) => {
        expect(spy).toHaveBeenCalledTimes(2);
        // The second call must follow the `next` link href from the first page.
        expect(spy.calls.argsFor(1)[0]).toBe(secondPageHref);
        expect(rd.hasSucceeded).toBeTrue();
        expect(rd.payload.page.length).toBe(4);
        expect(rd.payload.page.map((s) => s._links.self.href)).toEqual([
          'https://rest.api/config/submissionsections/s1',
          'https://rest.api/config/submissionsections/s2',
          'https://rest.api/config/submissionsections/s21',
          'https://rest.api/config/submissionsections/s22',
        ]);
        done();
      });
    });

    it('should stop paging as soon as a page has no next link', (done) => {
      const firstPage = makePage([makeSection('a1')]);

      const spy = spyOn(ConfigDataService.prototype, 'findListByHref').and.returnValue(
        createSuccessfulRemoteDataObject$(firstPage) as any,
      );

      service.findAllSections(makeDefinition()).subscribe((rd) => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(rd.payload.page.length).toBe(1);
        done();
      });
    });

    it('should return a failed RemoteData when the first page fails', (done) => {
      spyOn(ConfigDataService.prototype, 'findListByHref').and.returnValue(createFailedRemoteDataObject$('error', 500) as any);

      service.findAllSections(makeDefinition()).subscribe((rd) => {
        expect(rd.hasFailed).toBeTrue();
        done();
      });
    });

    it('should convert a thrown error (as ConfigDataService does on failure) into a failed RemoteData', (done) => {
      // ConfigDataService.findListByHref throws inside the observable stream on failure.
      spyOn(ConfigDataService.prototype, 'findListByHref').and.returnValue(
        throwError(() => new Error('Couldn\'t retrieve the config')) as any,
      );

      service.findAllSections(makeDefinition()).subscribe((rd) => {
        expect(rd.hasFailed).toBeTrue();
        done();
      });
    });

    it('should return the failed RemoteData when a later page fails', (done) => {
      const firstPageSections = [makeSection('b1')];
      const firstPage = makePage(firstPageSections, `${sectionsHref}?page=1`);

      spyOn(ConfigDataService.prototype, 'findListByHref').and.returnValues(
        createSuccessfulRemoteDataObject$(firstPage) as any,
        createFailedRemoteDataObject$('error', 500) as any,
      );

      service.findAllSections(makeDefinition()).subscribe((rd) => {
        expect(rd.hasFailed).toBeTrue();
        done();
      });
    });
  });
});
