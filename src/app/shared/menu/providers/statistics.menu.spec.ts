import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Item } from '../../../core/shared/item.model';
import { ITEM } from '../../../core/shared/item.resource-type';
import { createSuccessfulRemoteDataObject } from '../../remote-data.utils';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { StatisticsMenuProvider } from './statistics.menu';

describe('StatisticsMenuProvider', () => {

  const expectedSectionsNoDSO: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.statistics',
        link: `statistics`,
      },
      icon: 'chart-line',
    },
  ];

  const expectedSectionsForItem: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.statistics',
        link: `statistics/items/test-item-uuid`,
      },
      icon: 'chart-line',
    },
  ];

  const expectedSectionsForItemInvisible: PartialMenuSection[] = [
    {
      visible: false,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.statistics',
        link: `statistics/items/test-item-uuid`,
      },
      icon: 'chart-line',
    },
  ];

  let provider: StatisticsMenuProvider;

  const item: Item = Object.assign(new Item(), {
    uuid: 'test-item-uuid',
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Untyped Item',
      }],
    },
  });

  const item2: Item = Object.assign(new Item(), {
    uuid: 'test-item2-uuid',
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Untyped Item 2',
      }],
    },
  });
  let authorizationService: AuthorizationDataService;

  beforeEach(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        StatisticsMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
      ],
    });
    provider = TestBed.inject(StatisticsMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the general statistics link when no DSO is provided', (done) => {
      provider.getSectionsForContext(undefined).subscribe((sections) => {
        expect(sections).toEqual(expectedSectionsNoDSO);
        done();
      });
    });
    it('should return a statistics link to the DSO when a DSO is provided', (done) => {
      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedSectionsForItem);
        done();
      });
    });
    it('should not return anything if not authorized to view statistics', (done) => {
      (TestBed.inject(AuthorizationDataService) as any).isAuthorized.and.returnValue(of(false));
      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedSectionsForItemInvisible);
        done();
      });
    });
  });

  describe('getRouteContext', () => {
    it('should get the dso from the route', (done) => {
      const route = { data: { dso: createSuccessfulRemoteDataObject(item) } } as any;

      provider.getRouteContext(route, undefined).subscribe((dso) => {
        expect(dso).toEqual(item);
        done();
      });
    });
    it('should get the dso from first parent route with a dso when the route itself has none', (done) => {
      const route = {
        data: {},
        parent: {
          data: {},
          parent: {
            data: { dso: createSuccessfulRemoteDataObject(item) },
            parent: { data: { dso: createSuccessfulRemoteDataObject(item2) } },
          },
        },
      } as any;

      provider.getRouteContext(route, undefined).subscribe((dso) => {
        expect(dso).toEqual(item);
        expect(dso).not.toEqual(item2);
        done();
      });
    });
    it('should return undefined when no dso is found in the route', (done) => {
      const route = { data: {}, parent: { data: {}, parent: { data: {}, parent: { data: {} } } } } as any;

      provider.getRouteContext(route, undefined).subscribe((dso) => {
        expect(dso).toBeUndefined();
        done();
      });
    });
  });

});
