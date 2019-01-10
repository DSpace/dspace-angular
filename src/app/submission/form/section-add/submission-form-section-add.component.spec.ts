import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { SubmissionServiceStub } from '../../../shared/testing/submission-service-stub';
import { mockSubmissionCollectionId, mockSubmissionId } from '../../../shared/mocks/mock-submission';
import { SubmissionService } from '../../submission.service';
import { SubmissionFormSectionAddComponent } from './submission-form-section-add.component';
import { SectionsServiceStub } from '../../../shared/testing/sections-service-stub';
import { SectionsService } from '../../sections/sections.service';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service-stub';
import { HostWindowService } from '../../../shared/host-window.service';

const mockAvailableSections: any = [
  {
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/newsectionone',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.describe.newsectionone',
    id: 'newsectionone',
    sectionType: 'submission-form'
  },
  {
    config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/newsectiontwo',
    mandatory: true,
    data: {},
    errors: [],
    header: 'submit.progressbar.describe.newsectiontwo',
    id: 'newsectiontwo',
    sectionType: 'submission-form'
  }
];

describe('SubmissionFormFooterComponent Component', () => {

  let comp: SubmissionFormSectionAddComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionFormSectionAddComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let sectionsServiceStub: SectionsServiceStub;

  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;

  const store: any = jasmine.createSpyObj('store', {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select')
  });

  const window = new HostWindowServiceStub(800);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [SubmissionFormSectionAddComponent],
      providers: [
        { provide: HostWindowService, useValue: window },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: Store, useValue: store },
        ChangeDetectorRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionFormSectionAddComponent);
    comp = fixture.componentInstance;
    compAsAny = comp;
    submissionServiceStub = TestBed.get(SubmissionService);
    sectionsServiceStub = TestBed.get(SectionsService);
    comp.submissionId = submissionId;
    comp.collectionId = collectionId;

  });

  afterEach(() => {
    comp = null;
    compAsAny = null;
    fixture = null;
    submissionServiceStub = null;
    sectionsServiceStub = null;
  });

  it('should init sectionList properly', () => {
    submissionServiceStub.getDisabledSectionsList.and.returnValue(observableOf(mockAvailableSections));

    fixture.detectChanges();

    comp.sectionList.subscribe((list) => {
      expect(list).toEqual(mockAvailableSections);
    })

  });

  it('should call addSection', () => {
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

      expect(dropdowBtn).not.toBeUndefined();
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
