import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SignpostingDataService } from '../../../core/data/signposting-data.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { signpostingLinksResolver } from './signposting-links.resolver';
import { ItemDataService } from '../../../core/data/item-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { Item } from '../../../core/shared/item.model';
import { MetadataMap } from '../../../core/shared/metadata.models';

describe('signpostingLinksResolver', () => {
  let resolver: any;
  let route: ActivatedRouteSnapshot;
  let state = {};
  let itemDataService: ItemDataService;
  let signpostingDataService: SignpostingDataService;
  const testUuid = '1234567890';
  const mocklink = {
    href: 'http://test.org',
    rel: 'rel1',
    type: 'type1'
  };
  const mocklink2 = {
    href: 'http://test2.org',
    rel: 'rel2',
    type: undefined
  };
  const resolvedLinks = `<${mocklink.href}> ; rel="${mocklink.rel}" ; type="${mocklink.type}" , <${mocklink2.href}> ; rel="${mocklink2.rel}" `;
  const mockTag2 = {
    href: 'http://test2.org',
    rel: 'rel2',
  };
  const mockItem = Object.assign(new Item(), {
    uuid: testUuid,
    metadata: new MetadataMap()
  });
  function init() {
    route = Object.assign(new ActivatedRouteSnapshot(), {
      params: {
        id: testUuid,
      },
    });
    itemDataService = jasmine.createSpyObj('itemDataService', {
      findById: createSuccessfulRemoteDataObject$(mockItem)
    });
    signpostingDataService = jasmine.createSpyObj('signpostingDataService', {
      getLinks: of([mocklink, mocklink2]),
      setLinks: () => null,
    });
    resolver = signpostingLinksResolver;
  }
  function initTestbed() {
    TestBed.configureTestingModule({
      providers: [
        {provide: RouterStateSnapshot, useValue: state},
        {provide: ActivatedRouteSnapshot, useValue: route},
        {provide: ItemDataService, useValue: itemDataService},
        {provide: SignpostingDataService, useValue: signpostingDataService},
      ]
    });
  }
  describe('when an item page is loaded', () => {
    beforeEach(() => {
      init();
      initTestbed();
    });
    it('should retrieve links and set header and head tags', () => {
      TestBed.runInInjectionContext(() => {
        resolver(route, state).subscribe(() => {
          expect(signpostingDataService.getLinks).toHaveBeenCalledWith(testUuid);
        });
      });
    });
  });
});
