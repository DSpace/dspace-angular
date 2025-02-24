import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  Bitstream,
  Bundle,
  createPaginatedList,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
  createTestComponent,
  getMockLinkService,
  Item,
  LinkService,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { AlertComponent } from '../../../shared/alert/alert.component';
import { ResourcePoliciesComponent } from '../../../shared/resource-policies/resource-policies.component';
import { ItemAuthorizationsComponent } from './item-authorizations.component';

describe('ItemAuthorizationsComponent test suite', () => {
  let comp: ItemAuthorizationsComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<ItemAuthorizationsComponent>;
  let de;

  const linkService: any = getMockLinkService();

  const bitstream1 = Object.assign(new Bitstream(), {
    id: 'bitstream1',
    uuid: 'bitstream1',
  });
  const bitstream2 = Object.assign(new Bitstream(), {
    id: 'bitstream2',
    uuid: 'bitstream2',
  });
  const bitstream3 = Object.assign(new Bitstream(), {
    id: 'bitstream3',
    uuid: 'bitstream3',
  });
  const bitstream4 = Object.assign(new Bitstream(), {
    id: 'bitstream4',
    uuid: 'bitstream4',
  });
  const bundle1 = Object.assign(new Bundle(), {
    id: 'bundle1',
    uuid: 'bundle1',
    _links: {
      self: { href: 'bundle1-selflink' },
    },
    bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1, bitstream2])),
  });
  const bundle2 = Object.assign(new Bundle(), {
    id: 'bundle2',
    uuid: 'bundle2',
    _links: {
      self: { href: 'bundle2-selflink' },
    },
    bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList([bitstream3, bitstream4])),
  });
  const bundles = [bundle1, bundle2];

  const item = Object.assign(new Item(), {
    uuid: 'item',
    id: 'item',
    _links: {
      self: { href: 'item-selflink' },
    },
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([bundle1, bundle2])),
  });

  const routeStub = {
    data: observableOf({
      dso: createSuccessfulRemoteDataObject(item),
    }),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ItemAuthorizationsComponent,
        TestComponent,
      ],
      providers: [
        { provide: LinkService, useValue: linkService },
        { provide: ActivatedRoute, useValue: routeStub },
        ItemAuthorizationsComponent,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .overrideComponent(ItemAuthorizationsComponent, {
        remove: { imports: [
          ResourcePoliciesComponent,
          AlertComponent,
        ] },
      })
      .compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-item-authorizations></ds-item-authorizations>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create ItemAuthorizationsComponent', inject([ItemAuthorizationsComponent], (app: ItemAuthorizationsComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemAuthorizationsComponent);
      comp = fixture.componentInstance;
      compAsAny = fixture.componentInstance;
      linkService.resolveLink.and.callFake((object, link) => object);
      fixture.detectChanges();
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      de = null;
      fixture.destroy();
    });

    it('should init bundles and bitstreams map  properly', () => {
      expect(compAsAny.subs.length).toBe(2);
      expect(compAsAny.bundles$.value).toEqual(bundles);
      expect(compAsAny.bundleBitstreamsMap.has('bundle1')).toBeTruthy();
      expect(compAsAny.bundleBitstreamsMap.has('bundle2')).toBeTruthy();
      let bitstreamList = compAsAny.bundleBitstreamsMap.get('bundle1');
      expect(bitstreamList.bitstreams).toBeObservable(cold('(a|)', {
        a : [bitstream1, bitstream2],
      }));
      bitstreamList = compAsAny.bundleBitstreamsMap.get('bundle2');
      expect(bitstreamList.bitstreams).toBeObservable(cold('(a|)', {
        a: [bitstream3, bitstream4],
      }));
    });

    it('should get the item UUID', () => {

      expect(comp.getItemUUID()).toBeObservable(cold('(a|)', {
        a: item.id,
      }));

    });

    it('should get the item\'s bundle', () => {

      expect(comp.getItemBundles()).toBeObservable(cold('a', {
        a: bundles,
      }));

    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
})
class TestComponent {

}
