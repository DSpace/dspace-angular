import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloadLinkComponent } from './file-download-link.component';
import { AuthService } from '../../core/auth/auth.service';
import { FileService } from '../../core/shared/file.service';
import { of as observableOf } from 'rxjs';

describe('FileDownloadLinkComponent', () => {
  let component: FileDownloadLinkComponent;
  let fixture: ComponentFixture<FileDownloadLinkComponent>;

  let authService: AuthService;
  let fileService: FileService;
  let href: string;

  function init() {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true)
    });
    fileService = jasmine.createSpyObj('fileService', ['downloadFile']);
    href = 'test-download-file-link';
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ FileDownloadLinkComponent ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: FileService, useValue: fileService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadLinkComponent);
    component = fixture.componentInstance;
    component.href = href;
    fixture.detectChanges();
  });

  describe('downloadFile', () => {
    let result;

    beforeEach(() => {
      result = component.downloadFile();
    });

    it('should call fileService.downloadFile with the provided href', () => {
      expect(fileService.downloadFile).toHaveBeenCalledWith(href);
    });

    it('should return false', () => {
      expect(result).toEqual(false);
    });
  });
});
