/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AdminCommunityListMenuProvider } from './admin-community-list.menu';

describe('AdminCommunityListMenuProvider', () => {
  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: `menu.section.browse_global_communities_and_collections`,
        link: `/community-list`,
      },
      icon: 'diagram-project',
    },
  ];

  const createProvider = (showCommunityCollection: boolean): AdminCommunityListMenuProvider => {
    TestBed.configureTestingModule({
      providers: [
        AdminCommunityListMenuProvider,
        { provide: APP_CONFIG, useValue: { layout: { navbar: { showCommunityCollection } } } },
      ],
    });
    return TestBed.inject(AdminCommunityListMenuProvider);
  };

  it('should be created', () => {
    expect(createProvider(true)).toBeTruthy();
  });

  it('getSections should return the community list section when showCommunityCollection is disabled (navbar fallback)', (done) => {
    createProvider(false).getSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSections);
      done();
    });
  });

  it('getSections should return no sections when showCommunityCollection is enabled (shown in navbar instead)', (done) => {
    createProvider(true).getSections().subscribe((sections) => {
      expect(sections).toEqual([]);
      done();
    });
  });
});
