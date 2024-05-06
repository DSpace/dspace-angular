import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { HostWindowService } from '../../../shared/host-window.service';
import {
  mockSubmissionCollectionId,
  mockSubmissionId,
} from '../../../shared/mocks/submission.mock';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { SectionsService } from '../../sections/sections.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionFormSectionAddComponent } from './submission-form-section-add.component';

const mockAvailableSections: any = [
  {
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/newsectionone',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.describe.newsectionone',
    id: 'newsectionone',
    sectionType: 'submission-form',
  },
  {
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/newsectiontwo',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.describe.newsectiontwo',
    id: 'newsectiontwo',
    sectionType: 'submission-form',
  },
];

describe('SubmissionFormSectionAddComponent Component', () => {

  let comp: SubmissionFormSectionAddComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionFormSectionAddComponent>;
  let sectionsServiceStub: SectionsServiceStub;

  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;
  const submissionServiceStub: SubmissionServiceStub = new SubmissionServiceStub();
  const store: any = jasmine.createSpyObj('store', {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select'),
  });

  const window = new HostWindowServiceStub(800);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot(),
        SubmissionFormSectionAddComponent,
        TestComponent,
      ],
      providers: [
        { provide: HostWindowService, useValue: window },
        { provide: SubmissionService, useValue: submissionServiceStub },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: Store, useValue: store },
        ChangeDetectorRef,
        SubmissionFormSectionAddComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      submissionServiceStub.getDisabledSectionsList.and.returnValue(observableOf([]));
      const html = `
        <ds-submission-form-section-add [collectionId]="collectionId"
                                        [submissionId]="submissionId">
        </ds-submission-form-section-add>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    afterEach(() => {
      testFixture.destroy();
      testFixture.debugElement.nativeElement.remove();
    });

    it('should create SubmissionFormSectionAddComponent', inject([SubmissionFormSectionAddComponent], (app: SubmissionFormSectionAddComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionFormSectionAddComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      sectionsServiceStub = TestBed.inject(SectionsService as any);
      comp.submissionId = submissionId;
      comp.collectionId = collectionId;

    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture = null;
      sectionsServiceStub = null;
    });

    it('should init sectionList properly', () => {
      submissionServiceStub.getDisabledSectionsList.and.returnValue(observableOf(mockAvailableSections));

      fixture.detectChanges();

      comp.sectionList$.subscribe((list) => {
        expect(list).toEqual(mockAvailableSections);
      });

      comp.hasSections$.subscribe((hasSections) => {
        expect(hasSections).toEqual(true);
      });
    });

    it('should call addSection', () => {
      submissionServiceStub.getDisabledSectionsList.and.returnValue(observableOf(mockAvailableSections));

      comp.addSection(mockAvailableSections[1].id);

      fixture.detectChanges();

      expect(sectionsServiceStub.addSection).toHaveBeenCalledWith(submissionId, mockAvailableSections[1].id);

    });

    describe('', () => {
      let dropdowBtn: DebugElement;
      let dropdownMenu: DebugElement;

      beforeEach(() => {

        submissionServiceStub.getDisabledSectionsList.and.returnValue(observableOf(mockAvailableSections));
        comp.ngOnInit();
        fixture.detectChanges();
        dropdowBtn = fixture.debugElement.query(By.css('#sectionControls'));
        dropdownMenu = fixture.debugElement.query(By.css('.sections-dropdown-menu'));
      });

      it('should have dropdown menu closed', () => {

        expect(dropdowBtn).not.toBeNull();
        expect(dropdownMenu.nativeElement.classList).not.toContain('show');

      });

      it('should display dropdown menu when click on dropdown button', fakeAsync(() => {

        dropdowBtn.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(dropdownMenu.nativeElement.classList).toContain('show');

          expect(dropdownMenu.queryAll(By.css('.dropdown-item')).length).toBe(2);
        });

      }));

      it('should trigger onSelect method when select a new collection from dropdown menu', fakeAsync(() => {
        spyOn(comp, 'addSection');
        dropdowBtn.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        const secondLink: DebugElement = dropdownMenu.query(By.css('.dropdown-item:nth-child(2)'));
        secondLink.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        fixture.whenStable().then(() => {

          expect(comp.addSection).toHaveBeenCalled();
        });

      }));
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [NgbModule],
})
class TestComponent {

  collectionId = mockSubmissionCollectionId;
  submissionId = mockSubmissionId;

}
