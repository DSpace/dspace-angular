import {ChangeDetectorRef, Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { AuthServiceStub } from '../../shared/testing/auth-service-stub';
import { AuthService } from '../../core/auth/auth.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { createTestComponent } from '../../shared/testing/utils';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission.component';
import { AppState } from '../../app.reducer';
import { MockTranslateLoader } from '../../shared/mocks/mock-translate-loader';
import { getMockTranslateService } from '../../shared/mocks/mock-translate.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { SharedModule } from '../../shared/shared.module';
import { getMockScrollToService } from '../../shared/mocks/mock-scroll-to-service';
import { UploaderService } from '../../shared/uploader/uploader.service';
import {By} from '@angular/platform-browser';

describe('MyDSpaceNewSubmissionComponent test', () => {

  const translateService: any = getMockTranslateService();
  const store: Store<AppState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    pipe: observableOf(true)
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [
        MyDSpaceNewSubmissionComponent,
        TestComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('workspaceitems') },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ScrollToService, useValue: getMockScrollToService() },
        { provide: Store, useValue: store },
        { provide: TranslateService, useValue: translateService },
        ChangeDetectorRef,
        MyDSpaceNewSubmissionComponent,
        UploaderService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-my-dspace-new-submission (uploadEnd)="reload($event)"></ds-my-dspace-new-submission>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create MyDSpaceNewSubmissionComponent', inject([MyDSpaceNewSubmissionComponent], (app: MyDSpaceNewSubmissionComponent) => {

      expect(app).toBeDefined();

    }));

    it('should be a dropdown button', inject([MyDSpaceNewSubmissionComponent], (app: MyDSpaceNewSubmissionComponent) => {
      app.availableEntyTypeList = new Set(['Publication', 'Journal', 'JournalIssue']);
      const dropdownElement: DebugElement = testFixture.debugElement.query(By.css('.dropdown-menu'));
      const dropdown = dropdownElement.nativeElement;
      expect(dropdown.innerHTML).toBeDefined();
      const dropdownMenuItems: DebugElement[] = dropdownElement.queryAll(By.css('.dropdown-item'));
      expect(dropdownMenuItems.length).toEqual(3);
      expect(dropdownMenuItems[0].nativeElement.innerHTML).toContain('Publication');
      expect(dropdownMenuItems[1].nativeElement.innerHTML).toContain('Journal');
      expect(dropdownMenuItems[2].nativeElement.innerHTML).toContain('JournalIssue');

    }));

    it('should be a single button', inject([MyDSpaceNewSubmissionComponent], (app: MyDSpaceNewSubmissionComponent) => {
      app.availableEntyTypeList = new Set(['Publication']);

      const addDivElement: DebugElement = testFixture.debugElement.query(By.css('.add'));
      const addDiv = addDivElement.nativeElement;
      expect(addDiv.innerHTML).toBeDefined();
      const buttonElement: DebugElement = addDiv.queryAll(By.css('a'));
      const button = buttonElement.nativeElement;
      expect(button.innerHTML).toBeDefined();
      const dropdownElement: DebugElement = testFixture.debugElement.query(By.css('.dropdown-menu'));
      expect(dropdownElement).toBeUndefined()
    }));
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  reload = (event) => {
    return;
  }
}
