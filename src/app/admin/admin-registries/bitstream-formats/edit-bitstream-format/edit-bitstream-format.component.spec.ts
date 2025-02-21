import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { BitstreamFormatDataService } from '../../../../../../modules/core/src/lib/core/data/bitstream-format-data.service';
import { RemoteData } from '../../../../../../modules/core/src/lib/core/data/remote-data';
import { NotificationsService } from '../../../../../../modules/core/src/lib/core/notifications/notifications.service';
import { BitstreamFormat } from '../../../../../../modules/core/src/lib/core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../../../../../modules/core/src/lib/core/shared/bitstream-format-support-level';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { NotificationsServiceStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/notifications-service.stub';
import { RouterStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/router.stub';
import { FormatFormComponent } from '../format-form/format-form.component';
import { EditBitstreamFormatComponent } from './edit-bitstream-format.component';

describe('EditBitstreamFormatComponent', () => {
  let comp: EditBitstreamFormatComponent;
  let fixture: ComponentFixture<EditBitstreamFormatComponent>;

  const bitstreamFormat = new BitstreamFormat();
  bitstreamFormat.uuid = 'test-uuid-1';
  bitstreamFormat.id = 'test-uuid-1';
  bitstreamFormat.shortDescription = 'Unknown';
  bitstreamFormat.description = 'Unknown data format';
  bitstreamFormat.mimetype = 'application/octet-stream';
  bitstreamFormat.supportLevel = BitstreamFormatSupportLevel.Unknown;
  bitstreamFormat.internal = false;
  bitstreamFormat.extensions = null;

  const routeStub = {
    data: observableOf({
      bitstreamFormat: createSuccessfulRemoteDataObject(bitstreamFormat),
    }),
  };

  let router;
  let notificationService: NotificationsServiceStub;
  let bitstreamFormatDataService: BitstreamFormatDataService;

  const initAsync = () => {
    router = new RouterStub();
    notificationService = new NotificationsServiceStub();
    bitstreamFormatDataService = jasmine.createSpyObj('bitstreamFormatDataService', {
      updateBitstreamFormat: createSuccessfulRemoteDataObject$({}),
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, EditBitstreamFormatComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: router },
        { provide: NotificationsService, useValue: notificationService },
        { provide: BitstreamFormatDataService, useValue: bitstreamFormatDataService },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(EditBitstreamFormatComponent, {
        remove: {
          imports: [FormatFormComponent],
        },
      })
      .compileComponents();
  };

  const initBeforeEach = () => {
    fixture = TestBed.createComponent(EditBitstreamFormatComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  };

  describe('init', () => {
    beforeEach(waitForAsync(initAsync));
    beforeEach(initBeforeEach);
    it('should initialise the bitstreamFormat based on the route', () => {

      comp.bitstreamFormatRD$.subscribe((format: RemoteData<BitstreamFormat>) => {
        const expected = createSuccessfulRemoteDataObject(bitstreamFormat);
        expect(format.payload).toEqual(expected.payload);
      });
    });
  });
  describe('updateFormat success', () => {
    beforeEach(waitForAsync(initAsync));
    beforeEach(initBeforeEach);
    it('should send the updated form to the service, show a notification and navigate to ', () => {
      comp.updateFormat(bitstreamFormat);

      expect(bitstreamFormatDataService.updateBitstreamFormat).toHaveBeenCalledWith(bitstreamFormat);
      expect(notificationService.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/admin/registries/bitstream-formats']);

    });
  });
  describe('updateFormat error', () => {
    beforeEach(waitForAsync(() => {
      router = new RouterStub();
      notificationService = new NotificationsServiceStub();
      bitstreamFormatDataService = jasmine.createSpyObj('bitstreamFormatDataService', {
        updateBitstreamFormat: createFailedRemoteDataObject$('Error', 500),
      });

      TestBed.configureTestingModule({
        imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, EditBitstreamFormatComponent],
        providers: [
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: Router, useValue: router },
          { provide: NotificationsService, useValue: notificationService },
          { provide: BitstreamFormatDataService, useValue: bitstreamFormatDataService },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      })
        .overrideComponent(EditBitstreamFormatComponent, {
          remove: {
            imports: [FormatFormComponent],
          },
        })
        .compileComponents();
    }));
    beforeEach(initBeforeEach);
    it('should send the updated form to the service, show a notification and navigate to ', () => {
      comp.updateFormat(bitstreamFormat);

      expect(bitstreamFormatDataService.updateBitstreamFormat).toHaveBeenCalledWith(bitstreamFormat);
      expect(notificationService.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

    });
  });
});
