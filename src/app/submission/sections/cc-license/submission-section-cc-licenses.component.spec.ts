import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { JsonPatchOperationsBuilder } from '@dspace/core/json-patch/builder/json-patch-operations-builder';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { SUBMISSION_CC_LICENSE } from '@dspace/core/submission/models/submission-cc-licence.resource-type';
import { SubmissionCcLicence } from '@dspace/core/submission/models/submission-cc-license.model';
import { SectionsType } from '@dspace/core/submission/sections-type';
import { SubmissionCcLicenseDataService } from '@dspace/core/submission/submission-cc-license-data.service';
import { SubmissionCcLicenseUrlDataService } from '@dspace/core/submission/submission-cc-license-url-data.service';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { FormBuilderService } from 'src/app/shared/form/builder/form-builder.service';

import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SubmissionSectionCcLicensesComponent } from './submission-section-cc-licenses.component';

describe('SubmissionSectionCcLicensesComponent', () => {

  let component: SubmissionSectionCcLicensesComponent;
  let fixture: ComponentFixture<SubmissionSectionCcLicensesComponent>;
  let de: DebugElement;

  const sectionObject: SectionDataObject = {
    config: 'test config',
    mandatory: true,
    data: {},
    errorsToShow: [],
    serverValidationErrors: [],
    header: 'test header',
    id: 'test section id',
    sectionType: SectionsType.SubmissionForm,
  };

  const submissionCcLicenses: SubmissionCcLicence[] = [
    {
      id: 'test license id 1',
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
      id: 'test license id 2',
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
              description: 'test enum description 2a I',
            },
            {
              id: 'test enum id 2a II',
              label: 'test enum label 2a II',
              description: 'test enum description 2a II',
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
              description: 'test enum description 2b I',
            },
            {
              id: 'test enum id 2b II',
              label: 'test enum label 2b II',
              description: 'test enum description 2b II',
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

  const submissionCcLicensesDataService = jasmine.createSpyObj('submissionCcLicensesDataService', {
    findAll: createSuccessfulRemoteDataObject$(createPaginatedList(submissionCcLicenses)),
  });

  const submissionCcLicenseUrlDataService = jasmine.createSpyObj('submissionCcLicenseUrlDataService', {
    getCcLicenseLink: createSuccessfulRemoteDataObject$(
      {
        url: 'test cc license link',
      },
    ),
  });

  const sectionService = {
    getSectionState: () => {
      return of({});
    },
    setSectionStatus: () => undefined,
    updateSectionData: (submissionId, sectionId, updatedData) => {
      component.sectionData.data = updatedData;
    },
  };

  const operationsBuilder = jasmine.createSpyObj('operationsBuilder', {
    add: undefined,
    remove: undefined,
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({
      ... new ConfigurationProperty(),
      name: 'cc.license.jurisdiction',
      values: ['mock-jurisdiction-value'],
    }),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SubmissionSectionCcLicensesComponent,
      ],
      providers: [
        { provide: SubmissionCcLicenseDataService, useValue: submissionCcLicensesDataService },
        { provide: SubmissionCcLicenseUrlDataService, useValue: submissionCcLicenseUrlDataService },
        { provide: SectionsService, useValue: sectionService },
        { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: 'collectionIdProvider', useValue: 'test collection id' },
        { provide: 'sectionDataProvider', useValue: Object.assign({}, sectionObject) },
        { provide: 'submissionIdProvider', useValue: 'test submission id' },
        { provide: FormBuilderService, useValue: {} },
      ],
    })
      .overrideComponent(SubmissionSectionCcLicensesComponent, {
        remove: {
          imports:[
            ThemedLoadingComponent,
          ],
        },
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
      de.query(By.css('.ccLicense-select .scrollable-menu button:nth-child(1)')).nativeElement.innerText,
    ).toContain('test license name 1');
    expect(
      de.query(By.css('.ccLicense-select .scrollable-menu button:nth-child(2)')).nativeElement.innerText,
    ).toContain('test license name 2');
  });

  describe('when a license is selected', () => {

    const ccLicence = submissionCcLicenses[1];

    beforeEach(() => {
      component.selectCcLicense(ccLicence);
      fixture.detectChanges();
    });

    it('should display the selected cc license', () => {
      expect(component.selectedCcLicense.name).toContain('test license name 2');
    });

    it('should display all field labels of the selected cc license only', () => {
      expect(de.query(By.css('div.test-field-id-1a'))).toBeNull();
      expect(de.query(By.css('div.test-field-id-1b'))).toBeNull();
      expect(de.query(By.css('div.test-field-id-2a'))).toBeTruthy();
      expect(de.query(By.css('div.test-field-id-2b'))).toBeTruthy();
    });

    it('should not display a cc license link', () => {
      expect(de.query(By.css('.license-link'))).toBeNull();
    });

    it('should have section status incomplete', () => {
      component.required$.next(true);
      expect(component.getSectionStatus()).toBeObservable(cold('(a)', { a: false }));
    });

    describe('when all options have a value selected', () => {

      beforeEach(() => {
        component.selectOption(ccLicence, ccLicence.fields[0], ccLicence.fields[0].enums[1]);
        component.selectOption(ccLicence, ccLicence.fields[1], ccLicence.fields[1].enums[0]);
        fixture.detectChanges();
      });

      it('should call the submission cc licenses data service getCcLicenseLink method', () => {
        expect(submissionCcLicenseUrlDataService.getCcLicenseLink).toHaveBeenCalledWith(
          ccLicence,
          new Map([
            [ccLicence.fields[0], ccLicence.fields[0].enums[1]],
            [ccLicence.fields[1], ccLicence.fields[1].enums[0]],
          ]),
        );
      });

      it('should display a cc license link', () => {
        expect(de.query(By.css('.license-link'))).toBeTruthy();
      });

      it('should not be accepted', () => {
        expect(component.accepted).toBeFalse();
      });

      it('should have section status incomplete', () => {
        component.required$.next(true);
        expect(component.getSectionStatus()).toBeObservable(cold('(a)', { a: false }));
      });

      it('should have section status complete if not required', () => {
        component.required$.next(false);
        expect(component.getSectionStatus()).toBeObservable(cold('(a)', { a: true }));
      });

      describe('when the cc license is accepted', () => {

        beforeEach(() => {
          component.setAccepted(true);
          fixture.detectChanges();
        });

        it('should have section status complete', () => {
          component.required$.next(false);
          expect(component.getSectionStatus()).toBeObservable(cold('(a)', { a: true })); // first true is because the section is not required
        });
      });
    });
  });

  describe('when a license uri is stored', () => {

    const enumOption = (id: string) => ({ id, label: id, description: id });
    const _links = { self: { href: 'test link' } };
    const cc30: SubmissionCcLicence = {
      id: 'cc30',
      type: SUBMISSION_CC_LICENSE,
      name: 'Creative Commons License (3.0)',
      fields: [
        { id: 'commercial', label: 'commercial', description: '', enums: [enumOption('y'), enumOption('n')] },
        { id: 'derivatives', label: 'derivatives', description: '', enums: [enumOption('y'), enumOption('sa'), enumOption('n')] },
        { id: 'jurisdiction', label: 'jurisdiction', description: '', enums: [enumOption(''), enumOption('us')] },
      ],
      _links,
    };
    const cc40: SubmissionCcLicence = {
      id: 'cc40',
      type: SUBMISSION_CC_LICENSE,
      name: 'Creative Commons License (4.0)',
      fields: [
        { id: 'commercial', label: 'commercial', description: '', enums: [enumOption('y'), enumOption('n')] },
        { id: 'derivatives', label: 'derivatives', description: '', enums: [enumOption('y'), enumOption('sa'), enumOption('n')] },
      ],
      _links,
    };
    const cc0: SubmissionCcLicence = { id: 'cc0', type: SUBMISSION_CC_LICENSE, name: 'CC0 1.0 Universal', fields: [], _links };
    const mark: SubmissionCcLicence = { id: 'mark', type: SUBMISSION_CC_LICENSE, name: 'Public Domain Mark 1.0 Universal', fields: [], _links };

    const restore = (uri: string) => {
      component.submissionCcLicenses = [cc30, cc40, cc0, mark];
      component.sectionData.data = { uri };
      (component as any).restoreSelectionFromStoredUri();
    };

    it('should restore a CC 4.0 license with its options', () => {
      restore('https://creativecommons.org/licenses/by-nc-sa/4.0/');
      expect(component.data.ccLicense.id).toEqual('cc40');
      expect(component.data.ccLicense.fields.commercial.id).toEqual('n');
      expect(component.data.ccLicense.fields.derivatives.id).toEqual('sa');
      expect(component.data.uri).toEqual('https://creativecommons.org/licenses/by-nc-sa/4.0/');
    });

    it('should restore a CC 3.0 license with its jurisdiction', () => {
      restore('https://creativecommons.org/licenses/by-nd/3.0/us/');
      expect(component.data.ccLicense.id).toEqual('cc30');
      expect(component.data.ccLicense.fields.commercial.id).toEqual('y');
      expect(component.data.ccLicense.fields.derivatives.id).toEqual('n');
      expect(component.data.ccLicense.fields.jurisdiction.id).toEqual('us');
    });

    it('should distinguish public domain licenses with the same version', () => {
      restore('https://creativecommons.org/publicdomain/mark/1.0/');
      expect(component.data.ccLicense.id).toEqual('mark');
      restore('https://creativecommons.org/publicdomain/zero/1.0/');
      expect(component.data.ccLicense.id).toEqual('cc0');
    });

    it('should leave an unknown uri untouched', () => {
      restore('https://example.org/my-license');
      expect(component.data.ccLicense).toBeUndefined();
      expect(component.accepted).toBeTrue();
    });

    it('should not override an existing selection', () => {
      component.submissionCcLicenses = [cc30, cc40, cc0, mark];
      component.sectionData.data = { uri: 'https://creativecommons.org/licenses/by/4.0/', ccLicense: { id: 'cc0', fields: {} } };
      (component as any).restoreSelectionFromStoredUri();
      expect(component.data.ccLicense.id).toEqual('cc0');
    });
  });
});
