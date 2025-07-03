import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { BitstreamFormatDataService } from '../../../../core/data/bitstream-format-data.service';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../../../core/shared/bitstream-format-support-level';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { FormService } from '../../../../shared/form/form.service';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { getMockFormService } from '../../../../shared/mocks/form-service.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../../../shared/testing/router.stub';
import { FormatFormComponent } from '../format-form/format-form.component';
import { AddBitstreamFormatComponent } from './add-bitstream-format.component';

describe('AddBitstreamFormatComponent', () => {
  let comp: AddBitstreamFormatComponent;
  let fixture: ComponentFixture<AddBitstreamFormatComponent>;

  const bitstreamFormat = new BitstreamFormat();
  bitstreamFormat.uuid = 'test-uuid-1';
  bitstreamFormat.id = 'test-uuid-1';
  bitstreamFormat.shortDescription = 'Unknown';
  bitstreamFormat.description = 'Unknown data format';
  bitstreamFormat.mimetype = 'application/octet-stream';
  bitstreamFormat.supportLevel = BitstreamFormatSupportLevel.Unknown;
  bitstreamFormat.internal = false;
  bitstreamFormat.extensions = null;

  let router;
  let notificationService: NotificationsServiceStub;
  let bitstreamFormatDataService: BitstreamFormatDataService;

  const initAsync = () => {
    router = new RouterStub();
    notificationService = new NotificationsServiceStub();
    bitstreamFormatDataService = jasmine.createSpyObj('bitstreamFormatDataService', {
      createBitstreamFormat: createSuccessfulRemoteDataObject$({}),
      clearBitStreamFormatRequests: of(null),
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, AddBitstreamFormatComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: NotificationsService, useValue: notificationService },
        { provide: BitstreamFormatDataService, useValue: bitstreamFormatDataService },
        { provide: FormService, useValue: getMockFormService() },
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(AddBitstreamFormatComponent, {
        remove: {
          imports: [FormatFormComponent],
        },
      })
      .compileComponents();
  };

  const initBeforeEach = () => {
    fixture = TestBed.createComponent(AddBitstreamFormatComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  };

  describe('createBitstreamFormat success', () => {
    beforeEach(waitForAsync(initAsync));
    beforeEach(initBeforeEach);
    it('should send the updated form to the service, show a notification and navigate to ', () => {
      comp.createBitstreamFormat(bitstreamFormat);

      expect(bitstreamFormatDataService.createBitstreamFormat).toHaveBeenCalledWith(bitstreamFormat);
      expect(notificationService.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/admin/registries/bitstream-formats']);

    });
  });
  describe('createBitstreamFormat error', () => {
    beforeEach(waitForAsync(() => {
      router = new RouterStub();
      notificationService = new NotificationsServiceStub();
      bitstreamFormatDataService = jasmine.createSpyObj('bitstreamFormatDataService', {
        createBitstreamFormat: createFailedRemoteDataObject$('Error', 500),
        clearBitStreamFormatRequests: of(null),
      });

      TestBed.configureTestingModule({
        imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, AddBitstreamFormatComponent],
        providers: [
          { provide: Router, useValue: router },
          { provide: NotificationsService, useValue: notificationService },
          { provide: BitstreamFormatDataService, useValue: bitstreamFormatDataService },
          { provide: FormService, useValue: getMockFormService() },
          { provide: FormBuilderService, useValue: getMockFormBuilderService() },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      })
        .overrideComponent(AddBitstreamFormatComponent, {
          remove: {
            imports: [FormatFormComponent],
          },
        })
        .compileComponents();
    }));
    beforeEach(initBeforeEach);
    it('should send the updated form to the service, show a notification and navigate to ', () => {
      comp.createBitstreamFormat(bitstreamFormat);

      expect(bitstreamFormatDataService.createBitstreamFormat).toHaveBeenCalledWith(bitstreamFormat);
      expect(notificationService.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

    });
  });
});
