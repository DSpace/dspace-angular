/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { BrowseService } from '../../../core/browse/browse.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { BrowseDefinition } from '../../../core/shared/browse-definition.model';
import { getMockObjectCacheService } from '../../mocks/object-cache.service.mock';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { BrowseServiceStub } from '../../testing/browse-service.stub';
import { createPaginatedList } from '../../testing/utils.test';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { BrowseMenuProvider } from './browse.menu';

describe('BrowseMenuProvider', () => {

  const expectedTopSection: PartialMenuSection = {
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.browse_global',
    },
    icon: 'globe',
  };

  const expectedSubSections: (enableMapLink: boolean) => PartialMenuSection[] = (enableMapLink) => [
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
    {
      visible: enableMapLink,
      model: {
        type: MenuItemType.LINK,
        text: `menu.section.browse_global_geospatial_map`,
        link: `/browse/map`,
      },
    },
  ];


  let provider: BrowseMenuProvider;
  let browseServiceStub = BrowseServiceStub;

  beforeEach(() => {
    spyOn(browseServiceStub, 'getBrowseDefinitions').and.returnValue(
      createSuccessfulRemoteDataObject$(createPaginatedList([
        { id: 'author' } as BrowseDefinition,
        { id: 'subject' } as BrowseDefinition,
      ])),
    );

    TestBed.configureTestingModule({
      providers: [
        BrowseMenuProvider,
        { provide: BrowseService, useValue: browseServiceStub },
        { provide: ObjectCacheService, useValue: getMockObjectCacheService() },
        { provide: APP_CONFIG, useValue: { geospatialMapViewer: { enableBrowseMap: true } } as AppConfig },
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
      expect(sections).toEqual(expectedSubSections(true));
      done();
    });
  });

  it('getSubSections should return expected menu sections', (done) => {
    TestBed.inject(APP_CONFIG).geospatialMapViewer.enableBrowseMap = false;
    provider.getSubSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSubSections(false));
      done();
    });
  });
});
