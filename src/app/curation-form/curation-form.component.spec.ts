import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurationFormComponent } from './curation-form.component';
import { ScriptDataService } from '../core/data/processes/script-data.service';
import { ProcessDataService } from '../core/data/processes/process-data.service';
import { of as observableOf } from 'rxjs';
import { RequestEntry } from '../core/data/request.reducer';
import { DSOSuccessResponse, RestResponse } from '../core/cache/response.models';
import { Process } from '../process-page/processes/process.model';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { RouterStub } from '../shared/testing/router.stub';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';

describe('CurationFormComponent', () => {
  let comp: CurationFormComponent;
  let fixture: ComponentFixture<CurationFormComponent>;

  let scriptDataService: ScriptDataService;
  let processDataService: ProcessDataService;
  let configurationDataService: ConfigurationDataService;
  let notificationsService;
  let router;

  const requestEntry = Object.assign(new RequestEntry(),
    {response: new DSOSuccessResponse(['process-link'], 200, 'success')});
  const failedRequestEntry = Object.assign(new RequestEntry(),
    {response: new RestResponse(false, 400, 'Bad Request')});

  const process = Object.assign(new Process(), {processId: 'process-id'});

  beforeEach(async(() => {

    scriptDataService = jasmine.createSpyObj('scriptDataService', {
      invoke: observableOf(requestEntry)
    });

    processDataService = jasmine.createSpyObj('processDataService', {
      findByHref: createSuccessfulRemoteDataObject$(process)
    });

    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'plugin.named.org.dspace.curate.CurationTask',
        values: [
          'org.dspace.ctask.general.ProfileFormats = profileformats',
          '',
          'org.dspace.ctask.general.RequiredMetadata = requiredmetadata',
          'org.dspace.ctask.general.MetadataValueLinkChecker = checklinks',
          'value-to-be-skipped'
        ]
      }))
    });

    notificationsService = new NotificationsServiceStub();
    router = new RouterStub();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule],
      declarations: [CurationFormComponent],
      providers: [
        {provide: ScriptDataService, useValue: scriptDataService},
        {provide: ProcessDataService, useValue: processDataService},
        {provide: NotificationsService, useValue: notificationsService},
        {provide: Router, useValue: router},
        {provide: ConfigurationDataService, useValue: configurationDataService},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationFormComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });
  describe('init', () => {
    it('should initialise the comp and contain the different tasks', () => {
      expect(comp).toBeDefined();

      const elements = fixture.debugElement.queryAll(By.css('option'));
      expect(elements.length).toEqual(3);
      expect(elements[0].nativeElement.innerHTML).toContain('curation-task.task.profileformats.label');
      expect(elements[1].nativeElement.innerHTML).toContain('curation-task.task.requiredmetadata.label');
      expect(elements[2].nativeElement.innerHTML).toContain('curation-task.task.checklinks.label');
    });
  });
  describe('hasHandleValue', () => {
    it('should return true when a dsoHandle value was provided', () => {
      comp.dsoHandle = 'some-handle';
      fixture.detectChanges();

      expect(comp.hasHandleValue()).toBeTrue();
    });
    it('should return false when no dsoHandle value was provided', () => {
      expect(comp.hasHandleValue()).toBeFalse();
    });
  });
  describe('submit', () => {
    it('should submit the selected process and handle to the scriptservice and navigate to the corresponding process page', () => {
      comp.dsoHandle = 'test-handle';
      comp.submit();

      expect(scriptDataService.invoke).toHaveBeenCalledWith('curate', [
        {name: '-t', value: 'profileformats'},
        {name: '-i', value: 'test-handle'},
      ], []);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(processDataService.findByHref).toHaveBeenCalledWith('process-link');
      expect(router.navigate).toHaveBeenCalledWith(['/processes', 'process-id']);
    });
    it('should the selected process and handle to the scriptservice and stay on the page on error', () => {
      (scriptDataService.invoke as jasmine.Spy).and.returnValue(observableOf(failedRequestEntry));

      comp.dsoHandle = 'test-handle';
      comp.submit();

      expect(scriptDataService.invoke).toHaveBeenCalledWith('curate', [
        {name: '-t', value: 'profileformats'},
        {name: '-i', value: 'test-handle'},
      ], []);
      expect(notificationsService.error).toHaveBeenCalled();
      expect(processDataService.findByHref).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
  it('should use the handle provided by the form when no dsoHandle is provided', () => {
    comp.form.get('handle').patchValue('form-handle');

    comp.submit();

    expect(scriptDataService.invoke).toHaveBeenCalledWith('curate', [
      {name: '-t', value: 'profileformats'},
      {name: '-i', value: 'form-handle'},
    ], []);
  });
  it('should use "all" when the handle provided by the form is empty and when no dsoHandle is provided', () => {

    comp.submit();

    expect(scriptDataService.invoke).toHaveBeenCalledWith('curate', [
      {name: '-t', value: 'profileformats'},
      {name: '-i', value: 'all'},
    ], []);
  });
});
