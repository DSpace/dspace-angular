import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { ResearcherProfile } from '../../../core/profile/model/researcher-profile.model';
import { ResearcherProfileDataService } from '../../../core/profile/researcher-profile-data.service';
import { Item } from '../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { OrcidSyncSettingsComponent } from './orcid-sync-settings.component';

describe('OrcidSyncSettingsComponent test suite', () => {
  let comp: OrcidSyncSettingsComponent;
  let fixture: ComponentFixture<OrcidSyncSettingsComponent>;
  let scheduler: TestScheduler;
  let researcherProfileService: jasmine.SpyObj<ResearcherProfileDataService>;
  let notificationsService;
  let formGroup: UntypedFormGroup;

  const mockResearcherProfile: ResearcherProfile = Object.assign(new ResearcherProfile(), {
    id: 'test-id',
    visible: true,
    type: 'profile',
    _links: {
      item: {
        href: 'https://rest.api/rest/api/profiles/test-id/item',
      },
      self: {
        href: 'https://rest.api/rest/api/profiles/test-id',
      },
    },
  });

  const mockItemLinkedToOrcid: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: {
      'dc.title': [{
        value: 'test person',
      }],
      'dspace.entity.type': [{
        'value': 'Person',
      }],
      'dspace.object.owner': [{
        'value': 'test person',
        'language': null,
        'authority': 'deced3e7-68e2-495d-bf98-7c44fc33b8ff',
        'confidence': 600,
        'place': 0,
      }],
      'dspace.orcid.authenticated': [{
        'value': '2022-06-10T15:15:12.952872',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      }],
      'dspace.orcid.scope': [{
        'value': '/authenticate',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      }, {
        'value': '/read-limited',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 1,
      }, {
        'value': '/activities/update',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 2,
      }, {
        'value': '/person/update',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 3,
      }],
      'dspace.orcid.sync-mode': [{
        'value': 'MANUAL',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      }],
      'dspace.orcid.sync-profile': [{
        'value': 'BIOGRAPHICAL',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      }, {
        'value': 'IDENTIFIERS',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 1,
      }],
      'dspace.orcid.sync-publications': [{
        'value': 'ALL',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      }],
      'person.identifier.orcid': [{
        'value': 'orcid-id',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      }],
    },
  });

  beforeEach(waitForAsync(() => {
    researcherProfileService = jasmine.createSpyObj('researcherProfileService', {
      findByRelatedItem: jasmine.createSpy('findByRelatedItem'),
      patch: jasmine.createSpy('patch'),
    });

    void TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgbAccordionModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        RouterTestingModule.withRoutes([]),
        OrcidSyncSettingsComponent,
      ],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: ResearcherProfileDataService, useValue: researcherProfileService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(OrcidSyncSettingsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(OrcidSyncSettingsComponent);
    comp = fixture.componentInstance;
    researcherProfileService.findByRelatedItem.and.returnValue(createSuccessfulRemoteDataObject$(mockResearcherProfile));
    comp.item = mockItemLinkedToOrcid;
    fixture.detectChanges();
  }));

  it('should create cards properly', () => {
    const modes = fixture.debugElement.query(By.css('[data-test="sync-mode"]'));
    const publication = fixture.debugElement.query(By.css('[data-test="sync-mode-publication"]'));
    const funding = fixture.debugElement.query(By.css('[data-test="sync-mode-funding"]'));
    const preferences = fixture.debugElement.query(By.css('[data-test="profile-preferences"]'));
    expect(modes).toBeTruthy();
    expect(publication).toBeTruthy();
    expect(funding).toBeTruthy();
    expect(preferences).toBeTruthy();
  });

  it('should init sync modes properly', () => {
    expect(comp.currentSyncMode).toBe('MANUAL');
    expect(comp.currentSyncPublications).toBe('ALL');
    expect(comp.currentSyncFunding).toBe('DISABLED');
  });

  describe('form submit', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
      notificationsService = (comp as any).notificationsService;
      formGroup = new UntypedFormGroup({
        syncMode: new UntypedFormControl('MANUAL'),
        syncFundings: new UntypedFormControl('ALL'),
        syncPublications: new UntypedFormControl('ALL'),
        syncProfile_BIOGRAPHICAL: new UntypedFormControl(true),
        syncProfile_IDENTIFIERS: new UntypedFormControl(true),
      });
      spyOn(comp.settingsUpdated, 'emit');
    });

    it('should call updateByOrcidOperations properly', () => {
      researcherProfileService.patch.and.returnValue(createSuccessfulRemoteDataObject$(mockResearcherProfile));
      const expectedOps: Operation[] = [
        {
          path: '/orcid/mode',
          op: 'replace',
          value: 'MANUAL',
        }, {
          path: '/orcid/publications',
          op: 'replace',
          value: 'ALL',
        }, {
          path: '/orcid/fundings',
          op: 'replace',
          value: 'ALL',
        }, {
          path: '/orcid/profile',
          op: 'replace',
          value: 'BIOGRAPHICAL,IDENTIFIERS',
        },
      ];

      scheduler.schedule(() => comp.onSubmit(formGroup));
      scheduler.flush();

      expect(researcherProfileService.patch).toHaveBeenCalledWith(mockResearcherProfile, expectedOps);
    });

    it('should show notification on success', () => {
      researcherProfileService.patch.and.returnValue(createSuccessfulRemoteDataObject$(mockResearcherProfile));

      scheduler.schedule(() => comp.onSubmit(formGroup));
      scheduler.flush();

      expect(notificationsService.success).toHaveBeenCalled();
      expect(comp.settingsUpdated.emit).toHaveBeenCalled();
    });

    it('should show notification on error', () => {
      researcherProfileService.findByRelatedItem.and.returnValue(createFailedRemoteDataObject$());
      comp.item = mockItemLinkedToOrcid;
      fixture.detectChanges();

      scheduler.schedule(() => comp.onSubmit(formGroup));
      scheduler.flush();

      expect(notificationsService.error).toHaveBeenCalled();
      expect(comp.settingsUpdated.emit).not.toHaveBeenCalled();
    });

    it('should show notification on error', () => {
      researcherProfileService.patch.and.returnValue(createFailedRemoteDataObject$());

      scheduler.schedule(() => comp.onSubmit(formGroup));
      scheduler.flush();

      expect(notificationsService.error).toHaveBeenCalled();
      expect(comp.settingsUpdated.emit).not.toHaveBeenCalled();
    });
  });

});
