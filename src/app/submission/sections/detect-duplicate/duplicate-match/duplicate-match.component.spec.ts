import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';

import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DuplicateMatchComponent } from './duplicate-match.component';
import { SubmissionServiceStub } from '../../../../shared/testing/submission-service.stub';
import { SubmissionService } from '../../../submission.service';
import { SectionsService } from '../../sections.service';
import { SectionsServiceStub } from '../../../../shared/testing/sections-service.stub';
import { DetectDuplicateService } from '../detect-duplicate.service';
import { getMockDetectDuplicateService } from '../../../../shared/mocks/mock-detect-duplicate-service';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionScopeType } from '../../../../core/submission/submission-scope-type';
import { DetectDuplicateMatch } from '../../../../core/submission/models/workspaceitem-section-deduplication.model';
import { DuplicateDecisionType } from '../models/duplicate-decision-type';
import { DuplicateDecision } from '../models/duplicate-decision.model';
import { createTestComponent } from '../../../../shared/testing/utils.test';
import { provideMockStore } from '@ngrx/store/testing';

const metadata = [
  {
    key: 'dc.contributor.author',
    value: 'DAENEN, Michael',
    language: null,
    authority: 'rp02165',
    confidence: 400
  }, {
    key: 'dc.contributor.author',
    value: 'ZHANG, Xiaowang',
    language: null,
    authority: 'rp01733',
    confidence: 400
  }, {
    key: 'dc.contributor.author',
    value: 'Erni, Rolf',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.contributor.author',
    value: 'WILLIAMS, Oliver',
    language: null,
    authority: 'rp01028',
    confidence: 500
  }, {
    key: 'dc.contributor.author',
    value: 'HARDY, An',
    language: null,
    authority: 'rp02004',
    confidence: 500
  }, {
    key: 'dc.contributor.author',
    value: 'VAN BAEL, Marlies',
    language: null,
    authority: 'rp01865',
    confidence: 500
  }, {
    key: 'dc.contributor.author',
    value: 'WAGNER, Patrick',
    language: null,
    authority: 'rp00839',
    confidence: 400
  }, {
    key: 'dc.contributor.author',
    value: 'HAENEN, Ken',
    language: null,
    authority: 'rp00770',
    confidence: 500
  }, {
    key: 'dc.contributor.author',
    value: 'NESLADEK, Milos',
    language: null,
    authority: 'rp00350',
    confidence: 500
  }, {
    key: 'dc.contributor.author',
    value: 'Van Tendeloo, Gustaaf',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.date.issued',
    value: '182400',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.issn',
    value: '09359648',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.issn',
    value: '15214095',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.description.abstract',
    value: 'The diamond nucleation step is critical for the chemical vapor deposition (CVD) of diamond on non-diamond substrates, i.e., for heteroepitaxial as well as polycrystalline growth on non-diamond (foreign) substrates. This process has been studied intensively over the past 20 years. [1-8] In general, diamond CVD growth on foreign substrates requires artificial formation of diamond nucleation sites on the substrate\'s surface. The high surface energy of diamond, [9] usually prevents direct, heterogeneous diamond nucleation from the gas phase, hence diamond growth cannot be initiated without this critical nucleation step. [5,8] As for the subsequently occurring diamond growth, it is assumed that atomic hydrogen is the only essential mediator required for stabilizing the diamond phase. Nonetheless, it was recently suggested that diamond can also grow in bulk, i.e., in a solid state environment, such as the sub-surface of silicon, if carbon atoms are sub-implanted by low energetic beams and transformed into diamond grains. [10,11] In this communication, we show that diffusion based transport of carbon atoms from diamond seeds through an interlayer is yet another mechanism by which diamond nuclei can be formed. This process opens further possibilities for the LPLTgrowth of synthetic diamond on a variety of substrates and gives access to new applications for nanocrystal-line diamonds (NCD), where diamond-like carbon and amorphous carbon are already applicable. [12] Carbon transport and subsequently occurring sp 3 bonded carbon cluster formation originates from dissolving so-called ultra-dispersed nanodia-mond particles (UDDs) of 5-10 nm size, which are readily prepared in form of a monolayer beneath a TiO 2 sol-gel thin film on silicon substrate surfaces. [13] Being able to also initiate diamond nucleation, UDDs have become a commonly used tool for CDV diamond seeding and initiation of CVD growth. [14] UDD seeding does not require additional diamond nucleation since the diamond film can grow epitaxially on the UDD grains during the CVD process, which leads to ultra-thin films (30-50 nm) with full surface coverage. In this work NCD film nucleation and growth were studied using UDD particles that are buried under a sol-gel TiO 2 layer spin-coated on UDD seeded silicon substrates. It was observed that when immersed in a conventional H 2 /CH 4 microwave plasma that is commonly used for CVD diamond growth, a partial dissolution of the UDD grain into the TiO 2 occurs. Subsequent carbon diffusion through the 5-10 nm thick TiO 2 layer leads to growth and transformation of the carbon atoms into sp 3 bonded clusters, i.e., diamond nuclei. This was studied by high-resolution transmission electron microscopy (HRTEM), energy-filtered TEM (EFTEM), and electron energy loss spectroscopy (EELS). In order to elucidate the diamond nucleation process in more detail, different sample preparation methods were used, three of which are depicted schematically in the insets of Figure 1 and Figure 2. The first method (method I), inset in Figure 1a, shows a TiO 2 layer deposited by sol-gel technique on a bare Si substrate. The TiO 2 precursor solution contained UDD particles in the mixture. Due to the very low thickness of the TiO 2 interlayer, the time that is required for carbon-saturation of the layer should be very short when exposed to the H 2 /CH 4 plasma during the microwave plasma enhanced CVD (MW PE CVD) process. [15,16] However, due to a too low UDD concentration used in the TiO 2 precursor solution and problems experienced with the homogenous dispersion of the powder, no homogeneous film was obtained after 60 min of CVD growth. Specifically, it appears that the UDD particles float on top of the precursor material and cluster together. This leads, after the formation of the sol-gel layer, to the creation of areas with no seeds and areas with seeds floating on top, as shown in Figure 1a. Furthermore, Figure 1b indicates that no diamond film growth takes place where no diamond seeds were present prior to the growth process, hence proving the necessity of UDD pre-treatment of the TiO 2 coated Si substrates. If no UDD seeding is used at all (method II), i.e., bare TiO 2 is deposited directly onto the Si substrate as shown schematically in COMMUNICATION www.advmat.de',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.description.abstract',
    value: 'Diamond nucleation and growth can occur by diffusion of carbon from buried ultradispersed diamond seeds on a silicon substrate through a titanium oxide interlayer. This knowledge can improve nucleation and adhesion of thin diamond films on various substrates.',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.language.iso',
    value: 'English',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.publisher',
    value: 'WILEY-BLACKWELL',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.subject.other',
    value: 'B-NCD-layer',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.subject.other',
    value: 'PID-control',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.subject.other',
    value: 'temperature regulator',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.title',
    value: 'Diamond Mono-Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.type',
    value: 'journal_article',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.epage',
    value: '673',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.issue',
    value: '6',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.spage',
    value: '670',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.volume',
    value: '21',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'local.publisher.place',
    value: 'COMMERCE PLACE, 350 MAIN ST, MALDEN 02148, MA USA',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.doi',
    value: '10.1002/pssa.201000291',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.isi',
    value: 'WOS:000263492000007',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'local.provider.type',
    value: 'Pdf',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.identifier.eissn',
    value: '1521-4095',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'dc.source.type',
    value: 'Article',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'local.bibliographicCitation.jtitle',
    value: 'Advanced Materials',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'item.accessRights',
    value: 'Open Access',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'item.fulltext',
    value: 'With Fulltext',
    language: null,
    authority: null,
    confidence: -1
  }, {
    key: 'item.fullcitation',
    value: 'DAENEN, Michael; ZHANG, Xiaowang; Erni, Rolf; WILLIAMS, Oliver; HARDY, An; VAN BAEL, Marlies; WAGNER, Patrick; HAENEN, Ken; NESLADEK, Milos & Van Tendeloo, Gustaaf (182400) Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites.',
    language: null,
    authority: null,
    confidence: -1
  }];
