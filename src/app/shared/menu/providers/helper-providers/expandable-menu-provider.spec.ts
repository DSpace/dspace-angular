/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import {
  Observable,
  of,
} from 'rxjs';

import { MenuID } from '../../menu-id.model';
import { MenuItemType } from '../../menu-item-type.model';
import { PartialMenuSection } from '../../menu-provider.model';
import { AbstractExpandableMenuProvider } from './expandable-menu-provider';

describe('AbstractExpandableMenuProvider', () => {
  const topSection: PartialMenuSection = {
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'top.section.test',
    },
    icon: 'file-import',
  };

  const subSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'sub.section.test.1',
      },
    },
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'sub.section.test.2',
      },
    },
  ];

  class TestClass extends AbstractExpandableMenuProvider {
    getTopSection(): Observable<PartialMenuSection> {
      return of(topSection);
    }

    getSubSections(): Observable<PartialMenuSection[]> {
      return of(subSections);
    }

  }

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'sub.section.test.1',
      },
      id: `${MenuID.ADMIN}_1_0_0`,
      parentID: `${MenuID.ADMIN}_1_0`,
      alwaysRenderExpandable: false,
    },
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'sub.section.test.2',
      },
      id: `${MenuID.ADMIN}_1_0_1`,
      parentID: `${MenuID.ADMIN}_1_0`,
      alwaysRenderExpandable: false,
    },
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'top.section.test',
      },
      icon: 'file-import',
      id: `${MenuID.ADMIN}_1_0`,
      alwaysRenderExpandable: true,
    },
  ];

  let provider: AbstractExpandableMenuProvider;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        TestClass,
      ],
    });
    provider = TestBed.inject(TestClass);
    provider.menuProviderId = `${MenuID.ADMIN}_1`;
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getSections should return a combination of top and sub sections', (done) => {

    provider.getSections().subscribe((section) => {
      expect(section).toEqual(expectedSections);
      done();
    });
  });

});
