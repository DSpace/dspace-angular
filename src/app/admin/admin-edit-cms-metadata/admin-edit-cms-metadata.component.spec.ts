import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment.test';
import { SiteDataService } from '../../core/data/site-data.service';
import { Site } from '../../core/shared/site.model';
import { AdminEditCmsMetadataComponent } from './admin-edit-cms-metadata.component';

describe('AdminEditCmsMetadataComponent', () => {

  let component: AdminEditCmsMetadataComponent;
  let fixture: ComponentFixture<AdminEditCmsMetadataComponent>;
  const site = Object.assign(new Site(), {
    metadata: {},
  });

  const siteServiceStub = jasmine.createSpyObj('SiteDataService', {
    find: jasmine.createSpy('find'),
    findByHref: jasmine.createSpy('findByHref'),
    patch: jasmine.createSpy('patch'),
  });

  const metadataValueMap = new Map([
    ['en', ''],
    ['de', ''],
    ['cs', ''],
    ['nl', ''],
    ['pt', ''],
    ['fr', ''],
    ['lv', ''],
    ['bn', ''],
    ['el', ''],
  ]);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        AdminEditCmsMetadataComponent,
      ],
      providers: [
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: SiteDataService, useValue: siteServiceStub },
        provideNoopAnimations(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditCmsMetadataComponent);
    component = fixture.componentInstance;
    siteServiceStub.find.and.returnValue(of(site));
    siteServiceStub.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(site));
    siteServiceStub.patch.and.returnValue(of(site));
  });

  describe('', () => {

    beforeEach(() => {
      // component.editMode = false;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show metadata cms list correctly', () => {
      // Substract 1 because the top footer is not included in the list if it is not enabled (and it's not, by default)
      const metadataListLength = environment.cms.metadataList.length - 1;
      const selectMetadata = fixture.debugElement.query(By.css('select'));
      expect(selectMetadata.children).toHaveSize(metadataListLength + 1);
    });

  });

  describe('when the edit button is clicked', () => {
    beforeEach(() => {
      spyOn(component, 'editSelectedMetadata');
      component.selectedMetadata = 'metadata';
      fixture.detectChanges();
    });
    it('should call selectMetadataToEdit', () => {
      const editButton = fixture.debugElement.query(By.css('#edit-metadata-btn'));
      editButton.nativeElement.click();
      expect(component.editSelectedMetadata).toHaveBeenCalled();
    });
  });

  describe('after the button edit is clicked', () => {

    beforeEach(() => {
      component.selectedMetadata = environment.cms.metadataList[0];
      component.selectedMetadataValues = metadataValueMap;
      component.editMode.next(true);
      fixture.detectChanges();
    });

    it('should render textareas of the languages', () => {
      const languagesLength = environment.languages.filter((l) => l.active).length;
      const textareas = fixture.debugElement.queryAll(By.css('textarea'));
      expect(textareas).toHaveSize(languagesLength);
    });

    describe('after the button save is clicked', () => {

      it('should call method edit', () => {
        spyOn(component, 'saveMetadata');
        const saveButton = fixture.debugElement.query(By.css('#save-metadata-btn'));
        saveButton.nativeElement.click();
        expect(component.saveMetadata).toHaveBeenCalled();
      });

      it('should call method patch of service', () => {
        component.selectedMetadata = environment.cms.metadataList[0];
        component.site = site;
        component.selectedMetadataValues.set(environment.languages[0].code, 'Test English Text');
        component.selectedMetadataValues.set(environment.languages[1].code, 'Test Second Language Text');
        component.saveMetadata();

        const operations = [];
        if (site.hasMetadata && site.hasMetadata(component.selectedMetadata)) {
          operations.push({
            op: 'remove',
            path: '/metadata/' + component.selectedMetadata,
          });
        }
        const nonEmptyValues = Array.from(component.selectedMetadataValues.entries())
          .filter(([, text]) => text && text.trim().length > 0);
        nonEmptyValues.forEach(([language, value]) => {
          operations.push({
            op: 'add',
            path: '/metadata/' + component.selectedMetadata + '/-',
            value: {
              value,
              language,
            },
          });
        });
        expect(siteServiceStub.patch).toHaveBeenCalledWith(site, operations);
      });

    });
  });
});
