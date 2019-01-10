import { ChangeDetectorRef, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { SubmissionServiceStub } from '../../shared/testing/submission-service-stub';
import {
  mockSectionsData,
  mockSectionsList,
  mockSubmissionCollectionId,
  mockSubmissionDefinition,
  mockSubmissionId,
  mockSubmissionObject,
  mockSubmissionObjectNew,
  mockSubmissionSelfUrl,
  mockSubmissionState
} from '../../shared/mocks/mock-submission';
import { SubmissionService } from '../submission.service';
import { SubmissionFormComponent } from './submission-form.component';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { AuthServiceStub } from '../../shared/testing/auth-service-stub';
import { AuthService } from '../../core/auth/auth.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';

describe('SubmissionFormComponent Component', () => {

  let comp: SubmissionFormComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionFormComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let authServiceStub: AuthServiceStub;

  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;
  const submissionObjectNew: any = mockSubmissionObjectNew;
  const submissionDefinition: any = mockSubmissionDefinition;
  const submissionState: any = mockSubmissionState;
  const selfUrl: any = mockSubmissionSelfUrl;
  const sectionsList: any = mockSectionsList;
  const sectionsData: any = mockSectionsData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [SubmissionFormComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('workspaceitems') },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        ChangeDetectorRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionFormComponent);
    comp = fixture.componentInstance;
    compAsAny = comp;
    submissionServiceStub = TestBed.get(SubmissionService);
    authServiceStub = TestBed.get(AuthService);
  });

  afterEach(() => {
    comp = null;
    compAsAny = null;
    fixture = null;
  });

  it('should not has effect when collectionId and submissionId are undefined', () => {

    fixture.detectChanges();

    expect(compAsAny.isActive).toBeTruthy();
    expect(compAsAny.submissionSections).toBeUndefined();
    comp.loading.subscribe((loading) => {
      expect(loading).toBeTruthy();
    });

    expect(compAsAny.subs).toEqual([]);
    expect(submissionServiceStub.startAutoSave).not.toHaveBeenCalled();
  });

  it('should init properly when collectionId and submissionId are defined', () => {
    comp.collectionId = collectionId;
    comp.submissionId = submissionId;
    comp.submissionDefinition = submissionDefinition;
    comp.selfUrl = selfUrl;
    comp.sections = sectionsData;

    submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));
    submissionServiceStub.getSubmissionSections.and.returnValue(observableOf(sectionsList));
    spyOn(authServiceStub, 'buildAuthHeader').and.returnValue('token');

    comp.ngOnChanges({
      collectionId: new SimpleChange(null, collectionId, true),
      submissionId: new SimpleChange(null, submissionId, true)
    });
    fixture.detectChanges();

    comp.loading.subscribe((loading) => {
      expect(loading).toBeFalsy();
    });

    comp.submissionSections.subscribe((submissionSections) => {
      expect(submissionSections).toEqual(sectionsList);
    });

    expect(submissionServiceStub.dispatchInit).toHaveBeenCalledWith(
      collectionId,
      submissionId,
      selfUrl,
      submissionDefinition,
      sectionsData,
      null);
    expect(submissionServiceStub.startAutoSave).toHaveBeenCalled();
  });

  it('should update properly on collection change', () => {
    comp.collectionId = collectionId;
    comp.submissionId = submissionId;
    comp.submissionDefinition = submissionDefinition;
    comp.selfUrl = selfUrl;
    comp.sections = sectionsData;

    comp.onCollectionChange(submissionObjectNew);

    fixture.detectChanges();

    expect(comp.collectionId).toEqual(submissionObjectNew.collection.id);
    expect(comp.submissionDefinition).toEqual(submissionObjectNew.submissionDefinition);
    expect(comp.definitionId).toEqual(submissionObjectNew.submissionDefinition.name);
    expect(comp.sections).toEqual(submissionObjectNew.sections);

    expect(submissionServiceStub.resetSubmissionObject).toHaveBeenCalledWith(
      submissionObjectNew.collection.id,
      submissionId,
      selfUrl,
      submissionObjectNew.submissionDefinition,
      submissionObjectNew.sections);
  });

  it('should update only collection id on collection change when submission definition is not changed', () => {
    comp.collectionId = collectionId;
    comp.submissionId = submissionId;
    comp.definitionId = 'traditional';
    comp.submissionDefinition = submissionDefinition;
    comp.selfUrl = selfUrl;
    comp.sections = sectionsData;

    comp.onCollectionChange({
      collection: {
        id: '45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb'
      },
      submissionDefinition: {
        name: 'traditional'
      }
    } as  any);

    fixture.detectChanges();

    expect(comp.collectionId).toEqual('45f2f3f1-ba1f-4f36-908a-3f1ea9a557eb');
    expect(submissionServiceStub.resetSubmissionObject).not.toHaveBeenCalled()
  });
});
