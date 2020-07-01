import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormControlModel, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { ErrorResponse, RestResponse } from '../../../core/cache/response.models';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestError } from '../../../core/data/request.models';
import { RequestService } from '../../../core/data/request.service';
import { RestRequestMethod } from '../../../core/data/rest-request-method';
import { Community } from '../../../core/shared/community.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { hasValue } from '../../empty.util';
import { AuthServiceMock } from '../../mocks/auth.service.mock';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { VarDirective } from '../../utils/var.directive';
import { ComColFormComponent } from './comcol-form.component';
import { Operation } from 'fast-json-patch';

describe('ComColFormComponent', () => {
  let comp: ComColFormComponent<DSpaceObject>;
  let fixture: ComponentFixture<ComColFormComponent<DSpaceObject>>;
  let location: Location;
  const formServiceStub: any = {
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
  };
  const dcTitle = 'dc.title';
  const dcAbstract = 'dc.description.abstract';

  const abstractMD = { [dcAbstract]: [{ value: 'Community description', language: null }] };
  const newTitleMD = { [dcTitle]: [{ value: 'New Community Title', language: null }] };
  const formModel = [
    new DynamicInputModel({
      id: 'title',
      name: dcTitle,
      value: newTitleMD[dcTitle][0].value
    }),
    new DynamicInputModel({
      id: 'abstract',
      name: dcAbstract,
      value: abstractMD[dcAbstract][0].value
    })
  ];

  const logoEndpoint = 'rest/api/logo/endpoint';
  const dsoService = Object.assign({
    getLogoEndpoint: () => observableOf(logoEndpoint),
    deleteLogo: () => observableOf({})
  });
  const notificationsService = new NotificationsServiceStub();

  /* tslint:disable:no-empty */
  const locationStub = jasmine.createSpyObj('location', ['back']);
  /* tslint:enable:no-empty */

  const requestServiceStub = jasmine.createSpyObj({
    removeByHrefSubstring: {}
  });
  const objectCacheStub = jasmine.createSpyObj({
    remove: {}
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ComColFormComponent, VarDirective],
      providers: [
        { provide: Location, useValue: locationStub },
        { provide: DynamicFormService, useValue: formServiceStub },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: RequestService, useValue: requestServiceStub },
        { provide: ObjectCacheService, useValue: objectCacheStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('when the dso doesn\'t contain an ID (newly created)', () => {
    beforeEach(() => {
      initComponent(Object.assign(new Community(), {
        _links: { self: { href: 'community-self' } }
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
              }
            ),
            uploader: undefined,
            deleteLogo: false,
            operations: operations,
          }
        );
      })
    });

    describe('onCancel', () => {
      it('should call the back method on the Location service', () => {
        comp.onCancel();
        expect(locationStub.back).toHaveBeenCalled();
      });
    });

    describe('onCompleteItem', () => {
      beforeEach(() => {
        spyOn(comp.finish, 'emit');
        comp.onCompleteItem();
      });

      it('should show a success notification', () => {
        expect(notificationsService.success).toHaveBeenCalled();
      });

      it('should emit finish', () => {
        expect(comp.finish.emit).toHaveBeenCalled();
      });
    });

    describe('onUploadError', () => {
      beforeEach(() => {
        spyOn(comp.finish, 'emit');
        comp.onUploadError();
      });

      it('should show an error notification', () => {
        expect(notificationsService.error).toHaveBeenCalled();
      });

      it('should emit finish', () => {
        expect(comp.finish.emit).toHaveBeenCalled();
      });
    });
  });

  describe('when the dso contains an ID (being edited)', () => {
    describe('and the dso doesn\'t contain a logo', () => {
      beforeEach(() => {
        initComponent(Object.assign(new Community(), {
          id: 'community-id',
          logo: observableOf(new RemoteData(false, false, true, null, undefined)),
          _links: { self: { href: 'community-self' } }
        }));
      });

      it('should initialize the uploadFilesOptions with the logo\'s endpoint url', () => {
        expect(comp.uploadFilesOptions.url).toEqual(logoEndpoint);
      });

      it('should initialize the uploadFilesOptions with a POST method', () => {
        expect(comp.uploadFilesOptions.method).toEqual(RestRequestMethod.POST);
      });
    });

    describe('and the dso contains a logo', () => {
      beforeEach(() => {
        initComponent(Object.assign(new Community(), {
          id: 'community-id',
          logo: observableOf(new RemoteData(false, false, true, null, {})),
          _links: { self: { href: 'community-self' } }
        }));
      });

      it('should initialize the uploadFilesOptions with the logo\'s endpoint url', () => {
        expect(comp.uploadFilesOptions.url).toEqual(logoEndpoint);
      });

      it('should initialize the uploadFilesOptions with a PUT method', () => {
        expect(comp.uploadFilesOptions.method).toEqual(RestRequestMethod.PUT);
      });

      describe('submit with logo marked for deletion', () => {
        beforeEach(() => {
          comp.markLogoForDeletion = true;
        });

        describe('when dsoService.deleteLogo returns a successful response', () => {
          const response = new RestResponse(true, 200, 'OK');

          beforeEach(() => {
            spyOn(dsoService, 'deleteLogo').and.returnValue(observableOf(response));
            comp.onSubmit();
          });

          it('should display a success notification', () => {
            expect(notificationsService.success).toHaveBeenCalled();
          });

          it('should remove the object\'s cache', () => {
            expect(requestServiceStub.removeByHrefSubstring).toHaveBeenCalled();
            expect(objectCacheStub.remove).toHaveBeenCalled();
          });
        });

        describe('when dsoService.deleteLogo returns an error response', () => {
          const response = new ErrorResponse(new RequestError('this error was purposely thrown, to test error notifications'));

          beforeEach(() => {
            spyOn(dsoService, 'deleteLogo').and.returnValue(observableOf(response));
            comp.onSubmit();
          });

          it('should display an error notification', () => {
            expect(notificationsService.error).toHaveBeenCalled();
          });
        });
      });

      describe('deleteLogo', () => {
        beforeEach(() => {
          comp.deleteLogo();
          fixture.detectChanges();
        });

        it('should set markLogoForDeletion to true', () => {
          expect(comp.markLogoForDeletion).toEqual(true);
        });

        it('should mark the logo section with a danger alert', () => {
          const logoSection = fixture.debugElement.query(By.css('#logo-section.alert-danger'));
          expect(logoSection).toBeTruthy();
        });

        it('should hide the delete button', () => {
          const button = fixture.debugElement.query(By.css('#logo-section .btn-danger'));
          expect(button).not.toBeTruthy();
        });

        it('should show the undo button', () => {
          const button = fixture.debugElement.query(By.css('#logo-section .btn-warning'));
          expect(button).toBeTruthy();
        });
      });

      describe('undoDeleteLogo', () => {
        beforeEach(() => {
          comp.markLogoForDeletion = true;
          comp.undoDeleteLogo();
          fixture.detectChanges();
        });

        it('should set markLogoForDeletion to false', () => {
          expect(comp.markLogoForDeletion).toEqual(false);
        });

        it('should disable the danger alert on the logo section', () => {
          const logoSection = fixture.debugElement.query(By.css('#logo-section.alert-danger'));
          expect(logoSection).not.toBeTruthy();
        });

        it('should show the delete button', () => {
          const button = fixture.debugElement.query(By.css('#logo-section .btn-danger'));
          expect(button).toBeTruthy();
        });

        it('should hide the undo button', () => {
          const button = fixture.debugElement.query(By.css('#logo-section .btn-warning'));
          expect(button).not.toBeTruthy();
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
    comp.uploaderComponent = {uploader: {}} as any;

    (comp as any).dsoService = dsoService;
    fixture.detectChanges();
    location = (comp as any).location;
  }
});
