import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { Item } from '../../../core/shared/item.model';
import { MetadataValueFilter } from '../../../core/shared/metadata.models';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { Bundle } from '../../../core/shared/bundle.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { hasNoValue } from '../../../shared/empty.util';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnnotationUploadComponent } from './annotation-upload.component';
import { UploaderComponent } from '../../../shared/upload/uploader/uploader.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { INotification, Notification } from '../../../shared/notifications/models/notification.model';
import { NotificationType } from '../../../shared/notifications/models/notification-type';
import { AuthService } from '../../../core/auth/auth.service';
import { RequestService } from '../../../core/data/request.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { UploadModule } from '../../../shared/upload/upload.module';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { CookieService } from '../../../core/services/cookie.service';
import { CookieServiceMock } from '../../../shared/mocks/cookie.service.mock';
import { DragService } from '../../../core/drag.service';
import { HttpXsrfTokenExtractorMock } from '../../../shared/mocks/http-xsrf-token-extractor.mock';


const ANNOTATION_BUNDLE = 'ANNOTATIONS';
const DEFAULT_BUNDLE = 'ORIGINAL';
const itemId = '457b8437-74a5-6516-91ca-90863e50eo09';
let comp: AnnotationUploadComponent;
let fixture: ComponentFixture<AnnotationUploadComponent>;
let notificationsService: NotificationsService;
const restBundleEndpoint = 'fake-rest-bundle-endpoint';
const dummyAnnotationBistreamId = 'be7b8430-77a5-4016-91c9-90863e50583a';
const dummyParentBistreamId = 'c97b8430-77a5-r416-91c9-90863e50779b';
const annotationHref = 'https://host/server/api/core/bitstreams/b2e89212-ecad-4768-9cd8-6dada882c0f2';
const annotationContent = 'https://host/server/api/core/bitstreams/b2e89212-ecad-4768-9cd8-6dada882c0f2/content';

const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');

function getMockItem(bundle: Bundle, bitstreamId: string) {
  return (Object.assign(new Item(), {
    uuid: itemId,
    id: itemId,
    firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
      return undefined;
    },
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([
      Object.assign(new Bundle(), {
        uuid: 'bundle-uuid',
        name: bundle,
        firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
          return undefined;
        },
        bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList(createBitstreamList(bitstreamId)))
      })
    ]))
  }));
}

function getMockBundle(bundleName: string, bitstreamId: string) {
  return Object.assign(new Bundle(), {
    uuid: 'bundle-uuid',
    name: bundleName,
    firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
      return undefined;
    },
    bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList(createBitstreamList(bitstreamId)))
  });
}

function createBitstreamList(bitstreamId: string) {
  if (hasNoValue(bitstreamId)) {
    return [];
  }
  return [
    getBitstream(bitstreamId)
  ];
}

function getBitstream(bitstreamId: string) {
  return Object.assign(new Bitstream(),
    {
      sizeBytes: 10201,
      content: 'https://host/server/api/core/bitstreams/b2e89212-ecad-4768-9cd8-6dada882c0f2/content',
      bundleName: 'ANNOTATIONS',
      _links: {
        self: {
          href: annotationHref
        },
        content: {
          href: annotationContent
        }
      },
      id: bitstreamId,
      uuid: bitstreamId,
      type: 'bitstream',
      firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
        return bitstreamId + '.json';
      },
      metadata: {
        'dc.title': [
          {
            language: null,
            value: bitstreamId + '.json'
          }
        ]
      }
    });
}

const bundleService = jasmine.createSpyObj('bundleService', {
  getBitstreamsEndpoint: observableOf(restBundleEndpoint)
});

