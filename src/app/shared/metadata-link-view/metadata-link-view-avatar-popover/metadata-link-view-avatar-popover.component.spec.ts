import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FileService } from '@dspace/core/shared/file.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { MetadataLinkViewAvatarPopoverComponent } from './metadata-link-view-avatar-popover.component';

describe('MetadataLinkViewAvatarPopoverComponent', () => {
  let component: MetadataLinkViewAvatarPopoverComponent;
  let fixture: ComponentFixture<MetadataLinkViewAvatarPopoverComponent>;
  let authService;
  let authorizationService;
  let fileService;

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('AuthService', {
      isAuthenticated: of(true),
    });
    authorizationService = jasmine.createSpyObj('AuthorizationService', {
      isAuthorized: of(true),
    });
    fileService = jasmine.createSpyObj('FileService', {
      retrieveFileDownloadLink: null,
    });

    TestBed.configureTestingModule({
      imports: [
        MetadataLinkViewAvatarPopoverComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: FileService, useValue: fileService },
      ],
    })
      .overrideComponent(MetadataLinkViewAvatarPopoverComponent, { remove: { imports: [ThemedLoadingComponent] } }).compileComponents();
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
