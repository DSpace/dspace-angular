// Load the implementations that should be tested
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  mockSubmissionCollectionId,
  mockSubmissionId,
} from '../../../shared/mocks/submission.mock';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { SubmissionService } from '../../submission.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsDirective } from '../sections.directive';
import { SectionsService } from '../sections.service';
import { SectionsType } from '../sections-type';
import { SubmissionSectionContainerComponent } from './section-container.component';

const sectionState = {
  header: 'submit.progressbar.describe.stepone',
  config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/traditionalpageone',
  mandatory: true,
  sectionType: SectionsType.SubmissionForm,
  collapsed: false,
  enabled: true,
  data: {},
  errorsToShow:	[],
  serverValidationErrors:	[],
  isLoading: false,
  isValid: false,
} as any;

const sectionObject: SectionDataObject = {
  config:	'https://dspace7.4science.it/or2018/api/config/submissionforms/traditionalpageone',
  mandatory:	true,
  data:		{},
  errorsToShow:		[],
  serverValidationErrors:		[],
  header:	'submit.progressbar.describe.stepone',
  id:	'traditionalpageone',
  sectionType:	SectionsType.SubmissionForm,
};

describe('SubmissionSectionContainerComponent test suite', () => {

  let comp: SubmissionSectionContainerComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionContainerComponent>;

  const submissionServiceStub: SubmissionServiceStub = new SubmissionServiceStub();
  const sectionsServiceStub: SectionsServiceStub = new SectionsServiceStub();

  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;

  function init() {
    sectionsServiceStub.isSectionValid.and.returnValue(of(true));
    sectionsServiceStub.getSectionState.and.returnValue(of(sectionState));
    sectionsServiceStub.getShownSectionErrors.and.returnValue(of([]));
    submissionServiceStub.getActiveSectionId.and.returnValue(of('traditionalpageone'));
  }

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot(),
        SubmissionSectionContainerComponent,
        SectionsDirective,
        TestComponent,
      ],
      providers: [
        { provide: SectionsService, useValue: sectionsServiceStub },
        { provide: SubmissionService, useValue: submissionServiceStub },
        SubmissionSectionContainerComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;
    let html;

    // synchronous beforeEach
    beforeEach(() => {
      init();
      html = `
        <ds-submission-section-container [collectionId]="collectionId"
                                         [submissionId]="submissionId"
                                         [sectionData]="object"></ds-submission-section-container>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;

    });

    it('should create SubmissionSectionContainerComponent', inject([SubmissionSectionContainerComponent], (app: SubmissionSectionContainerComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    beforeEach(() => {
      init();
      fixture = TestBed.createComponent(SubmissionSectionContainerComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      comp.submissionId = submissionId;
      comp.collectionId = collectionId;
      comp.sectionData = sectionObject;

      spyOn(comp, 'getSectionContent');
      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should inject section properly', () => {
      spyOn(comp.sectionRef, 'isEnabled').and.returnValue(of(true));
      spyOn(comp.sectionRef, 'hasGenericErrors').and.returnValue(false);

      comp.ngOnInit();
      fixture.detectChanges();

      const section = fixture.debugElement.query(By.css('[id^=\'sectionContent_\']'));
      expect(comp.getSectionContent).toHaveBeenCalled();
      expect(section).not.toBeNull();
    });

    it('should call removeSection properly', () => {

      const mockEvent = jasmine.createSpyObj('event', {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      });
      spyOn(comp.sectionRef, 'removeSection');
      comp.removeSection(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(comp.sectionRef.removeSection).toHaveBeenCalledWith(submissionId, 'traditionalpageone');
    });

    it('should display generic section errors div', () => {
      let sectionErrorsDiv = fixture.debugElement.query(By.css('[id^=\'sectionGenericError_\']'));
      expect(sectionErrorsDiv).toBeNull();

      spyOn(comp.sectionRef, 'isEnabled').and.returnValue(of(true));
      spyOn(comp.sectionRef, 'hasGenericErrors').and.returnValue(true);

      comp.ngOnInit();
      fixture.detectChanges();

      sectionErrorsDiv = fixture.debugElement.query(By.css('[id^=\'sectionGenericError_\']'));
      expect(sectionErrorsDiv).not.toBeNull();
    });

    it('should display warning icon', () => {

      spyOn(comp.sectionRef, 'isEnabled').and.returnValue(of(true));
      spyOn(comp.sectionRef, 'isValid').and.returnValue(of(false));
      spyOn(comp.sectionRef, 'hasErrors').and.returnValue(false);

      comp.ngOnInit();
      fixture.detectChanges();

      const iconWarn = fixture.debugElement.query(By.css('i.text-warning'));
      const iconErr = fixture.debugElement.query(By.css('i.text-danger'));
      const iconSuccess = fixture.debugElement.query(By.css('i.text-success'));
      expect(iconWarn).not.toBeNull();
      expect(iconErr).toBeNull();
      expect(iconSuccess).toBeNull();
    });

    it('should display error icon', () => {

      spyOn(comp.sectionRef, 'isEnabled').and.returnValue(of(true));
      spyOn(comp.sectionRef, 'isValid').and.returnValue(of(false));
      spyOn(comp.sectionRef, 'hasErrors').and.returnValue(true);

      comp.ngOnInit();
      fixture.detectChanges();

      const iconWarn = fixture.debugElement.query(By.css('i.text-warning'));
      const iconErr = fixture.debugElement.query(By.css('i.text-danger'));
      const iconSuccess = fixture.debugElement.query(By.css('i.text-success'));
      expect(iconWarn).toBeNull();
      expect(iconErr).not.toBeNull();
      expect(iconSuccess).toBeNull();
    });

    it('should display success icon', () => {

      spyOn(comp.sectionRef, 'isEnabled').and.returnValue(of(true));
      spyOn(comp.sectionRef, 'isValid').and.returnValue(of(true));
      spyOn(comp.sectionRef, 'hasErrors').and.returnValue(false);

      comp.ngOnInit();
      fixture.detectChanges();

      const iconWarn = fixture.debugElement.query(By.css('i.text-warning'));
      const iconErr = fixture.debugElement.query(By.css('i.text-danger'));
      const iconSuccess = fixture.debugElement.query(By.css('i.text-success'));
      expect(iconWarn).toBeNull();
      expect(iconErr).toBeNull();
      expect(iconSuccess).not.toBeNull();
    });

  });
});

// declare a test component
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: ``,
  standalone: true,
  imports: [
    NgbModule,
  ],
})
class TestComponent {

  public collectionId = '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb';
  public submissionId = mockSubmissionId;
  public object = sectionObject;
}
