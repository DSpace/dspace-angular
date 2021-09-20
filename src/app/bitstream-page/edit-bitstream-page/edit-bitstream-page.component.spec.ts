import { EditBitstreamPageComponent } from './edit-bitstream-page.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
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
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { getEntityEditRoute } from '../../item-page/item-page-routing-paths';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { Item } from '../../core/shared/item.model';

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
let router: Router;

describe('EditBitstreamPageComponent', () => {
  let comp: EditBitstreamPageComponent;
  let fixture: ComponentFixture<EditBitstreamPageComponent>;

  beforeEach(waitForAsync(() => {
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
      format: createSuccessfulRemoteDataObject$(selectedFormat),
      _links: {
        self: 'bitstream-selflink'
      },
      bundle: createSuccessfulRemoteDataObject$({
        item: createSuccessfulRemoteDataObject$(Object.assign(new Item(), {
          uuid: 'some-uuid'
        }))
      })
    });
    bitstreamService = jasmine.createSpyObj('bitstreamService', {
      findById: createSuccessfulRemoteDataObject$(bitstream),
      update: createSuccessfulRemoteDataObject$(bitstream),
      updateFormat: createSuccessfulRemoteDataObject$(bitstream),
      commitUpdates: {},
      patch: {}
    });
    bitstreamFormatService = jasmine.createSpyObj('bitstreamFormatService', {
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(allFormats))
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [EditBitstreamPageComponent, FileSizePipe, VarDirective],
      providers: [
        { provide: NotificationsService, useValue: notificationsService },
        { provide: DynamicFormService, useValue: formService },
        { provide: ActivatedRoute, useValue: { data: observableOf({ bitstream: createSuccessfulRemoteDataObject(bitstream) }), snapshot: { queryParams: {} } } },
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
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
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
  describe('when the cancel button is clicked', () => {
    it('should call navigateToItemEditBitstreams method', () => {
      spyOn(comp, 'navigateToItemEditBitstreams');
      comp.onCancel();
      expect(comp.navigateToItemEditBitstreams).toHaveBeenCalled();
    });
  });
  describe('when navigateToItemEditBitstreams is called, and the component has an itemId', () => {
    it('should redirect to the item edit page on the bitstreams tab with the itemId from the component', () => {
      comp.itemId = 'some-uuid1';
      comp.navigateToItemEditBitstreams();
      expect(router.navigate).toHaveBeenCalledWith([getEntityEditRoute(null, 'some-uuid1'), 'bitstreams']);
    });
  });
  describe('when navigateToItemEditBitstreams is called, and the component does not have an itemId', () => {
    it('should redirect to the item edit page on the bitstreams tab with the itemId from the bundle links ', () => {
      comp.itemId = undefined;
      comp.navigateToItemEditBitstreams();
      expect(router.navigate).toHaveBeenCalledWith([getEntityEditRoute(null, 'some-uuid'), 'bitstreams']);
    });
  });
});
