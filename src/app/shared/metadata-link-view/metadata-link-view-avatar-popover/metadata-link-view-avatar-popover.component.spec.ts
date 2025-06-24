/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MetadataLinkViewAvatarPopoverComponent } from './metadata-link-view-avatar-popover.component';
import { of as observableOf } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FileService } from '../../../core/shared/file.service';
import { SafeUrlPipe } from '../../../shared/utils/safe-url-pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';

describe('MetadataLinkViewAvatarPopoverComponent', () => {
  let component: MetadataLinkViewAvatarPopoverComponent;
  let fixture: ComponentFixture<MetadataLinkViewAvatarPopoverComponent>;
  let authService;
  let authorizationService;
  let fileService;

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('AuthService', {
      isAuthenticated: observableOf(true),
    });
    authorizationService = jasmine.createSpyObj('AuthorizationService', {
      isAuthorized: observableOf(true),
    });
    fileService = jasmine.createSpyObj('FileService', {
      retrieveFileDownloadLink: null
    });
    TestBed.configureTestingModule({
      declarations: [ MetadataLinkViewAvatarPopoverComponent, SafeUrlPipe ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: FileService, useValue: fileService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataLinkViewAvatarPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set fallback image if no entity type', (done) => {
    component.ngOnInit();
    component.placeholderImageUrl$.subscribe((url) => {
      expect(url).toBe('assets/images/file-placeholder.svg');
      done();
    });
  });

  it('should set correct placeholder image based on entity type if image exists', (done) => {
    component.entityType = 'OrgUnit';
    component.ngOnInit();
    component.placeholderImageUrl$.subscribe((url) => {
      expect(url).toBe('assets/images/orgunit-placeholder.svg');
      done();
    });
  });

  it('should set correct fallback image if image does not exists', (done) => {
    component.entityType = 'missingEntityType';
    component.ngOnInit();
    component.placeholderImageUrl$.subscribe((url) => {
      expect(url).toBe('assets/images/file-placeholder.svg');
      done();
    });
  });
});
