import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCmsMetadataComponent } from './edit-cms-metadata.component';
import {getMockTranslateService} from '../../shared/mocks/translate.service.mock';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NotificationsServiceStub} from '../../shared/testing/notifications-service.stub';
import {NotificationsService} from '../../shared/notifications/notifications.service';
import {Observable, of} from 'rxjs';
import {Site} from '../../core/shared/site.model';
import {SiteDataService} from '../../core/data/site-data.service';
import {TranslateLoaderMock} from '../../shared/mocks/translate-loader.mock';

describe('EditHomepageMetadataComponent', () => {
  let component: EditCmsMetadataComponent;
  let fixture: ComponentFixture<EditCmsMetadataComponent>;
  const translate = getMockTranslateService();
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
      declarations: [ EditCmsMetadataComponent ],
      providers: [
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: SiteDataService, useValue: siteServiceStub }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(EditCmsMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
