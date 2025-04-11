import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaceBitstreamPageComponent } from './replace-bitstream-page.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../app/shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../app/shared/testing/notifications-service.stub';import { of as observableOf } from 'rxjs';
import { Bitstream } from '../../../app/core/shared/bitstream.model';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../app/shared/utils/var.directive';
import { Location } from '@angular/common';
import { FileSizePipe } from '../../../app/shared/utils/file-size-pipe';
import { createSuccessfulRemoteDataObject } from '../../../app/shared/remote-data.utils';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UploaderOptions } from '../../../app/shared/upload/uploader/uploader-options.model';
import { UploaderProperties } from '../../../app/shared/upload/uploader/uploader-properties.model';
import { AuthService } from '../../../app/core/auth/auth.service';
import { AuthServiceStub } from '../../../app/shared/testing/auth-service.stub';
import { RouterStub } from '../../../app/shared/testing/router.stub';
import { RequestService } from '../../../app/core/data/request.service';
import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';

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
      bundle: { href: bundleSelfLink }
    }
  });
  const route = { data: observableOf({ bitstream: createSuccessfulRemoteDataObject(bitstream) }) };
  const requestService = jasmine.createSpyObj('requestService', ['setStaleByHrefSubstring']);
  const router = new RouterStub();

  beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [ReplaceBitstreamPageComponent, VarDirective, FileSizePipe, TestUploaderComponent],
        providers: [
          { provide: Location, useValue: locationObject },
          { provide: ActivatedRoute, useValue: route },
          { provide: NotificationsService, useClass: NotificationsServiceStub },
          { provide: AuthService, useClass: AuthServiceStub },
          { provide: Router, useValue: router },
          { provide: RequestService, useValue: requestService }
        ]
      })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceBitstreamPageComponent);
    component = fixture.componentInstance;
    notificationsService = TestBed.get(NotificationsService);
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
  template: ``
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
