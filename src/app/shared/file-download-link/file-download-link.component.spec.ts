import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FileDownloadLinkComponent } from './file-download-link.component';
import { AuthService } from '../../core/auth/auth.service';
import { FileService } from '../../core/shared/file.service';
import { of as observableOf } from 'rxjs';
import { Bitstream } from '../../core/shared/bitstream.model';
import { By } from '@angular/platform-browser';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getBitstreamModuleRoute } from '../../app-routing-paths';

describe('FileDownloadLinkComponent', () => {
  let component: FileDownloadLinkComponent;
  let fixture: ComponentFixture<FileDownloadLinkComponent>;

  let authService: AuthService;
  let fileService: FileService;
  let bitstream: Bitstream;

  function init() {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true)
    });
    fileService = jasmine.createSpyObj('fileService', ['downloadFile']);
    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [FileDownloadLinkComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: FileService, useValue: fileService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadLinkComponent);
    component = fixture.componentInstance;
    component.bitstream = bitstream;
    fixture.detectChanges();
  });

  describe('init', () => {

    describe('getBitstreamPath', () => {
      it('should set the bitstreamPath based on the input bitstream', () => {
        expect(component.bitstreamPath).toEqual(new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString());
      });
    });

    it('should init the component', () => {
      const link = fixture.debugElement.query(By.css('a')).nativeElement;
      expect(link.href).toContain(new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString());
    });

  });
});
