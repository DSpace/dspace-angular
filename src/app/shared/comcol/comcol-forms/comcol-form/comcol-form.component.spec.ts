import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { RequestService } from '../../../../core/data/request.service';
import { RestRequestMethod } from '../../../../core/data/rest-request-method';
import { Community } from '../../../../core/shared/community.model';
import { hasValue } from '../../../empty.util';
import { FormComponent } from '../../../form/form.component';
import { AuthServiceMock } from '../../../mocks/auth.service.mock';
import { NotificationsService } from '../../../notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { UploaderComponent } from '../../../upload/uploader/uploader.component';
import { VarDirective } from '../../../utils/var.directive';
import { ComcolPageLogoComponent } from '../../comcol-page-logo/comcol-page-logo.component';
import { ComColFormComponent } from './comcol-form.component';

describe('ComColFormComponent', () => {
  let comp: ComColFormComponent<any>;
  let fixture: ComponentFixture<ComColFormComponent<any>>;
  let location: Location;
  const formServiceStub: any = {
    createFormGroup: (fModel: DynamicFormControlModel[]) => {
      const controls = {};
      if (hasValue(fModel)) {
        fModel.forEach((controlModel) => {
          controls[controlModel.id] = new UntypedFormControl((controlModel as any).value);
        });
        return new UntypedFormGroup(controls);
      }
      return undefined;
    },
  };
  const dcTitle = 'dc.title';
  const dcAbstract = 'dc.description.abstract';

  const abstractMD = { [dcAbstract]: [{ value: 'Community description', language: null }] };
  const newTitleMD = { [dcTitle]: [{ value: 'New Community Title', language: null }] };
  const formModel = [
    new DynamicInputModel({
      id: 'title',
      name: dcTitle,
      value: newTitleMD[dcTitle][0].value,
    }),
    new DynamicInputModel({
      id: 'abstract',
      name: dcAbstract,
      value: abstractMD[dcAbstract][0].value,
    }),
  ];

  const logo = {
    id: 'logo',
  };
  const logoEndpoint = 'rest/api/logo/endpoint';
  const dsoService = Object.assign({
    getLogoEndpoint: () => observableOf(logoEndpoint),
    deleteLogo: () => createSuccessfulRemoteDataObject$({}),
    findById: () => createSuccessfulRemoteDataObject$({}),
  });
  const notificationsService = new NotificationsServiceStub();

  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  const locationStub = jasmine.createSpyObj('location', ['back']);
  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */

  const requestServiceStub = jasmine.createSpyObj('requestService', {
    removeByHrefSubstring: {},
    setStaleByHrefSubstring: {},
  });
  const objectCacheStub = jasmine.createSpyObj('objectCache', {
    remove: {},
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, ComColFormComponent, VarDirective],
      providers: [
        { provide: Location, useValue: locationStub },
        { provide: DynamicFormService, useValue: formServiceStub },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: RequestService, useValue: requestServiceStub },
        { provide: ObjectCacheService, useValue: objectCacheStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ComColFormComponent, {
        remove: {
          imports: [
            FormComponent,
            UploaderComponent,
            ComcolPageLogoComponent,
          ],
        },
      })
      .compileComponents();
  }));

  describe('when the dso doesn\'t contain an ID (newly created)', () => {
    beforeEach(() => {
      initComponent(Object.assign(new Community(), {
        _links: { self: { href: 'community-self' } },
      }));
    });

    it('should initialize the uploadFilesOptions with a placeholder url', () => {
      expect(comp.uploadFilesOptions.url.length).toBeGreaterThan(0);
    });

    describe('onSubmit', () => {
      beforeEach(() => {
        spyOn(comp.submitForm, 'emit');
        comp.formModel = formModel;
      });

      it('should emit the new version of the community', () => {
        comp.dso = new Community();
        comp.onSubmit();

        const operations: Operation[] = [
          {
            op: 'replace',
            path: '/metadata/dc.title',
            value: {
              value: 'New Community Title',
              language: null,
            },
          },
          {
            op: 'replace',
            path: '/metadata/dc.description.abstract',
            value: {
              value: 'Community description',
              language: null,
            },
          },
        ];

        expect(comp.submitForm.emit).toHaveBeenCalledWith(
          {
            dso: Object.assign({}, comp.dso, {
              metadata: {
                'dc.title': [{
                  value: 'New Community Title',
                  language: null,
                }],
                'dc.description.abstract': [{
                  value: 'Community description',
                  language: null,
                }],
              },
              type: Community.type,
            },
            ),
            operations: operations,
          },
        );
      });
    });

    describe('onCompleteItem', () => {
      beforeEach(() => {
        comp.onCompleteItem();
      });

      it('should show a success notification', () => {
        expect(notificationsService.success).toHaveBeenCalled();
      });
    });

    describe('onUploadError', () => {
      beforeEach(() => {
        comp.onUploadError();
      });

      it('should show an error notification', () => {
        expect(notificationsService.error).toHaveBeenCalled();
      });
    });
  });

  describe('when the dso contains an ID (being edited)', () => {
    describe('and the dso doesn\'t contain a logo', () => {
      beforeEach(() => {
        initComponent(Object.assign(new Community(), {
          id: 'community-id',
          logo: createSuccessfulRemoteDataObject$(undefined),
          _links: { self: { href: 'community-self' } },
        }));
      });

      it('should initialize the uploadFilesOptions with the logo\'s endpoint url', () => {
        expect(comp.uploadFilesOptions.url).toEqual(logoEndpoint);
      });

      it('should initialize the uploadFilesOptions with a POST method', () => {
        expect(comp.uploadFilesOptions.method).toEqual(RestRequestMethod.POST);
      });

      it('should not show the delete logo button', () => {
        const button = fixture.debugElement.query(By.css('#logo-section .btn-danger'));
        expect(button).toBeFalsy();
      });
    });

    describe('and the dso contains a logo', () => {
      beforeEach(() => {
        initComponent(Object.assign(new Community(), {
          id: 'community-id',
          logo: createSuccessfulRemoteDataObject$(logo),
          _links: {
            self: { href: 'community-self' },
            logo: { href: 'community-logo' },
          },
        }));
      });

      it('should initialize the uploadFilesOptions with the logo\'s endpoint url', () => {
        expect(comp.uploadFilesOptions.url).toEqual(logoEndpoint);
      });

      it('should show the delete logo button', () => {
        const button = fixture.debugElement.query(By.css('#logo-section .btn-danger'));
        expect(button).toBeTruthy();
      });

      describe('when the delete logo button is clicked', () => {
        beforeEach(() => {
          spyOn(dsoService, 'deleteLogo').and.returnValue(createSuccessfulRemoteDataObject$({}));
          spyOn(comp, 'handleLogoDeletion').and.callThrough();
          spyOn(comp, 'createConfirmationModal').and.callThrough();
          spyOn(comp, 'subscribeToConfirmationResponse').and.callThrough();
          const deleteButton = fixture.debugElement.query(By.css('#logo-section .btn-danger'));
          deleteButton.nativeElement.click();
          fixture.detectChanges();
        });

        it('should create a confirmation modal with the correct labels and properties', () => {
          const modalServiceSpy = spyOn((comp as any).modalService, 'open').and.callThrough();

          const modalRef = comp.createConfirmationModal();

          expect(modalServiceSpy).toHaveBeenCalled();

          expect(modalRef).toBeDefined();
          expect(modalRef.componentInstance).toBeDefined();

          expect(modalRef.componentInstance.headerLabel).toBe('community-collection.edit.logo.delete.title');
          expect(modalRef.componentInstance.infoLabel).toBe('confirmation-modal.delete-community-collection-logo.info');
          expect(modalRef.componentInstance.cancelLabel).toBe('form.cancel');
          expect(modalRef.componentInstance.confirmLabel).toBe('community-collection.edit.logo.delete.title');
          expect(modalRef.componentInstance.confirmIcon).toBe('fas fa-trash');
        });

        it('should call createConfirmationModal method', () => {
          expect(comp.createConfirmationModal).toHaveBeenCalled();
        });

        it('should call subscribeToConfirmationResponse method', () => {
          expect(comp.subscribeToConfirmationResponse).toHaveBeenCalled();
        });

        describe('when the modal is closed', () => {

          let modalRef;

          beforeEach(() => {
            modalRef = comp.createConfirmationModal();
            comp.subscribeToConfirmationResponse(modalRef);
          });

          it('should call handleLogoDeletion and dsoService.deleteLogo methods when deletion is confirmed', waitForAsync(() => {
            modalRef.componentInstance.confirmPressed();

            expect(comp.handleLogoDeletion).toHaveBeenCalled();
            expect(dsoService.deleteLogo).toHaveBeenCalled();

          }));

          it('should not call handleLogoDeletion and dsoService.deleteLogo methods when deletion is refused', waitForAsync(() => {
            modalRef.componentInstance.cancelPressed();

            expect(comp.handleLogoDeletion).not.toHaveBeenCalled();
            expect(dsoService.deleteLogo).not.toHaveBeenCalled();
          }));

        });
      });
    });
  });

  function initComponent(dso: Community) {
    fixture = TestBed.createComponent(ComColFormComponent);
    comp = fixture.componentInstance;
    comp.formModel = [];
    comp.dso = dso;
    (comp as any).type = Community.type;
    comp.uploaderComponent = { uploader: {} } as any;

    (comp as any).dsoService = dsoService;
    fixture.detectChanges();
    location = (comp as any).location;
  }
});