const bitstreamService = jasmine.createSpyObj('bitstreamService', {
  delete: jasmine.createSpy('delete')
});
const authService = jasmine.createSpyObj('authService', {
  buildAuthHeader: jasmine.createSpy('buildAuthHeader').and.returnValue('fake-endpoint')
});
const objectCache = jasmine.createSpyObj('objectCache', {
  remove: jasmine.createSpy('remove')
});
const requestService =  jasmine.createSpyObj('requestService', {
  setStaleByHrefSubstring: jasmine.createSpy('setStaleByHrefSubstring')
});
const itemService = jasmine.createSpyObj({
  createBundle: createSuccessfulRemoteDataObject$(getMockBundle(ANNOTATION_BUNDLE, itemId))
});
const objectUpdateService = jasmine.createSpyObj('objectUpdateService', {
  getFieldUpdates: jasmine.createSpy('getFieldUpdates')
});
describe('AnnotationUploadComponent', () => {

    beforeEach(waitForAsync(() => {
      notificationsService = jasmine.createSpyObj('notificationsService',
        {
          info: infoNotification,
          warning: warningNotification,
          success: successNotification
        }
      );

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(),
          RouterTestingModule,
          UploadModule],
        declarations: [
          AnnotationUploadComponent,
          UploaderComponent
        ],
        providers: [
          { provide: ItemDataService, useValue: itemService },
          { provide: BitstreamDataService, useValue: bitstreamService },
          { provide: AuthService, useValue: authService },
          { provide: ObjectCacheService, useValue: objectCache },
          { provide: ObjectUpdatesService, useValue: objectUpdateService },
          { provide: BundleDataService, useValue: bundleService },
          { provide: RequestService, useValue: requestService },
          { provide: NotificationsService, useValue: notificationsService },
          { provide: CookieService, useValue: new CookieServiceMock() },
          { provide: HttpXsrfTokenExtractor, useValue: new HttpXsrfTokenExtractorMock('mock-token') },
          UploaderComponent,
          DragService,
          ScrollToService,
          ChangeDetectorRef
        ]
      })
        .compileComponents();

    }));

    describe('with existing annotation file for the image', () => {

      beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(AnnotationUploadComponent);
        comp = fixture.componentInstance;
        comp.annotationBundle = getMockBundle(ANNOTATION_BUNDLE, dummyParentBistreamId);
        comp.item = getMockItem(getMockBundle(ANNOTATION_BUNDLE, dummyAnnotationBistreamId), dummyParentBistreamId);
        comp.annotationFile = getBitstream(dummyParentBistreamId);
        comp.annotationFileTitle = dummyParentBistreamId + '.json';
        fixture.detectChanges();
      }));

      it('should create component and set properties', () => {
        expect(comp).toBeTruthy();
        expect(comp.bitstreamDownload).toEqual(annotationContent);
        expect(comp.showUploaderComponent).toBeFalse();
        expect(comp.activeDeleteStatus).toBeFalse();
      });

      it('should set the bundle href for uploader', () => {
        expect(comp.uploadFilesOptions.url).toEqual(restBundleEndpoint);
      });

      it('should show delete option and file title', () => {
        const btn = fixture.debugElement.nativeElement.querySelector('.fa-trash-alt');
        expect(btn).toBeDefined();
        const title = fixture.debugElement.nativeElement.querySelector('.file-title');
        expect(title).toBeDefined();
        expect(title.innerText).toEqual(comp.annotationFileTitle);
        expect(title.getAttribute('href')).toEqual(comp.bitstreamDownload);
      });

      it('should show the delete buttons', () => {
        const btn = fixture.debugElement.nativeElement.querySelector('.fa-trash-alt');
        expect(btn).toBeDefined();
        btn.click();
        fixture.whenStable().then(() => {
          const deleteBtn = fixture.debugElement.nativeElement.querySelector('.delete-button');
          const cancelBtn = fixture.debugElement.nativeElement.querySelector('.cancel-button');
          expect(deleteBtn).toBeDefined();
          expect(cancelBtn).toBeDefined();
        });
      });
    });

  describe('with missing annotation file', () => {

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(AnnotationUploadComponent);
      comp = fixture.componentInstance;
      comp.annotationBundle = getMockBundle(ANNOTATION_BUNDLE, dummyParentBistreamId);
      comp.item = getMockItem(getMockBundle(ANNOTATION_BUNDLE, dummyAnnotationBistreamId), dummyParentBistreamId);
      fixture.detectChanges();
    }));

    it('should create component and set properties', () => {
      expect(comp).toBeTruthy();
      expect(comp.bitstreamDownload).not.toBeDefined();
      expect(comp.showUploaderComponent).toBeTrue();
      expect(comp.activeDeleteStatus).toBeFalse();
    });
  });

  describe('with missing annotation bundle', () => {

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(AnnotationUploadComponent);
      comp = fixture.componentInstance;
      comp.item = getMockItem(getMockBundle(DEFAULT_BUNDLE, dummyAnnotationBistreamId), dummyParentBistreamId);
      fixture.detectChanges();
    }));

    it('should create bundle', () => {
      expect(comp).toBeTruthy();
      expect(itemService.createBundle).toHaveBeenCalled();
      expect(comp.annotationBundle).toBeDefined();
    });

    it('should set the bundle href for uploader', () => {
      expect(comp.uploadFilesOptions.url).toEqual(restBundleEndpoint);
    });
  });
});
