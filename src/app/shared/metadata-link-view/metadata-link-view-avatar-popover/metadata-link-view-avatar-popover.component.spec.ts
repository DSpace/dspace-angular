/* tslint:disable:no-unused-variable */
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FileService } from '../../../core/shared/file.service';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { MetadataLinkViewAvatarPopoverComponent } from './metadata-link-view-avatar-popover.component';

describe('MetadataLinkViewAvatarPopoverComponent', () => {
  let component: MetadataLinkViewAvatarPopoverComponent;
  let fixture: ComponentFixture<MetadataLinkViewAvatarPopoverComponent>;
  let authService;
  let authorizationService;
  let fileService;

  beforeEach(async(() => {
    authService = jasmine.createSpyObj('AuthService', {
      isAuthenticated: observableOf(true),
    });
    authorizationService = jasmine.createSpyObj('AuthorizationService', {
      isAuthorized: observableOf(true),
    });
    fileService = jasmine.createSpyObj('FileService', {
      retrieveFileDownloadLink: null,
    });
    TestBed.configureTestingModule({
      imports: [MetadataLinkViewAvatarPopoverComponent],
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
});
