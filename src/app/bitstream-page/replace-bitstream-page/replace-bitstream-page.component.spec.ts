import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { RequestService } from '@dspace/core/data/request.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { Bundle } from '@dspace/core/shared/bundle.model';
import { Item } from '@dspace/core/shared/item.model';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { getMockLinkService } from '@dspace/core/testing/link-service.mock';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { UploaderOptions } from '../../shared/upload/uploader/uploader-options.model';
import { UploaderProperties } from '../../shared/upload/uploader/uploader-properties.model';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { ReplaceBitstreamPageComponent } from './replace-bitstream-page.component';

describe('ReplaceBitstreamPageComponent', () => {
  let component: ReplaceBitstreamPageComponent;
  let fixture: ComponentFixture<ReplaceBitstreamPageComponent>;
  const locationObject = jasmine.createSpyObj('location', ['back']);
  let notificationsService;
  const oldBitstreamSelfLink = 'bitstreams/123';
  const itemSelfLink = 'items/789';
  const item = Object.assign(new Item(), {
    _links: {
      self: { href: itemSelfLink },
    },
  });
  const bundleSelfLink = 'bundles/456';
  const bundle = Object.assign(new Bundle(), {
    _links: {
      self: { href: bundleSelfLink },
    },
    item: createSuccessfulRemoteDataObject$(item),
  });
  const oldBitstream = Object.assign(new Bitstream(), {
    id: '123',
    _links: {
      self: { href: oldBitstreamSelfLink },
      bundle: { href: 'bitstreams/123/bundle' },
    },
    bundle: createSuccessfulRemoteDataObject$(bundle),
  });
  const newBitstream = Object.assign(new Bitstream(), {
    id: '124',
    metadata: {
      ['dspace.bitstream.isReplacementOf']: [
        {
          authority: oldBitstream.id,
        },
      ],
    },
    _links: {
      self: { href: oldBitstreamSelfLink },
      bundle: { href: 'bitstreams/124/bundle' },
    },
    bundle: createSuccessfulRemoteDataObject$(bundle),
  });
  const route = { data: of({ bitstream: createSuccessfulRemoteDataObject(oldBitstream) }) };
  const requestService = jasmine.createSpyObj('requestService', ['setStaleByHrefSubstring']);
  const router = new RouterStub();
  let localeService;
  const languageList = ['en;q=1', 'de;q=0.8'];
  const mockLocaleService = jasmine.createSpyObj('LocaleService', {
    getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode'),
    getLanguageCodeList: of(languageList),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReplaceBitstreamPageComponent,
        TranslateModule.forRoot(),
        FileSizePipe,
      ],
      providers: [
        { provide: Location, useValue: locationObject },
        { provide: ActivatedRoute, useValue: route },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: Router, useValue: router },
        { provide: RequestService, useValue: requestService },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: LinkService, useValue: getMockLinkService() },
      ],
    }).overrideComponent(ReplaceBitstreamPageComponent, {
      remove: { imports: [UploaderComponent] },
      add: { imports: [TestUploaderComponent] },
    }).compileComponents();
  }),
  );

  beforeEach(() => {
    localeService = TestBed.inject(LocaleService);
    localeService.getCurrentLanguageCode.and.returnValue(of('en'));
    fixture = TestBed.createComponent(ReplaceBitstreamPageComponent);
    component = fixture.componentInstance;
    notificationsService = TestBed.inject(NotificationsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clicking back', () => {
    beforeEach(() => {
      spyOn(component, 'back').and.callThrough();
      const backButton = fixture.debugElement.query(By.css('.back-button'));
      backButton.triggerEventHandler('click', {});
    });

    it('should call Location.back', () => {
      expect(component.back).toHaveBeenCalled();
      expect(locationObject.back).toHaveBeenCalled();
    });
  });

  describe('clicking save', () => {
    let uploadComponent: UploaderComponent;
    beforeEach(() => {
      spyOn(component, 'save').and.callThrough();
      const backButton = fixture.debugElement.query(By.css('.save-button'));
      uploadComponent = fixture.debugElement.query(By.directive(TestUploaderComponent)).context;
      backButton.triggerEventHandler('click', {});
    });

    it('should show a notification and upload the bitstreams', () => {
      expect(component.save).toHaveBeenCalled();
      expect(uploadComponent.uploader.uploadAll).toHaveBeenCalled();
    });
  });

  describe('calling onCompleteItem', () => {
    beforeEach(() => {
      component.onCompleteItem(newBitstream);
    });

    it('should set the bitstream and bundle to stale in the cache', () => {
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith(oldBitstream.id);
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith(bundleSelfLink);
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith(itemSelfLink);
    });

    it('should fire a success notification', () => {
      expect(notificationsService.success).toHaveBeenCalled();
    });

    it('should navigate', () => {
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'ds-uploader',
  template: ``,
})
class TestUploaderComponent {
  @Input() dropMsg: string;
  @Input() dropOverDocumentMsg: string;
  @Input() enableDragOverDocument: boolean;
  @Input() onBeforeUpload: () => void;
  @Input() uploadFilesOptions: UploaderOptions;
  @Input() uploadProperties: UploaderProperties;
  @Output() onCompleteItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUploadError: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFileSelected: EventEmitter<any> = new EventEmitter<any>();
  uploader = jasmine.createSpyObj(['uploadAll']);
}
