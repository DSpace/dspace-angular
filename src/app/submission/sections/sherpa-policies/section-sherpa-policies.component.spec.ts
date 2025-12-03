import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { SherpaDataResponse } from '../../../shared/mocks/section-sherpa-policies.service.mock';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { SubmissionService } from '../../submission.service';
import { SectionsService } from '../sections.service';
import { MetadataInformationComponent } from './metadata-information/metadata-information.component';
import { PublicationInformationComponent } from './publication-information/publication-information.component';
import { PublisherPolicyComponent } from './publisher-policy/publisher-policy.component';
import { SubmissionSectionSherpaPoliciesComponent } from './section-sherpa-policies.component';

describe('SubmissionSectionSherpaPoliciesComponent', () => {
  let component: SubmissionSectionSherpaPoliciesComponent;
  let fixture: ComponentFixture<SubmissionSectionSherpaPoliciesComponent>;
  let de: DebugElement;

  const sectionsServiceStub = new SectionsServiceStub();

  const operationsBuilder = jasmine.createSpyObj('operationsBuilder', {
    add: undefined,
    remove: undefined,
    replace: undefined,
  });

  const sectionData = {
    header: 'submit.progressbar.sherpaPolicies',
    config: 'http://localhost:8080/server/api/config/submissionaccessoptions/SherpaPoliciesDefaultConfiguration',
    mandatory: true,
    sectionType: 'sherpaPolicies',
    collapsed: false,
    enabled: true,
    data: SherpaDataResponse,
    errorsToShow: [],
    serverValidationErrors: [],
    isLoading: false,
    isValid: true,
  };

  describe('SubmissionSectionSherpaPoliciesComponent', () => {

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          SubmissionSectionSherpaPoliciesComponent,
        ],
        providers: [
          { provide: SectionsService, useValue: sectionsServiceStub },
          { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
          { provide: SubmissionService, useClass: SubmissionServiceStub },
          { provide: 'sectionDataProvider', useValue: sectionData },
          { provide: 'submissionIdProvider', useValue: '1508' },
        ],
      }).overrideComponent(SubmissionSectionSherpaPoliciesComponent, {
        add: {
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
        remove: {
          imports: [
            MetadataInformationComponent,
            AlertComponent,
            PublisherPolicyComponent,
            PublicationInformationComponent,
          ],
        },
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionSherpaPoliciesComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      sectionsServiceStub.getSectionData.and.returnValue(of(SherpaDataResponse));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show refresh button', () => {
      expect(de.query(By.css('[data-test="refresh-btn"]'))).toBeTruthy();
    });

    it('should show publisher information', () => {
      expect(de.query(By.css('ds-publication-information'))).toBeTruthy();
    });

    it('should show publisher policy', () => {
      expect(de.query(By.css('ds-publisher-policy'))).toBeTruthy();
    });

    it('should show metadata information', () => {
      expect(de.query(By.css('ds-metadata-information'))).toBeTruthy();
    });

    it('when refresh button click operationsBuilder.remove should have been called', () => {
      de.query(By.css('[data-test="refresh-btn"]')).nativeElement.click();
      expect(operationsBuilder.remove).toHaveBeenCalled();
    });


  });

});
