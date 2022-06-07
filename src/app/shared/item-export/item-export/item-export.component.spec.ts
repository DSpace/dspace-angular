import { Item } from './../../../core/shared/item.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { of, of as observableOf } from 'rxjs';

import { ItemExportComponent } from './item-export.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterMock } from '../../mocks/router.mock';
import { Router } from '@angular/router';
import { ItemExportFormConfiguration, ItemExportService } from '../item-export.service';
import { ItemExportAlertStubComponent } from '../item-export-alert/item-export-alert.component.spec';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';

describe('ItemExportComponent', () => {
  let component: ItemExportComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ItemExportComponent>;
  let configuration: ItemExportFormConfiguration;
  let exportForm: FormGroup;
  let exportItemForm: FormGroup;

  const itemExportService: any = jasmine.createSpyObj('ItemExportFormatService', {
    initialItemExportFormConfiguration: jasmine.createSpy('initialItemExportFormConfiguration'),
    onSelectEntityType: jasmine.createSpy('onSelectEntityType'),
    submitForm: jasmine.createSpy('submitForm')
  });

  const modal: any = jasmine.createSpyObj('NgbActiveModal', {
    close: jasmine.createSpy('close').and.callFake(() => { /**/ })
  });


  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    uuid: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    entityType: 'Person',
    _links: {
      self: {
        href: 'https://localhost:8000/items/fake-id'
      }
    }
  });

  const router = new RouterMock();

  const itemType = Object.assign(new ItemType(), {
    'type': 'entitytype',
    'id': 1,
    'label': 'Person',
    'uuid': 'entitytype-1',
    '_links': {
      'self': {
        'href': 'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'
      },
      'relationshiptypes': {
        'href': 'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1/relationshiptypes'
      }
    }
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock } }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ItemExportComponent, ItemExportAlertStubComponent],
      providers: [
        { provide: ItemExportService, useValue: itemExportService },
        { provide: NgbActiveModal, useValue: modal },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: router }
      ]
    })
      .compileComponents();
  }));

  describe('when initializing', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemExportComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;

      // inputs
      component.searchOptions = 'searchOptions' as any;
      component.molteplicity = 'molteplicity' as any;
      component.item = mockItem;
      component.itemType = itemType;

      // data
      configuration = { format: 'format', entityType: 'entityType' } as any;
      exportForm = new FormGroup({
        format: new FormControl(configuration.format, [Validators.required]),
        entityType: new FormControl(configuration.entityType, [Validators.required]),
      });

      exportItemForm = new FormGroup({
        format: new FormControl(configuration.format, [Validators.required]),
        entityType: new FormControl(mockItem.entityType, [Validators.required]),
      });

      // spies
      itemExportService.initialItemExportFormConfiguration.and.returnValue(observableOf(configuration));
      spyOn(component, 'initFormItemType').and.returnValue(exportForm);
      spyOn(exportForm.controls.entityType.valueChanges, 'subscribe').and.callThrough();
      spyOn(component, 'onEntityTypeChange').and.callFake(() => { /****/ });

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the exportForm calling initialItemExportFormConfiguration', () => {
      expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith(mockItem);
      expect(component.configuration).toBe(configuration);
    });

    it('should initialize the exportForm calling initialItemExportFormConfiguration with null item', () => {
      component.item = null;
      component.ngOnInit();
      fixture.detectChanges();
      expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith(null);
      expect(component.configuration).toBe(configuration);
    });


  });

  describe('initForm method', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemExportComponent);
      component = fixture.componentInstance;
      component.itemType = itemType;

      configuration = { format: 'format', entityType: 'Person' } as any;
    });

    it('should create the export form with configuration format and entityType', () => {

      const form = component.initForm(configuration);

      expect(Object.keys(form.controls).length).toEqual(2);
      expect(form.controls.entityType.value).toBe('Person');
      expect(form.controls.format.value).toBe('format');
    });

  });


  describe('onSubmit method', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemExportComponent);
      component = fixture.componentInstance;

      // component status
      component.item = 'item' as any;
      component.searchOptions = 'searchOptions' as any;
      component.molteplicity = 'molteplicity' as any;
      component.itemType = itemType;
      component.exportForm = new FormGroup({
        format: new FormControl('format', [Validators.required]),
        entityType: new FormControl('Person', [Validators.required]),
      });

      // spies
      itemExportService.submitForm.and.returnValue(of('processNumber'));
    });

    it('should call the submitForm and then route to process number and close modal', () => {
      component.onSubmit();

      expect(itemExportService.submitForm).toHaveBeenCalledWith('molteplicity', 'item', 'searchOptions', 'Person', 'format');
      expect((component as any).notificationsService.process).toHaveBeenCalled();
      expect(component.activeModal.close).toHaveBeenCalled();
    });

  });


});
