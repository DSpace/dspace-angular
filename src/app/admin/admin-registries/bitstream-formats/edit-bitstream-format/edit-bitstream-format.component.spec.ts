import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterStub } from '../../../../shared/testing/router-stub';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../../../../core/data/remote-data';
import { EditBitstreamFormatComponent } from './edit-bitstream-format.component';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service-stub';
import { BitstreamFormatDataService } from '../../../../core/data/bitstream-format-data.service';
import { RestResponse } from '../../../../core/cache/response.models';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../../../core/shared/bitstream-format-support-level';
import { ResourceType } from '../../../../core/shared/resource-type';

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
      bitstreamFormat: new RemoteData(false, false, true, null, bitstreamFormat)
    })
  };

  let router;
  let notificationService: NotificationsServiceStub;
  let bitstreamFormatDataService: BitstreamFormatDataService;

  const initAsync = () => {
    router =  new RouterStub();
    notificationService = new NotificationsServiceStub();
    bitstreamFormatDataService = jasmine.createSpyObj('bitstreamFormatDataService', {
      updateBitstreamFormat: observableOf(new RestResponse(true, 200, 'Success'))
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [EditBitstreamFormatComponent],
      providers: [
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: Router, useValue: router},
        {provide: NotificationsService, useValue: notificationService},
        {provide: BitstreamFormatDataService, useValue: bitstreamFormatDataService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  };

  const initBeforeEach = () => {
    fixture = TestBed.createComponent(EditBitstreamFormatComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  };

  describe('init', () => {
    beforeEach(async(initAsync));
    beforeEach(initBeforeEach);
    it('should initialise the bitstreamFormat based on the route', () => {

      comp.bitstreamFormatRD$.subscribe((format: RemoteData<BitstreamFormat>) => {
        expect(format).toEqual(new RemoteData(false, false, true, null, bitstreamFormat));
      });
    });
  });
  describe('updateFormat success', () => {
    beforeEach(async(initAsync));
    beforeEach(initBeforeEach);
    it('should send the updated form to the service, show a notification and navigate to ', () => {
      comp.updateFormat(bitstreamFormat);

      expect(bitstreamFormatDataService.updateBitstreamFormat).toHaveBeenCalledWith(bitstreamFormat);
      expect(notificationService.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/admin/registries/bitstream-formats']);

    });
  });
  describe('updateFormat error', () => {
    beforeEach(async( () => {
      router =  new RouterStub();
      notificationService = new NotificationsServiceStub();
      bitstreamFormatDataService = jasmine.createSpyObj('bitstreamFormatDataService', {
        updateBitstreamFormat: observableOf(new RestResponse(false, 400, 'Bad Request'))
      });

      TestBed.configureTestingModule({
        imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
        declarations: [EditBitstreamFormatComponent],
        providers: [
          {provide: ActivatedRoute, useValue: routeStub},
          {provide: Router, useValue: router},
          {provide: NotificationsService, useValue: notificationService},
          {provide: BitstreamFormatDataService, useValue: bitstreamFormatDataService},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
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
