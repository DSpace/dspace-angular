import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { PdfViewerService } from '../pdf-viewer-service/pdf-viewer-service';
import { PdfViewerEnableComponent } from './pdf-viewer-enable.component';

describe('PdfViewerEnableComponent', () => {
  let comp: PdfViewerEnableComponent;
  let fixture: ComponentFixture<PdfViewerEnableComponent>;

  let pdfViewerService: PdfViewerService;

  const dso = new DSpaceObject();

  beforeEach(waitForAsync(() => {
    pdfViewerService = jasmine.createSpyObj('pdfViewerService', {
      isViewerEnabled$: of(false),
      viewerAllowedForBitstreamFormat$: of(true),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: PdfViewerService, useValue: pdfViewerService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerEnableComponent);
    comp = fixture.componentInstance;
    comp.dso = dso;
    fixture.detectChanges();
  });


  describe('onInit', () => {
    it('should init the comp', () => {
      expect(comp).toBeTruthy();
    });
    it('should initialise observable that check whether the PDF viewer is enabled', (done) => {
      comp.isEnabled$.subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
    it('should initialise observable that check whether PDF viewer configuration is allowed', (done) => {
      comp.isViewerConfigAllowed$.subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });
  });
  describe('update', () => {
    it('should emit the provided boolean as a string value', () => {
      spyOn(comp.onChange, 'emit');

      comp.update(true);
      expect(comp.onChange.emit).toHaveBeenCalledWith('true');

      comp.update(false);
      expect(comp.onChange.emit).toHaveBeenCalledWith('false');
    });
  });
  describe('form', () => {
    it('should display the ui-switch and text span when configuration is allowed', () => {
      const uiSwitch = fixture.debugElement.queryAll(By.css('ui-switch'));
      const span = fixture.debugElement.queryAll(By.css('span'));

      expect(uiSwitch.length).toEqual(1);
      expect(span.length).toEqual(1);
    });
    it('should not display the ui-switch and text span when configuration is not allowed', () => {
      (pdfViewerService.viewerAllowedForBitstreamFormat$ as jasmine.Spy).and.returnValue(of(false));
      fixture.detectChanges();

      const uiSwitch = fixture.debugElement.queryAll(By.css('ui-switch'));
      const span = fixture.debugElement.queryAll(By.css('span'));

      expect(uiSwitch.length).toEqual(0);
      expect(span.length).toEqual(0);
    });
  });
});

