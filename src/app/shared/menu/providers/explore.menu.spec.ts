/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { SectionDataService } from '@dspace/core/data/section-data.service';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { ExploreMenuProvider } from './explore.menu';

describe('ExploreMenuProvider', () => {

  let provider: ExploreMenuProvider;
  let sectionDataServiceStub: any;

  const mockSections = [
    { id: 'publications', componentRows: [], nestedSections: [] },
    { id: 'researchers', componentRows: [], nestedSections: [] },
  ];

  function configureTestingModule(enableExplorePages: boolean) {
    sectionDataServiceStub = {
      findVisibleSections: jasmine.createSpy('findVisibleSections').and.returnValue(
        createSuccessfulRemoteDataObject$(createPaginatedList(mockSections)),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        ExploreMenuProvider,
        { provide: APP_CONFIG, useValue: { layout: { enableExplorePages } } },
        { provide: SectionDataService, useValue: sectionDataServiceStub },
      ],
    });
    provider = TestBed.inject(ExploreMenuProvider);
  }

  describe('when enableExplorePages is true', () => {
    beforeEach(() => {
      configureTestingModule(true);
    });

    it('should be created', () => {
      expect(provider).toBeTruthy();
    });

    it('should call findVisibleSections on the SectionDataService', (done) => {
      provider.getSections().subscribe(() => {
        expect(sectionDataServiceStub.findVisibleSections).toHaveBeenCalled();
        done();
      });
    });

    it('should return menu sections for each visible section', (done) => {
      const expectedSections: PartialMenuSection[] = [
        {
          visible: true,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.explore_publications',
            link: '/explore/publications',
          },
        },
        {
          visible: true,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.explore_researchers',
            link: '/explore/researchers',
          },
        },
      ];

      provider.getSections().subscribe((sections) => {
        expect(sections).toEqual(expectedSections);
        done();
      });
    });
  });

  describe('when enableExplorePages is false', () => {
    beforeEach(() => {
      configureTestingModule(false);
    });

    it('should be created', () => {
      expect(provider).toBeTruthy();
    });

    it('should return an empty array', (done) => {
      provider.getSections().subscribe((sections) => {
        expect(sections).toEqual([]);
        done();
      });
    });

    it('should not call findVisibleSections on the SectionDataService', (done) => {
      provider.getSections().subscribe(() => {
        expect(sectionDataServiceStub.findVisibleSections).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
