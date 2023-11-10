import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditCmsMetadataComponent } from './edit-cms-metadata.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { of } from 'rxjs';
import { Site } from '../../core/shared/site.model';
import { SiteDataService } from '../../core/data/site-data.service';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.test';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditCmsMetadataComponent', () => {

  let component: EditCmsMetadataComponent;
  let fixture: ComponentFixture<EditCmsMetadataComponent>;
  const site = Object.assign(new Site(), {
    metadata: { }
  });

  const siteServiceStub = jasmine.createSpyObj('SiteDataService', {
    find: jasmine.createSpy('find'),
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
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [EditCmsMetadataComponent],
      providers: [
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: SiteDataService, useValue: siteServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCmsMetadataComponent);
    component = fixture.componentInstance;
    siteServiceStub.find.and.returnValue(of(site));
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
      const metadataListLength = environment.cms.metadataList.length;
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
      console.log(textareas.length, languagesLength);
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
        const saveButton = fixture.debugElement.query(By.css('#save-metadata-btn'));
        saveButton.nativeElement.click();
        const operations = [];
        operations.push({
          op: 'replace',
          path: '/metadata/' + component.selectedMetadata,
          value: {
            value: component.selectedMetadataValues.get(environment.languages[0].code),
            language: environment.languages[0].code
          }
        });
        component.selectedMetadataValues.forEach((value, key) => {
          if (key !== environment.languages[0].code) {
            operations.push({
              op: 'add',
              path: '/metadata/' + component.selectedMetadata,
              value: {
                value: value,
                language: key
              }
            });
          }
        });
        expect(siteServiceStub.patch).toHaveBeenCalledWith(site, operations);
      });

    });
  });
});
