/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';

import { CacheableObject } from '../../../../core/cache/cacheable-object.model';
import { MenuID } from '../../menu-id.model';
import { MenuItemType } from '../../menu-item-type.model';
import { PartialMenuSection } from '../../menu-provider.model';
import { AbstractRouteContextMenuProvider } from './route-context.menu';

describe('AbstractRouteContextMenuProvider', () => {

  class TestClass extends AbstractRouteContextMenuProvider<CacheableObject> {
    getRouteContext(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CacheableObject> {
      return of(object);
    }

    getSectionsForContext(routeContext: CacheableObject): Observable<PartialMenuSection[]> {
      return of(expectedSections);
    }
  }

  const object = Object.assign(new CacheableObject());


  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'sub.section.test.1',
      },
      id: `${MenuID.ADMIN}_1_0`,
      parentID: `${MenuID.ADMIN}_1`,
      alwaysRenderExpandable: false,
    },
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'sub.section.test.2',
      },
      id: `${MenuID.ADMIN}_1_1`,
      parentID: `${MenuID.ADMIN}_1`,
      alwaysRenderExpandable: false,
    },
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'top.section.test',
      },
      icon: 'file-import',
      id: `${MenuID.ADMIN}_1`,
      alwaysRenderExpandable: true,
    },
  ];

  let provider: AbstractRouteContextMenuProvider<CacheableObject>;

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

  it('getSections should return the sections based on the retrieved route context and sections for that context', (done) => {
    spyOn(provider, 'getRouteContext').and.callThrough();
    spyOn(provider, 'getSectionsForContext').and.callThrough();

    provider.getSections(undefined, undefined).subscribe((sections) => {
      expect(sections).toEqual(expectedSections);
      expect(provider.getRouteContext).toHaveBeenCalled();
      expect(provider.getSectionsForContext).toHaveBeenCalledWith(object);
      done();
    });
  });

});
