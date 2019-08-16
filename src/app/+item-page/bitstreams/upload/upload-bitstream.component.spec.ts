import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from '../../../core/data/item-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UploadBitstreamComponent } from './upload-bitstream.component';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../shared/testing/auth-service-stub';
import { Item } from '../../../core/shared/item.model';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject } from '../../../shared/testing/utils';
import { RouterStub } from '../../../shared/testing/router-stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { VarDirective } from '../../../shared/utils/var.directive';
import { Bitstream } from '../../../core/shared/bitstream.model';

describe('UploadBistreamComponent', () => {
  let comp: UploadBitstreamComponent;
  let fixture: ComponentFixture<UploadBitstreamComponent>;

  const itemName = 'fake-name';
  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: itemName
        }
      ]
    }
  });
  let routeStub;
  const routerStub = new RouterStub();
  const restEndpoint = 'fake-rest-endpoint';
  const mockItemDataService = jasmine.createSpyObj('mockItemDataService', {
    getBitstreamsEndpoint: observableOf(restEndpoint)
  });
  const authToken = 'fake-auth-token';
  const authServiceStub = Object.assign(new AuthServiceStub(), {
    buildAuthHeader: () => authToken
  });
  const notificationsServiceStub = new NotificationsServiceStub();

  describe('when queryParam bundleName is missing', () => {
    beforeEach(async(() => {
      createUploadBitstreamTestingModule({});
    }));

    beforeEach(() => {
      loadFixtureAndComp();
    });

    it('uploadProperties.bundleName should default to "ORIGINAL"', () => {
      expect(comp.uploadProperties.bundleName).toEqual('ORIGINAL');
    });
  });

  describe('when queryParam bundleName has a value', () => {
    const customBundleName = 'FAKE-BUNDLE';

    beforeEach(async(() => {
      createUploadBitstreamTestingModule({
        bundleName: customBundleName
      });
    }));

    beforeEach(() => {
      loadFixtureAndComp();
    });

    it('uploadProperties.bundleName should be set to the custom bundle name', () => {
      expect(comp.uploadProperties.bundleName).toEqual(customBundleName);
    });
  });

  describe('when a file is uploaded', () => {
    beforeEach(async(() => {
      createUploadBitstreamTestingModule({});
    }));

    beforeEach(() => {
      loadFixtureAndComp();
    });

    describe('and it fails, calling onUploadError', () => {
      beforeEach(() => {
        comp.onUploadError();
      });

      it('should display an error notification', () => {
        expect(notificationsServiceStub.error).toHaveBeenCalled();
      });
    });

    describe('and it succeeds, calling onCompleteItem', () => {
      const createdBitstream = Object.assign(new Bitstream(), {
        id: 'fake-bitstream'
      });

      beforeEach(() => {
        comp.onCompleteItem(createdBitstream);
      });

      it('should navigate the user to the next page', () => {
        expect(routerStub.navigate).toHaveBeenCalled();
      });
    });
  });

  /**
   * Setup an UploadBitstreamComponent testing module with custom queryParams for the route
   * @param queryParams
   */
  function createUploadBitstreamTestingModule(queryParams) {
    routeStub = {
      data: observableOf({
        item: createSuccessfulRemoteDataObject(mockItem)
      }),
      queryParams: observableOf(queryParams)
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [UploadBitstreamComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }

  /**
   * Load the TestBed's fixture and component
   */
  function loadFixtureAndComp() {
    fixture = TestBed.createComponent(UploadBitstreamComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }

});
