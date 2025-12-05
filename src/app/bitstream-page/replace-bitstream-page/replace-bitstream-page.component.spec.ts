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
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { UploaderOptions } from '../../shared/upload/uploader/uploader-options.model';
import { UploaderProperties } from '../../shared/upload/uploader/uploader-properties.model';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { ReplaceBitstreamPageComponent } from './replace-bitstream-page.component';

describe('ReplaceBitstreamPageComponent', () => {
  let component: ReplaceBitstreamPageComponent;
  let fixture: ComponentFixture<ReplaceBitstreamPageComponent>;
  const locationObject = jasmine.createSpyObj('location', ['back']);
  let notificationsService;
  const bitstreamSelfLink = 'bitstreams/123';
  const bundleSelfLink = 'bundles/456';
  const bitstream = Object.assign(new Bitstream(), {
    _links: {
      self: { href: bitstreamSelfLink },
      bundle: { href: bundleSelfLink },
    },
  });
  const route = { data: of({ bitstream: createSuccessfulRemoteDataObject(bitstream) }) };
  const requestService = jasmine.createSpyObj('requestService', ['setStaleByHrefSubstring']);
  const router = new RouterStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReplaceBitstreamPageComponent,
        TranslateModule.forRoot(),
        VarDirective,
        FileSizePipe,
      ],
      providers: [
        { provide: Location, useValue: locationObject },
        { provide: ActivatedRoute, useValue: route },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: Router, useValue: router },
        { provide: RequestService, useValue: requestService },
      ],
    }).overrideComponent(ReplaceBitstreamPageComponent, {
      remove: { imports: [UploaderComponent] },
      add: { imports: [TestUploaderComponent] },
    }).compileComponents();
  }),
  );

  beforeEach(() => {
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
      component.onCompleteItem(bitstream);
    });

    it('should set the bitstream and bundle to state in the cache', () => {
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith(bitstreamSelfLink);
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith(bundleSelfLink);
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
