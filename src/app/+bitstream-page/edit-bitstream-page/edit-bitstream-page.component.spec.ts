import { EditBitstreamPageComponent } from './edit-bitstream-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RemoteData } from '../../core/data/remote-data';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormControlModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { NotificationType } from '../../shared/notifications/models/notification-type';
import { INotification, Notification } from '../../shared/notifications/models/notification.model';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../../core/shared/bitstream-format-support-level';
import { hasValue } from '../../shared/empty.util';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { RestResponse } from '../../core/cache/response.models';
import { VarDirective } from '../../shared/utils/var.directive';

const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');

let notificationsService: NotificationsService;
let formService: DynamicFormService;
let bitstreamService: BitstreamDataService;
let bitstreamFormatService: BitstreamFormatDataService;
let bitstream: Bitstream;
let selectedFormat: BitstreamFormat;
let allFormats: BitstreamFormat[];

describe('EditBitstreamPageComponent', () => {
  let comp: EditBitstreamPageComponent;
  let fixture: ComponentFixture<EditBitstreamPageComponent>;

  beforeEach(async(() => {
    allFormats = [
      Object.assign({
        id: '1',
        shortDescription: 'Unknown',
        description: 'Unknown format',
        supportLevel: BitstreamFormatSupportLevel.Unknown,
        _links: {
          self: { href: 'format-selflink-1' }
        }
      }),
      Object.assign({
        id: '2',
        shortDescription: 'PNG',
        description: 'Portable Network Graphics',
        supportLevel: BitstreamFormatSupportLevel.Known,
        _links: {
          self: { href: 'format-selflink-2' }
        }
      }),
      Object.assign({
        id: '3',
        shortDescription: 'GIF',
        description: 'Graphics Interchange Format',
        supportLevel: BitstreamFormatSupportLevel.Known,
        _links: {
          self: { href: 'format-selflink-3' }
        }
      })
    ] as BitstreamFormat[];
    selectedFormat = allFormats[1];
    notificationsService = jasmine.createSpyObj('notificationsService',
      {
        info: infoNotification,
        warning: warningNotification,
        success: successNotification
      }
    );
    formService = Object.assign({
      createFormGroup: (fModel: DynamicFormControlModel[]) => {
        const controls = {};
        if (hasValue(fModel)) {
          fModel.forEach((controlModel) => {
            controls[controlModel.id] = new FormControl((controlModel as any).value);
          });
          return new FormGroup(controls);
        }
        return undefined;
      }
    });
    bitstream = Object.assign(new Bitstream(), {
      metadata: {
        'dc.description': [
          {
            value: 'Bitstream description'
          }
        ],
        'dc.title': [
          {
            value: 'Bitstream title'
          }
        ]
      },
      format: observableOf(new RemoteData(false, false, true, null, selectedFormat)),
      _links: {
        self: 'bitstream-selflink'
      }
    });
    bitstreamService = jasmine.createSpyObj('bitstreamService', {
      findById: observableOf(new RemoteData(false, false, true, null, bitstream)),
      update: observableOf(new RemoteData(false, false, true, null, bitstream)),
      updateFormat: observableOf(new RestResponse(true, 200, 'OK')),
      commitUpdates: {},
      patch: {}
    });
    bitstreamFormatService = jasmine.createSpyObj('bitstreamFormatService', {
      findAll: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), allFormats)))
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [EditBitstreamPageComponent, FileSizePipe, VarDirective],
      providers: [
        { provide: NotificationsService, useValue: notificationsService },
        { provide: DynamicFormService, useValue: formService },
        { provide: ActivatedRoute, useValue: { data: observableOf({ bitstream: new RemoteData(false, false, true, null, bitstream) }), snapshot: { queryParams: {} } } },
        { provide: BitstreamDataService, useValue: bitstreamService },
        { provide: BitstreamFormatDataService, useValue: bitstreamFormatService },
        ChangeDetectorRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBitstreamPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('on startup', () => {
    let rawForm;

    beforeEach(() => {
      rawForm = comp.formGroup.getRawValue();
    });

    it('should fill in the bitstream\'s title', () => {
      expect(rawForm.fileNamePrimaryContainer.fileName).toEqual(bitstream.name);
    });

    it('should fill in the bitstream\'s description', () => {
      expect(rawForm.descriptionContainer.description).toEqual(bitstream.firstMetadataValue('dc.description'));
    });

    it('should select the correct format', () => {
      expect(rawForm.formatContainer.selectedFormat).toEqual(selectedFormat.id);
    });

    it('should put the \"New Format\" input on invisible', () => {
      expect(comp.formLayout.newFormat.grid.host).toContain('invisible');
    });
  });

  describe('when an unknown format is selected', () => {
    beforeEach(() => {
      comp.updateNewFormatLayout(allFormats[0].id);
    });

    it('should remove the invisible class from the \"New Format\" input', () => {
      expect(comp.formLayout.newFormat.grid.host).not.toContain('invisible');
    });
  });

  describe('onSubmit', () => {
    describe('when selected format hasn\'t changed', () => {
      beforeEach(() => {
        comp.onSubmit();
      });

      it('should call update', () => {
        expect(bitstreamService.update).toHaveBeenCalled();
      });

      it('should commit the updates', () => {
        expect(bitstreamService.commitUpdates).toHaveBeenCalled();
      });
    });

    describe('when selected format has changed', () => {
      beforeEach(() => {
        comp.formGroup.patchValue({
          formatContainer: {
            selectedFormat: allFormats[2].id
          }
        });
        fixture.detectChanges();
        comp.onSubmit();
      });

      it('should call update', () => {
        expect(bitstreamService.update).toHaveBeenCalled();
      });

      it('should call updateFormat', () => {
        expect(bitstreamService.updateFormat).toHaveBeenCalled();
      });

      it('should commit the updates', () => {
        expect(bitstreamService.commitUpdates).toHaveBeenCalled();
      });
    });
  });
});
