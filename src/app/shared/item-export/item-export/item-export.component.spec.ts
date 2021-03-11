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
    close: jasmine.createSpy('close').and.callFake(() => { /**/})
  });

  const router = new RouterMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader,  useClass: TranslateLoaderMock }}),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ItemExportComponent, ItemExportAlertStubComponent],
      providers: [
        { provide: ItemExportService, useValue: itemExportService },
        { provide: NgbActiveModal, useValue: modal },
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
      component.item = 'item' as any;

      // data
      configuration = { format: 'format', entityType: 'entityType'} as any;
      exportForm = new FormGroup({
        format: new FormControl(configuration.format, [Validators.required]),
        entityType: new FormControl(configuration.entityType, [Validators.required]),
      });

      // spies
      itemExportService.initialItemExportFormConfiguration.and.returnValue(observableOf(configuration));
      spyOn(component, 'initForm').and.returnValue(exportForm);
      spyOn(exportForm.controls.entityType.valueChanges, 'subscribe').and.callThrough();
      spyOn(component, 'onEntityTypeChange').and.callFake(() => { /****/});

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the exportForm calling initialItemExportFormConfiguration', () => {
      expect(itemExportService.initialItemExportFormConfiguration).toHaveBeenCalledWith( 'item');
      expect(component.configuration).toBe(configuration);
      expect(component.initForm).toHaveBeenCalledWith(configuration);
      expect(component.exportForm).toBe(exportForm);
    });

    it('should listen for exportForm.entityType changes', () => {

      exportForm.controls.entityType.patchValue('entityType2');

      expect(component.onEntityTypeChange).toHaveBeenCalledWith('entityType2');
    });

  });

  describe('initForm method', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemExportComponent);
      component = fixture.componentInstance;

      configuration = { format: 'format', entityType: 'entityType'} as any;
    });

    it('should create the export form with configuration format and entityType', () => {

      const form = component.initForm(configuration);

      expect(Object.keys(form.controls).length).toEqual(2);
      expect(form.controls.entityType.value).toBe('entityType');
      expect(form.controls.format.value).toBe('format');
    });

  });

  describe('onEntityTypeChange method', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemExportComponent);
      component = fixture.componentInstance;
      configuration = { format: 'format', entityType: 'entityType1', entityTypes: 'entityTypes'} as any;

      // component status
      component.exportForm = new FormGroup({
        format: new FormControl(configuration.format, [Validators.required]),
        entityType: new FormControl(configuration.entityType, [Validators.required]),
      });
      component.configuration = configuration;

      // spies
      itemExportService.onSelectEntityType.and.returnValue(of(configuration));
      spyOn(component.exportForm.controls.format, 'patchValue').and.callThrough();
    });

    it('should updated configuration variable and patch the exportForm format value', () => {

      component.onEntityTypeChange('entityType2');

      expect(itemExportService.onSelectEntityType).toHaveBeenCalledWith('entityTypes', 'entityType2');
      expect(component.exportForm.controls.format.patchValue).toHaveBeenCalledWith('format');
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
      component.exportForm = new FormGroup({
        format: new FormControl('format', [Validators.required]),
        entityType: new FormControl('entityType', [Validators.required]),
      });

      // spies
      itemExportService.submitForm.and.returnValue(of('processNumber'));
      spyOn(component, 'routeToProcess').and.callFake(() => { /**/});
    });

    it('should call the submitForm and then route to process number and close modal', () => {
      component.onSubmit();

      expect(itemExportService.submitForm).toHaveBeenCalledWith('molteplicity', 'item', 'searchOptions', 'entityType', 'format');
      expect(component.routeToProcess).toHaveBeenCalledWith('processNumber' as any);
      expect(component.activeModal.close).toHaveBeenCalled();
    });

  });

  describe('when configuration.entityTypes are available', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemExportComponent);
      component = fixture.componentInstance;

      // data
      component.molteplicity = ItemExportFormatMolteplicity.MULTIPLE;
      configuration = { format: 'format', entityType: 'entityType1', entityTypes: ['e1', 'e2']} as any;

      // spies
      itemExportService.initialItemExportFormConfiguration.and.returnValue(observableOf(configuration));
    });

    it('should add options', () => {

      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('#entityType'));
      const options = select.queryAll(By.css('option'));

      expect(select).toBeTruthy();
      // first disabled option
      expect(options[0].nativeElement.disabled).toBeTrue();
      options.shift();

      // entityTypes options
      expect(options.length).toBe(configuration.entityTypes.length);
      configuration.entityTypes.forEach((entityType, index) => {
        expect(options[index].nativeElement.value).toContain(configuration.entityTypes[index]);
      });
    });

  });

  describe('when configuration.formats are available', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ItemExportComponent);
      component = fixture.componentInstance;

      // data
      component.molteplicity = ItemExportFormatMolteplicity.MULTIPLE;
      configuration = { format: 'f1', entityType: 'entityType1', formats: ['f1', 'f2']} as any;

      // spies
      itemExportService.initialItemExportFormConfiguration.and.returnValue(observableOf(configuration));
    });

    it('should add options', () => {

      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('#format'));
      const options = select.queryAll(By.css('option'));

      expect(select).toBeTruthy();
      // first disabled option
      expect(options[0].nativeElement.disabled).toBeTrue();
      options.shift();

      // entityTypes options
      expect(options.length).toBe(configuration.formats.length);
      configuration.formats.forEach((entityType, index) => {
        expect(options[index].nativeElement.value).toContain(configuration.formats[index]);
      });
    });

  });

});
