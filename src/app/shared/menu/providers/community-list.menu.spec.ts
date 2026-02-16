/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { CommunityListMenuProvider } from './community-list.menu';

describe('CommunityListMenuProvider', () => {
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

  let provider: CommunityListMenuProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommunityListMenuProvider,
      ],
    });
    provider = TestBed.inject(CommunityListMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getSections should return expected menu sections', (done) => {
    provider.getSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSections);
      done();
    });
  });
});
