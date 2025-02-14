import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { getBitstreamModuleRoute } from '../../../../app-routing-paths';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { ItemRequestDataService } from '../../../../core/data/item-request-data.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemRequest } from '../../../../core/shared/item-request.model';
import { URLCombiner } from '../../../../core/url-combiner/url-combiner';
import { createSuccessfulRemoteDataObject } from '../../../../shared/remote-data.utils';
import { RouterLinkDirectiveStub } from '../../../../shared/testing/router-link-directive.stub';
import { getItemModuleRoute } from '../../../item-page-routing-paths';
import { ItemSecureFileDownloadLinkComponent } from './item-secure-file-download-link.component';

describe('FileDownloadLinkComponent', () => {
  let component: ItemSecureFileDownloadLinkComponent;
  let fixture: ComponentFixture<ItemSecureFileDownloadLinkComponent>;

  let authorizationService: AuthorizationDataService;
  let itemRequestDataService: ItemRequestDataService;
  let bitstream: Bitstream;
  let item: Item;
  let itemRequest: ItemRequest;
  let routeStub: any;

  function init() {
    itemRequestDataService = jasmine.createSpyObj('itemRequestDataService', {
      canDownload: observableOf(true),
    });
    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
      _links: {
        self: { href: 'obj-selflink' },
      },
    });
    item = Object.assign(new Item(), {
      uuid: 'itemUuid',
      _links: {
        self: { href: 'obj-selflink' },
      },
    });
    routeStub = {
      data: observableOf({
        dso: createSuccessfulRemoteDataObject(item),
      }),
      children: [],
    };

    itemRequest = Object.assign(new ItemRequest(),
      {
        accessToken: 'accessToken',
        itemId: item.uuid,
        bitstreamId: bitstream.uuid,
        allfiles: false,
        requestEmail: 'user@name.org',
        requestName: 'User Name',
        requestMessage: 'I would like to request a copy',
      });
  }

  function initTestbed() {

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(), ItemSecureFileDownloadLinkComponent,
        RouterLinkDirectiveStub,
      ],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: RouterLinkDirectiveStub },
        { provide: ItemRequestDataService, useValue: itemRequestDataService },
      ],
    }) .compileComponents();
  }

  describe('when the user has download rights AND a valid item access token', () => {
    /**
     * We expect the normal download link to be rendered, whether or not there is a valid item request or request a copy feature
     * available, since the user already has the right to download this file
     */
    beforeEach(waitForAsync(() => {
      init();
      authorizationService = jasmine.createSpyObj('authorizationService', {
        isAuthorized: observableOf(true),
      });
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemSecureFileDownloadLinkComponent);
      component = fixture.componentInstance;
      component.bitstream = bitstream;
      component.item = item;
      component.itemRequest = itemRequest;
      component.enableRequestACopy = true;
      fixture.detectChanges();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
    it('canDownload$ should return true', () => {
      component.canDownload$.subscribe((canDownload) => {
        expect(canDownload).toBe(true);
      });
    });
    it('canDownloadWithToken$ should return true', () => {
      component.canDownloadWithToken$.subscribe((canDownloadWithToken) => {
        expect(canDownloadWithToken).toBe(true);
      });
    });
    it('canRequestACopy$ should return true', () => {
      component.canRequestACopy$.subscribe((canRequestACopy) => {
        expect(canRequestACopy).toBe(true);
      });
    });
    it('should return the bitstreamPath based on the input bitstream', () => {
      component.bitstreamPath$.subscribe((bitstreamPath) => {
        expect(bitstreamPath).toEqual({
          routerLink: new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString(),
          queryParams: {},
        });
      });
    });
  });

  describe('when the user has download rights but no valid item access token', () => {
    /**
     * We expect the normal download link to be rendered, whether or not there is a valid item request or request a copy feature
     * available, since the user already has the right to download this file
     */
    beforeEach(waitForAsync(() => {
      init();
      authorizationService = jasmine.createSpyObj('authorizationService', {
        isAuthorized: observableOf(true),
      });
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemSecureFileDownloadLinkComponent);
      component = fixture.componentInstance;
      component.bitstream = bitstream;
      component.item = item;
      component.itemRequest = null;
      component.enableRequestACopy = true;
      fixture.detectChanges();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
    it('canDownload$ should return true', () => {
      component.canDownload$.subscribe((canDownload) => {
        expect(canDownload).toBe(true);
      });
    });
    it('canDownloadWithToken$ should return false', () => {
      component.canDownloadWithToken$.subscribe((canDownloadWithToken) => {
        expect(canDownloadWithToken).toBe(false);
      });
    });
    it('canRequestACopy$ should return true', () => {
      component.canRequestACopy$.subscribe((canRequestACopy) => {
        expect(canRequestACopy).toBe(true);
      });
    });
    it('should return the bitstreamPath based on the input bitstream', () => {
      component.bitstreamPath$.subscribe((bitstreamPath) => {
        expect(bitstreamPath).toEqual({
          routerLink: new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString(),
          queryParams: {},
        });
      });
    });
  });

  describe('when the user has no download rights but there is a valid access token', () => {
    /**
     * We expect the download-with-token link to be rendered, since we have a valid request but no normal download rights
     */
    beforeEach(waitForAsync(() => {
      init();
      authorizationService = {
        isAuthorized: (featureId: FeatureID) => {
          if (featureId === FeatureID.CanDownload) {
            return observableOf(false);
          }
          return observableOf(true);
        },
      } as AuthorizationDataService;
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemSecureFileDownloadLinkComponent);
      component = fixture.componentInstance;
      component.bitstream = bitstream;
      component.item = item;
      component.itemRequest = itemRequest;
      component.enableRequestACopy = true;
      fixture.detectChanges();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
    it('canDownload$ should return false', () => {
      component.canDownload$.subscribe((canDownload) => {
        expect(canDownload).toBe(false);
      });
    });
    it('canDownloadWithToken$ should return true', () => {
      component.canDownloadWithToken$.subscribe((canDownloadWithToken) => {
        expect(canDownloadWithToken).toBe(true);
      });
    });
    it('canRequestACopy$ should return true', () => {
      component.canRequestACopy$.subscribe((canRequestACopy) => {
        expect(canRequestACopy).toBe(true);
      });
    });
    it('should return the access token path based on the input bitstream', () => {
      component.bitstreamPath$.subscribe((accessTokenPath) => {
        expect(accessTokenPath).toEqual({
          routerLink: new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString(),
          queryParams: {
            accessToken: itemRequest.accessToken,
          },
        });
      });
    });
  });

  describe('when the user has no download rights but has the right to request a copy and there is no valid access token', () => {
    /**
     * We expect the request-a-copy link to be rendered instead of the normal download link or download-by-token link
     */
    beforeEach(waitForAsync(() => {
      init();
      authorizationService = {
        isAuthorized: (featureId: FeatureID) => {
          if (featureId === FeatureID.CanDownload) {
            return observableOf(false);
          }
          return observableOf(true);
        },
      } as AuthorizationDataService;
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemSecureFileDownloadLinkComponent);
      component = fixture.componentInstance;
      component.item = item;
      component.bitstream = bitstream;
      component.itemRequest = null;
      component.enableRequestACopy = true;
      fixture.detectChanges();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
    it('canDownload should be false', () => {
      component.canDownload$.subscribe((canDownload) => {
        expect(canDownload).toBeFalse();
      });
    });
    it('canDownloadWithToken should be false', () => {
      component.canDownloadWithToken$.subscribe((canDownload) => {
        expect(canDownload).toBeFalse();
      });
    });
    it('canRequestACopy should be true', () => {
      component.canRequestACopy$.subscribe((canRequestACopy) => {
        expect(canRequestACopy).toBeTrue();
      });
    });
    it('should return the bitstreamPath based a request-a-copy item + bitstream ID link', () => {
      component.bitstreamPath$.subscribe((bitstreamPath) => {
        expect(bitstreamPath).toEqual({
          routerLink: new URLCombiner(getItemModuleRoute(), item.uuid, 'request-a-copy').toString(),
          queryParams: { bitstream: bitstream.uuid },
        });
      });
    });

  });

  describe('when the user has no download rights and no request a copy rights and there is no valid itemRequest', () => {
    /**
     * We expect a normal download link (which would then be treated as a forbidden and redirect to the login page as per normal)
     */
    beforeEach(waitForAsync(() => {
      init();
      // This mock will return false for both canDownload and canRequestACopy checks
      authorizationService = {
        isAuthorized: (featureId: FeatureID) => {
          return observableOf(false);
        },
      } as AuthorizationDataService;
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemSecureFileDownloadLinkComponent);
      component = fixture.componentInstance;
      component.bitstream = bitstream;
      component.item = item;
      component.itemRequest = null;
      component.enableRequestACopy = false;
      fixture.detectChanges();
    });
    it('should init the component', () => {
      expect(component).toBeTruthy();
    });
    it('canDownload$ should be false', () => {
      component.canDownload$.subscribe((canDownload) => {
        expect(canDownload).toBeFalse();
      });
    });
    it('canDownloadWithToken$ should be false', () => {
      component.canDownloadWithToken$.subscribe((canDownloadWithToken) => {
        expect(canDownloadWithToken).toBeFalse();
      });
    });
    it('canRequestACopy$ should be false', () => {
      component.canRequestACopy$.subscribe((canRequestACopy) => {
        expect(canRequestACopy).toBeFalse();
      });
    });
    it('should return the bitstreamPath based on the input bitstream', () => {
      component.bitstreamPath$.subscribe((bitstreamPath) => {
        expect(bitstreamPath).toEqual({
          routerLink: new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString(),
          queryParams: {},
        });
      });
    });
  });
});

