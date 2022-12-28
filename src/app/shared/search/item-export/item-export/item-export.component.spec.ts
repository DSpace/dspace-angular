import { Item } from '../../../../core/shared/item.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { of, of as observableOf } from 'rxjs';

import { ExportSelectionMode, ItemExportComponent } from './item-export.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterMock } from '../../../mocks/router.mock';
import { Router } from '@angular/router';
import { ItemExportFormConfiguration, ItemExportService } from '../item-export.service';
import { ItemExportAlertStubComponent } from '../item-export-alert/item-export-alert.component.spec';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { SelectableListService } from '../../../object-list/selectable-list/selectable-list.service';
import { SearchResult } from '../../models/search-result.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

describe('ItemExportComponent', () => {
  let component: ItemExportComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ItemExportComponent>;
  let configuration: ItemExportFormConfiguration;
  let exportForm: FormGroup;

  const itemExportService: any = jasmine.createSpyObj('ItemExportFormatService', {
    initialItemExportFormConfiguration: jasmine.createSpy('initialItemExportFormConfiguration'),
    onSelectEntityType: jasmine.createSpy('onSelectEntityType'),
    submitForm: jasmine.createSpy('submitForm')
  });

  const modal: any = jasmine.createSpyObj('NgbActiveModal', {
    close: jasmine.createSpy('close').and.callFake(() => { /**/
    })
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
  const selectService = jasmine.createSpyObj('selectService', {
    getSelectableList: jasmine.createSpy('getSelectableList'),
    removeSelection: jasmine.createSpy('removeSelection')
  });

  const firstSearchResult = Object.assign(new SearchResult(), {
    indexableObject: Object.assign(new DSpaceObject(), {
      id: 'd317835d-7b06-4219-91e2-1191900cb897',
      uuid: 'd317835d-7b06-4219-91e2-1191900cb897',
      name: 'My first publication',
      metadata: {
        'dspace.entity.type': [
          { value: 'Publication' }
        ]
      }
    })
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
        { provide: SelectableListService, useValue: selectService },
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

      // component.itemType = itemType;
      component.bulkExportLimit = '-1' as any;

      // data
      configuration = { format: 'format', entityType: 'entityType', entityTypes: ['entityType'] } as any;

      // spies
      itemExportService.initialItemExportFormConfiguration.and.returnValue(observableOf(configuration));

    });

    describe('when item is given', () => {
      beforeEach(() => {
        component.item = mockItem;
        component.showListSelection = false;
        exportForm = new FormGroup({
          format: new FormControl(configuration.format, [Validators.required]),
          entityType: new FormControl(configuration.entityType, [Validators.required]),
        });
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should initialize the exportForm calling initialItemExportFormConfiguration', () => {
        expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith(mockItem);
        expect(component.configuration).toBe(configuration);
        // expect(component.exportForm).toEqual(exportForm);
        const formatSelect = fixture.debugElement.query(By.css('[data-test="format-select"]'));
        const selectionRadio = fixture.debugElement.query(By.css('[data-test="selection-radio"]'));
        expect(formatSelect).toBeTruthy();
        expect(selectionRadio).toBeNull();
      });

    });

    describe('when item is not given and itemType is given', () => {

      beforeEach(() => {
        component.item = null;
        component.itemType = itemType;
        itemExportService.onSelectEntityType.and.returnValue(of(configuration));
      });

      describe('when showListSelection is false', () => {

        beforeEach(() => {
          component.showListSelection = false;
          fixture.detectChanges();
        });

        it('should create', () => {
          expect(component).toBeTruthy();
        });

        it('should initialize the exportForm calling initialItemExportFormConfiguration', () => {
          expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith(null);
          expect(component.configuration).toBe(configuration);
          const formatSelect = fixture.debugElement.query(By.css('[data-test="format-select"]'));
          const selectionRadio = fixture.debugElement.query(By.css('[data-test="selection-radio"]'));
          expect(formatSelect).toBeTruthy();
          expect(selectionRadio).toBeNull();
        });
      });

      describe('when showListSelection is true', () => {

        beforeEach(() => {
          component.showListSelection = true;
          fixture.detectChanges();
        });

        it('should create', () => {
          expect(component).toBeTruthy();
        });

        it('should initialize the exportForm calling initialItemExportFormConfiguration', () => {
          expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith(null);
          expect(component.configuration).toBe(configuration);
          const formatSelect = fixture.debugElement.query(By.css('[data-test="format-select"]'));
          const selectionRadio = fixture.debugElement.query(By.css('[data-test="selection-radio"]'));
          expect(formatSelect).toBeTruthy();
          expect(selectionRadio).toBeTruthy();
        });
      });

    });

    describe('when both item and itemType are not given', () => {
      beforeEach(() => {
        component.item = null;
        component.itemType = null;
        itemExportService.onSelectEntityType.and.returnValue(of(configuration));
      });

      describe('when showListSelection is false', () => {

        beforeEach(() => {
          component.showListSelection = false;
          fixture.detectChanges();
        });

        it('should create', () => {
          expect(component).toBeTruthy();
        });

        it('should initialize the exportForm calling initialItemExportFormConfiguration', () => {
          expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith(null);
          expect(component.configuration).toBe(configuration);
          // expect(component.exportForm).toEqual(exportForm);
          const formatSelect = fixture.debugElement.query(By.css('[data-test="format-select"]'));
          const selectionRadio = fixture.debugElement.query(By.css('[data-test="selection-radio"]'));
          expect(formatSelect).toBeTruthy();
          expect(selectionRadio).toBeNull();
        });
      });

      describe('when showListSelection is true', () => {

        beforeEach(() => {
          component.showListSelection = true;
          fixture.detectChanges();
        });

        it('should create', () => {
          expect(component).toBeTruthy();
        });

        it('should initialize the exportForm calling initialItemExportFormConfiguration', () => {
          expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith(null);
          expect(component.configuration).toBe(configuration);
          // expect(component.exportForm).toEqual(exportForm);
          const formatSelect = fixture.debugElement.query(By.css('[data-test="format-select"]'));
          const selectionRadio = fixture.debugElement.query(By.css('[data-test="selection-radio"]'));
          expect(formatSelect).toBeTruthy();
          expect(selectionRadio).toBeTruthy();
        });
      });

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
      component.bulkExportLimit = '-1' as any;
      component.showListSelection = false;
      component.exportForm = new FormGroup({
        format: new FormControl('format', [Validators.required]),
        entityType: new FormControl('Person', [Validators.required]),
        selectionMode: new FormControl(ExportSelectionMode.OnlySelection, [Validators.required])
      });

      // spies
      itemExportService.submitForm.and.returnValue(of('processNumber'));
    });


    describe('when has no selection', () => {
      beforeEach(() => {
        const selection = {
          selection: []
        };
        selectService.getSelectableList.and.returnValue(observableOf(selection));
      });

      it('should call the submitForm and then route to process number and close modal', () => {
        component.onSubmit();

        expect(itemExportService.submitForm).toHaveBeenCalledWith('molteplicity', 'item', 'searchOptions', 'Person', 'format', []);
        expect((component as any).notificationsService.process).toHaveBeenCalled();
        expect(component.activeModal.close).toHaveBeenCalled();
      });

    });

    describe('when has selection', () => {
      beforeEach(() => {
        const selection = {
          selection: [firstSearchResult]
        };
        selectService.getSelectableList.and.returnValue(observableOf(selection));
      });

      it('should call the submitForm and then route to process number and close modal', () => {
        component.onSubmit();

        expect(itemExportService.submitForm).toHaveBeenCalledWith('molteplicity', 'item', 'searchOptions', 'Person', 'format', ['d317835d-7b06-4219-91e2-1191900cb897']);
        expect((component as any).notificationsService.process).toHaveBeenCalled();
        expect(component.activeModal.close).toHaveBeenCalled();
      });

    });
  });


});
