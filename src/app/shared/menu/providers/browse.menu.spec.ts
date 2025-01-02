/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { BrowseMenuProvider } from './browse.menu';
import { MenuItemType } from '../menu-item-type.model';
import { MenuSubSection, MenuTopSection } from './expandable-menu-provider';
import { BrowseService } from '../../../core/browse/browse.service';
import { BrowseServiceStub } from '../../testing/browse-service.stub';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { getMockObjectCacheService } from '../../mocks/object-cache.service.mock';
import { BrowseDefinition } from '../../../core/shared/browse-definition.model';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';

const expectedTopSection: MenuTopSection = {
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.browse_global',
    },
    icon: 'globe',
  };

const expectedSubSections: MenuSubSection[] = [
  {
    visible: true,
    model: {
      type: MenuItemType.LINK,
      text: 'menu.section.browse_global_by_author',
      link: '/browse/author',
    },
  },
  {
    visible: true,
    model: {
      type: MenuItemType.LINK,
      text: 'menu.section.browse_global_by_subject',
      link: '/browse/subject',
    },
  },
];

describe('BrowseMenuProvider', () => {
  let provider: BrowseMenuProvider;
  let browseServiceStub = new BrowseServiceStub();

  beforeEach(() => {
    spyOn(browseServiceStub, 'getBrowseDefinitions').and.returnValue(
      createSuccessfulRemoteDataObject$(createPaginatedList([
        { id: 'author' } as BrowseDefinition,
        { id: 'subject' } as BrowseDefinition,
      ]))
    );

    TestBed.configureTestingModule({
      providers: [
        BrowseMenuProvider,
        { provide: BrowseService, useValue: browseServiceStub },
        { provide: ObjectCacheService, useValue: getMockObjectCacheService() },
      ],
    });
    provider = TestBed.inject(BrowseMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getTopSection should return expected menu section', (done) => {
    provider.getTopSection().subscribe((section) => {
      expect(section).toEqual(expectedTopSection);
      done();
    });
  });

  it('getSubSections should return expected menu sections', (done) => {
    provider.getSubSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSubSections);
      done();
    });
  });
});
