import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { AuthService } from '../../core/auth/auth.service';
import {
  METADATA_IMPORT_SCRIPT_NAME,
  ScriptDataService
} from '../../core/data/processes/script-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { FileValueAccessorDirective } from '../../shared/utils/file-value-accessor.directive';
import { FileValidator } from '../../shared/utils/require-file.validator';
import { MetadataImportPageComponent } from './metadata-import-page.component';

describe('MetadataImportPageComponent', () => {
  let comp: MetadataImportPageComponent;
  let fixture: ComponentFixture<MetadataImportPageComponent>;

  let user;

  let notificationService: NotificationsServiceStub;
  let scriptService: any;
  let router;
  let authService;
  let locationStub;

  function init() {
    notificationService = new NotificationsServiceStub();
    scriptService = jasmine.createSpyObj('scriptService',
      {
        invoke: observableOf({
          response:
            {
              isSuccessful: true,
              resourceSelfLinks: ['https://localhost:8080/api/core/processes/45']
            }
        })
      }
    );
    user = Object.assign(new EPerson(), {
      id: 'userId',
      email: 'user@test.com'
    });
    authService = jasmine.createSpyObj('authService', {
      getAuthenticatedUserFromStore: observableOf(user)
    });
    router = jasmine.createSpyObj('router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    });
    locationStub = jasmine.createSpyObj('location', {
      back: jasmine.createSpy('back')
    });
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [MetadataImportPageComponent, FileValueAccessorDirective, FileValidator],
      providers: [
        { provide: NotificationsService, useValue: notificationService },
        { provide: ScriptDataService, useValue: scriptService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        { provide: Location, useValue: locationStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataImportPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('if back button is pressed', () => {
    beforeEach(fakeAsync(() => {
      const proceed = fixture.debugElement.query(By.css('#backButton')).nativeElement;
      proceed.click();
      fixture.detectChanges();
    }));
    it('should do location.back', () => {
      expect(locationStub.back).toHaveBeenCalled();
    });
  });

  describe('if file is set', () => {
    let fileMock: File;

    beforeEach(() => {
      fileMock = new File([''], 'filename.txt', { type: 'text/plain' });
      comp.setFile(fileMock);
    });

    describe('if proceed button is pressed', () => {
      beforeEach(fakeAsync(() => {
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('metadata-import script is invoked with its -e currentUserEmail, -f fileName and the mockFile', () => {
        const parameterValues: ProcessParameter[] = [
          Object.assign(new ProcessParameter(), { name: '-e', value: user.email }),
          Object.assign(new ProcessParameter(), { name: '-f', value: 'filename.txt' }),
        ];
        expect(scriptService.invoke).toHaveBeenCalledWith(METADATA_IMPORT_SCRIPT_NAME, parameterValues, [fileMock]);
      });
      it('success notification is shown', () => {
        expect(notificationService.success).toHaveBeenCalled();
      });
      it('redirected to process page', () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/45');
      });
    });

    describe('if proceed is pressed; but script invoke fails', () => {
      beforeEach(fakeAsync(() => {
        jasmine.getEnv().allowRespy(true);
        spyOn(scriptService, 'invoke').and.returnValue(observableOf({
          response:
            {
              isSuccessful: false,
            }
        }));
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('error notification is shown', () => {
        expect(notificationService.error).toHaveBeenCalled();
      });
    });
  });
});
