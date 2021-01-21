import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { RestResponse } from '../core/cache/response.models';
import { ScriptDataService } from '../core/data/processes/script-data.service';
import { RequestEntry } from '../core/data/request.reducer';
import { RequestService } from '../core/data/request.service';
import { Collection } from '../core/shared/collection.model';
import { getMockRequestService } from '../shared/mocks/request.service.mock';
import { RouterMock } from '../shared/mocks/router.mock';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { BulkImportPageComponent } from './bulk-import-page.component';
import { AuthService } from '../core/auth/auth.service';

describe('BulkImportPageComponent', () => {

  let component: BulkImportPageComponent;
  let fixture: ComponentFixture<BulkImportPageComponent>;

  let requestService: any;
  let scriptDataService: any;
  let notificationsService: any;
  let route: any;
  let router: RouterMock;

  const collection: Collection = Object.assign(new Collection(), {
    id: '626b80c5-ef15-4b29-8e69-bda89b0a7acf',
    name: 'Test collection'
  });

  const file: File = new File(['test'], 'test.xls');

  const fileList: any = {
    item: (index: number) => file,
    length: 10
  };

  const authService = jasmine.createSpyObj('authService', {
    isAuthenticated: of(true),
    setRedirectUrl: {}
  });

  beforeEach(() => {
    requestService = getMockRequestService();
    scriptDataService = jasmine.createSpyObj('scriptDataService', {
      invoke: of(Object.assign(new RequestEntry(), {
        response: new RestResponse(true, 200, 'OK')
      }))
    });
    notificationsService = new NotificationsServiceStub();

    route = new ActivatedRouteStub({}, {
      collection: createSuccessfulRemoteDataObject( collection )
    });
    router = new RouterMock();

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [BulkImportPageComponent],
      providers: [
        BulkImportPageComponent,
        DSONameService,
        { provide: RequestService, useValue: requestService },
        { provide: RequestService, useValue: requestService },
        { provide: ScriptDataService, useValue: scriptDataService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(BulkImportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
  }));

  it('should create BulkImportPageComponent', inject([BulkImportPageComponent], (comp: BulkImportPageComponent) => {
    expect(comp).toBeDefined();
  }));

  describe('when the user submit the form', () => {

    beforeEach(() => {
      component.form.value.abortOnError = true;
      component.form.value.file = fileList;
      component.submit();
    });

    it('should invoke the bulk-import script', () => {
      expect(scriptDataService.invoke).toHaveBeenCalledWith('bulk-import', [
        { name: '-c', value: '626b80c5-ef15-4b29-8e69-bda89b0a7acf' },
        { name: '-f', value: 'test.xls' },
        { name: '-e', value: true }
      ], [file]);
    });

  });

  describe('when the user click on back button', () => {

    beforeEach(() => {
      component.goBack();
    });

    it('should nagivate to collection page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/collections/626b80c5-ef15-4b29-8e69-bda89b0a7acf');
    });

  });

});