const matchWorkflowMock: DetectDuplicateMatch = {
  submitterDecision: null,
  workflowDecision: 'reject',
  adminDecision: null,
  submitterNote: null,
  workflowNote: 'dummy-note',
  matchObject: {
    id: '78ca1d06-cce7-4ee9-abda-46440d9b0bb7',
    uuid: '78ca1d06-cce7-4ee9-abda-46440d9b0bb7',
    name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
    handle: null,
    metadata: metadata,
    inArchive: false,
    discoverable: true,
    withdrawn: false,
    lastModified: '2019-11-21T16:16:02.300+0000',
    type: 'item'
  }
} as any;
const matchWorkspaceMock: DetectDuplicateMatch = {
  submitterDecision: 'reject',
  workflowDecision: null,
  adminDecision: null,
  submitterNote: 'dummy-note',
  workflowNote: null,
  matchObject: {
    id: '78ca1d06-cce7-4ee9-abda-46440d9b0bb7',
    uuid: '78ca1d06-cce7-4ee9-abda-46440d9b0bb7',
    name: 'Diamond Nucleation by Carbon Transport from Buried Nanodiamond TiO2Sol-Gel Composites',
    handle: null,
    metadata: metadata,
    inArchive: false,
    discoverable: true,
    withdrawn: false,
    lastModified: '2019-11-21T16:16:02.300+0000',
    type: 'item'
  }
} as any;

