import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCmsMetadataComponent } from './edit-cms-metadata.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { Observable, of } from 'rxjs';
import { Site } from '../../core/shared/site.model';
import { SiteDataService } from '../../core/data/site-data.service';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { environment } from '../../../environments/mock-environment';

describe('EditCmsMetadataComponent', () => {

  let component: EditCmsMetadataComponent;
  let fixture: ComponentFixture<EditCmsMetadataComponent>;
  let siteServiceStub;
  const site = new Site();

  beforeEach(async () => {
    siteServiceStub = {
      find(): Observable<Site> {
        return of(site);
      },
      patch(): Observable<Site> {
        return of(site);
      }
    };
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [EditCmsMetadataComponent],
      providers: [
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: SiteDataService, useValue: siteServiceStub}
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCmsMetadataComponent);
    component = fixture.componentInstance;
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

  xdescribe('after the button edit is clicked', () => {

    beforeEach(() => {
      console.log(component.languageMap);
      fixture.detectChanges();
      component.editMode.next(true);
    });

    it('should render textareas of the languages', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const languagesLength = environment.languages.length;
        const textareas = fixture.debugElement.queryAll(By.css('textarea'));
        expect(textareas).toHaveSize(languagesLength);
      });
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
        spyOn(siteServiceStub, 'patch');
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
