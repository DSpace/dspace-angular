import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionSectionCcLicensesComponent } from './submission-section-cc-licenses.component';
import { SUBMISSION_CC_LICENSE } from '../../core/shared/submission-cc-licences.resource-type';
import { of as observableOf } from 'rxjs';
import { SubmissionCcLicensesDataService } from '../../core/data/submission-cc-licenses-data.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../shared.module';
import { SectionsService } from '../../submission/sections/sections.service';
import { SectionDataObject } from '../../submission/sections/models/section-data.model';
import { SectionsType } from '../../submission/sections/sections-type';
import { RemoteData } from '../../core/data/remote-data';
import { TranslateModule } from '@ngx-translate/core';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { SubmissionCcLicence } from '../../core/shared/submission-cc-license.model';
import { cold } from 'jasmine-marbles';

describe('SubmissionSectionCcLicensesComponent', () => {

  let component: SubmissionSectionCcLicensesComponent;
  let fixture: ComponentFixture<SubmissionSectionCcLicensesComponent>;
  let de: DebugElement;

  const sectionObject: SectionDataObject = {
    config: 'test config',
    mandatory: true,
    data: {},
    errors: [],
    header: 'test header',
    id: 'test section id',
    sectionType: SectionsType.SubmissionForm
  };

  const submissionCcLicenses: SubmissionCcLicence[] = [
    {
      type: SUBMISSION_CC_LICENSE,
      name: 'test license name 1',
      fields: [
        {
          id: 'test-field-id-1a',
          label: 'test field label 1a',
          description: 'test field description 1a',
          enums: [
            {
              id: 'test enum id 1a I',
              label: 'test enum label 1a I',
              description: 'test enum description 1a I',
            },
            {
              id: 'test enum id 1a II',
              label: 'test enum label 1a II',
              description: 'test enum description 1a II',
            },
          ],
        },
        {
          id: 'test-field-id-1b',
          label: 'test field label 1b',
          description: 'test field description 1b',
          enums: [
            {
              id: 'test enum id 1b I',
              label: 'test enum label 1b I',
              description: 'test enum description 1b I',
            },
            {
              id: 'test enum id 1b II',
              label: 'test enum label 1b II',
              description: 'test enum description 1b II',
            },
          ],
        },
      ],
      _links: {
        self: {
          href: 'test link',
        },
      },
    },
    {
      type: SUBMISSION_CC_LICENSE,
      name: 'test license name 2',
      fields: [
        {
          id: 'test-field-id-2a',
          label: 'test field label 2a',
          description: 'test field description 2a',
          enums: [
            {
              id: 'test enum id 2a I',
              label: 'test enum label 2a I',
              description: 'test enum description 2a I'
            },
            {
              id: 'test enum id 2a II',
              label: 'test enum label 2a II',
              description: 'test enum description 2a II'
            },
          ],
        },
        {
          id: 'test-field-id-2b',
          label: 'test field label 2b',
          description: 'test field description 2b',
          enums: [
            {
              id: 'test enum id 2b I',
              label: 'test enum label 2b I',
              description: 'test enum description 2b I'
            },
            {
              id: 'test enum id 2b II',
              label: 'test enum label 2b II',
              description: 'test enum description 2b II'
            },
          ],
        },
      ],
      _links: {
        self: {
          href: 'test link',
        },
      },
    },
  ];
  const submissionCcLicensesDataService = {
    findAll: () => observableOf(new RemoteData(
      false,
      false,
      true,
      undefined,
      new PaginatedList(new PageInfo(), submissionCcLicenses),
    )),
  };

  const sectionService = {
    getSectionState: () => observableOf(
      {
        data: {},
      }
    ),
    setSectionStatus: () => undefined,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        SubmissionSectionCcLicensesComponent,
      ],
      providers: [
        {provide: SubmissionCcLicensesDataService, useValue: submissionCcLicensesDataService},
        {provide: SectionsService, useValue: sectionService},
        {provide: 'collectionIdProvider', useValue: 'test collection id'},
        {provide: 'sectionDataProvider', useValue: sectionObject},
        {provide: 'submissionIdProvider', useValue: 'test submission id'},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSectionCcLicensesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should display a dropdown with the different cc licenses', () => {
    expect(
      de.query(By.css('.ccLicense-select ds-select .dropdown-menu button:nth-child(1)')).nativeElement.innerText
    ).toContain('test license name 1');
    expect(
      de.query(By.css('.ccLicense-select ds-select .dropdown-menu button:nth-child(2)')).nativeElement.innerText
    ).toContain('test license name 2');
  });

  describe('when a license is selected', () => {

    beforeEach(() => {
      component.select(submissionCcLicenses[1]);
      fixture.detectChanges();
    });

    it('should display the selected cc license', () => {
      expect(
        de.query(By.css('.ccLicense-select ds-select button.selection')).nativeElement.innerText
      ).toContain('test license name 2');
    });

    it('should display all field labels of the selected cc license only', () => {
      expect(de.query(By.css('div.test-field-id-1a'))).toBeNull();
      expect(de.query(By.css('div.test-field-id-1b'))).toBeNull();
      expect(de.query(By.css('div.test-field-id-2a'))).toBeTruthy();
      expect(de.query(By.css('div.test-field-id-2b'))).toBeTruthy();
    });

    it('should have section status incomplete', () => {
      expect(component.getSectionStatus()).toBeObservable(cold('(a|)', { a: false }));
    });

    describe('when all options have a value selected', () => {

      beforeEach(() => {
        const ccLicence = submissionCcLicenses[1];
        component.selectOption(ccLicence, ccLicence.fields[0].id, ccLicence.fields[0].enums[1].label);
        component.selectOption(ccLicence, ccLicence.fields[1].id, ccLicence.fields[1].enums[0].label);
        fixture.detectChanges();
      });

      it('should have section status complete', () => {
        expect(component.getSectionStatus()).toBeObservable(cold('(a|)', { a: true }));
      });
    });
  });
});