describe('DuplicateMatchComponent test suite', () => {
  let comp: DuplicateMatchComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<DuplicateMatchComponent>;
  let de: DebugElement;
  let submissionServiceStub: any;
  let modalService: any;
  let formBuilder: FormBuilder;
  let operationsBuilder: JsonPatchOperationsBuilder;
  const initialState = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        DuplicateMatchComponent,
        TestComponent,
      ],
      providers: [
        { provide: DetectDuplicateService, useClass: getMockDetectDuplicateService },
        FormBuilder,
        NgbModal,
        JsonPatchOperationsBuilder,
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        provideMockStore({ initialState }),
        DuplicateMatchComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-duplicate-match [match]="match"></ds-duplicate-match>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('Should create DuplicateMatchComponent', inject([DuplicateMatchComponent], (app: DuplicateMatchComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DuplicateMatchComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.inject(SubmissionService);
      comp.sectionId = 'dummy-section-id';
      comp.itemId = 'dummy-item-id';
      comp.submissionId = 'dumy-submission-id';
      comp.index = 'dummy-index';
      modalService = TestBed.inject(NgbModal);
      formBuilder = TestBed.inject(FormBuilder);
      operationsBuilder = TestBed.inject(JsonPatchOperationsBuilder);
      compAsAny.sectionService.isSectionActive.and.returnValue(observableOf(true));
      spyOn(modalService, 'open').and.returnValue({ dismiss: () => true });
      spyOn(operationsBuilder, 'add');
      de = fixture.debugElement;
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture.destroy();
    });

    it('Should init section properly - with workflow', () => {
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkflowItem);
      comp.match = matchWorkflowMock;

      fixture.detectChanges();
      const button = de.query(By.css('.btn'));
      expect(button).not.toBeNull();
      expect(comp.decisionType).toEqual(DuplicateDecisionType.WORKFLOW);
      expect(comp.hasDecision).toBeTrue();
      expect(comp.submitterNote).toBeUndefined();
      expect(comp.decisionLabelClass).toEqual('badge-light');
    });

    it('Should init section properly - with workspace', () => {
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkspaceItem);
      comp.match = matchWorkspaceMock;

      fixture.detectChanges();
      expect(comp.decisionType).toEqual(DuplicateDecisionType.WORKSPACE);
      expect(comp.hasDecision).toBeTrue();
      expect(comp.submitterNote).toEqual(comp.match.submitterNote);
      expect(comp.decisionLabelClass).toEqual('badge-success');
    });

    describe('', () => {
      beforeEach(() => {
        compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkspaceItem);
        comp.match = matchWorkspaceMock;
        spyOn(compAsAny, 'dispatchAction').and.callThrough();
        fixture.detectChanges();
      });

      it('processingVerify should always an observable of true', () => {
        comp.openModal({});
        comp.setAsDuplicate();
        expect(comp.processingVerify).toBeObservable(cold('(a|)', {
          a: true
        }));
      });

      it('modalRef.dismiss() should always be called', () => {
        comp.openModal({});
        comp.setAsDuplicate();
        expect(comp.modalRef.dismiss()).toBeTrue();
      });

      it('dispatchAction, in setAsDuplicate should be called with \'verify\', and \'WORKSPACE\'', () => {
        // set FormControl values
        comp.rejectForm.controls.reason.setValue('Dummy Reason');
        const decision = new DuplicateDecision(
          'verify',
          DuplicateDecisionType.WORKSPACE,
          'Dummy Reason');
        comp.modalRef = modalService.open('ok');
        spyOn(comp.modalRef, 'dismiss');

        comp.setAsDuplicate();

        expect(compAsAny.dispatchAction).toHaveBeenCalledWith(decision);
        expect(comp.modalRef.dismiss).toHaveBeenCalled();
      });

      it('processingReject should always be an observable of true', () => {
        comp.setAsNotDuplicate();
        expect(comp.processingReject).toBeObservable(cold('(a|)', {
          a: true
        }));
      });

      it('dispatchAction, in setAsNotDuplicate, should be called with \'reject\', and \'WORKSPACE\'', () => {
        const decision = new DuplicateDecision(
          'reject',
          DuplicateDecisionType.WORKSPACE);

        comp.setAsNotDuplicate();
        expect(compAsAny.dispatchAction).toHaveBeenCalledWith(decision);
      });

      it('dispatchAction, in clearDecision, should be called with blank, and \'WORKFLOW\'', () => {
        const decision = new DuplicateDecision(
          '',
          DuplicateDecisionType.WORKSPACE);

        comp.clearDecision();
        expect(compAsAny.dispatchAction).toHaveBeenCalledWith(decision);

      });
    });

    it('rejectForm.reset should be called by openModal', () => {
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkflowItem);
      comp.match = matchWorkflowMock;

      fixture.detectChanges();
      spyOn(comp.rejectForm, 'reset').and.callThrough();

      comp.openModal({});
      expect(comp.rejectForm.reset).toHaveBeenCalled();
    });

    it('should not show any decision buttons when ready-only is true', () => {
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkflowItem);
      comp.match = matchWorkflowMock;
      comp.readOnly = true;
      fixture.detectChanges();
      const button = de.query(By.css('.btn'));
      expect(button).toBeNull();
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {
  match = matchWorkflowMock;
}
