import { StoreModule } from '@ngrx/store';
import { async, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/timer'

import { MockRouter } from '../shared/mocks/mock-router';
import { SubmissionService } from './submission.service';
import { submissionReducers } from './submission.reducers';
import { SubmissionRestService } from './submission-rest.service';
import { RouteService } from '../shared/services/route.service';
import { SubmissionRestServiceStub } from '../shared/testing/submission-rest-service-stub';
import { MockActivatedRoute } from '../shared/mocks/mock-active-router';
import { GLOBAL_CONFIG } from '../../config';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionScopeType } from '../core/submission/submission-scope-type';
import { submissionRestREsponse } from '../shared/mocks/mock-submission';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { MockTranslateLoader } from '../shared/mocks/mock-translate-loader';

describe('SubmissionService test suite', () => {
  const config = {
    submission: {
      autosave: {
        metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
        timer: 5
      },
      metadata: {
        icons: [
          {
            name: 'dc.contributor.author',
            config: {
              withAuthority: {
                style: 'fa-user'
              }
            }
          },
          {
            name: 'local.contributor.affiliation',
            config: {
              withAuthority: {
                style: 'fa-university'
              },
              withoutAuthority: {
                style: 'fa-university text-muted'
              }
            }
          },
          {
            name: 'default',
            config: {}
          }
        ]
      }
    },
  } as any;

  const subState = {
    objects: {
      826: {
        collection: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
        definition: 'traditional',
        selfUrl: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826',
        activeSection: 'keyinformation',
        sections: {
          extraction: {
            config: '',
            mandatory: true,
            sectionType: 'utils',
            visibility: {
              main: 'HIDDEN',
              other: 'HIDDEN'
            },
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          collection: {
            config: '',
            mandatory: true,
            sectionType: 'collection',
            visibility: {
              main: 'HIDDEN',
              other: 'HIDDEN'
            },
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          keyinformation: {
            header: 'submit.progressbar.describe.keyinformation',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          indexing: {
            header: 'submit.progressbar.describe.indexing',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/indexing',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          publicationchannel: {
            header: 'submit.progressbar.describe.publicationchannel',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/publicationchannel',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: true
          },
          acknowledgement: {
            header: 'submit.progressbar.describe.acknowledgement',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/acknowledgement',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          identifiers: {
            header: 'submit.progressbar.describe.identifiers',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/identifiers',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          references: {
            header: 'submit.progressbar.describe.references',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/references',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          upload: {
            header: 'submit.progressbar.upload',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
            mandatory: true,
            sectionType: 'upload',
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          license: {
            header: 'submit.progressbar.license',
            config: '',
            mandatory: true,
            sectionType: 'license',
            visibility: {
              main: null,
              other: 'READONLY'
            },
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          }
        },
        isLoading: false,
        savePending: false,
        depositPending: false
      }
    }
  };
  const validSubState = {
    objects: {
      826: {
        collection: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
        definition: 'traditional',
        selfUrl: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826',
        activeSection: 'keyinformation',
        sections: {
          extraction: {
            config: '',
            mandatory: true,
            sectionType: 'utils',
            visibility: {
              main: 'HIDDEN',
              other: 'HIDDEN'
            },
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          collection: {
            config: '',
            mandatory: true,
            sectionType: 'collection',
            visibility: {
              main: 'HIDDEN',
              other: 'HIDDEN'
            },
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          keyinformation: {
            header: 'submit.progressbar.describe.keyinformation',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: true
          },
          indexing: {
            header: 'submit.progressbar.describe.indexing',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/indexing',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          publicationchannel: {
            header: 'submit.progressbar.describe.publicationchannel',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/publicationchannel',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: true
          },
          acknowledgement: {
            header: 'submit.progressbar.describe.acknowledgement',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/acknowledgement',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          identifiers: {
            header: 'submit.progressbar.describe.identifiers',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/identifiers',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          references: {
            header: 'submit.progressbar.describe.references',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/references',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errors: [],
            isLoading: false,
            isValid: false
          },
          upload: {
            header: 'submit.progressbar.upload',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
            mandatory: true,
            sectionType: 'upload',
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: true
          },
          license: {
            header: 'submit.progressbar.license',
            config: '',
            mandatory: true,
            sectionType: 'license',
            visibility: {
              main: null,
              other: 'READONLY'
            },
            collapsed: false,
            enabled: true,
            data: {},
            errors: [],
            isLoading: false,
            isValid: true
          }
        },
        isLoading: false,
        savePending: false,
        depositPending: false
      }
    }
  };
  const restService = new SubmissionRestServiceStub();
  const router = new MockRouter();

  let service: SubmissionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ submissionReducers }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      providers: [
        { provide: GLOBAL_CONFIG, useValue: config },
        { provide: Router, useValue: router },
        { provide: SubmissionRestService, useValue: restService },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        NotificationsService,
        RouteService,
        ScrollToService,
        SubmissionService,
        TranslateService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(SubmissionService);
  });

  it('should create a new submission', () => {
    service.createSubmission();

    expect((service as any).restService.postToEndpoint).toHaveBeenCalled();
  });

  it('should deposit submission', () => {

    const selfUrl = 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826';
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    service.depositSubmission(selfUrl);

    expect((service as any).restService.postToEndpoint).toHaveBeenCalledWith('workflowitems', selfUrl, null, options);
  });

  it('should discard submission', () => {
    service.discardSubmission('826');

    expect((service as any).restService.deleteById).toHaveBeenCalledWith('826');
  });

  it('should return submission object state from the store', () => {
    spyOn((service as any).store, 'select').and.returnValue(hot('a', {
      a: subState.objects[826]
    }));

    const result = service.getSubmissionObject('826');
    const expected = cold('b', { b: subState.objects[826] });

    expect(result).toBeObservable(expected);
  });

  it('should return current active submission form section', () => {
    spyOn((service as any).store, 'select').and.returnValue(hot('a', {
      a: subState.objects[826]
    }));

    const result = service.getActiveSectionId('826');
    const expected = cold('b', { b: 'keyinformation' });

    expect(result).toBeObservable(expected);

  });

  it('should return submission form sections', () => {
    spyOn((service as any).store, 'select').and.returnValue(hot('a|', {
      a: subState.objects[826]
    }));

    const result = service.getSubmissionSections('826');
    const expected = cold('(bc|)', {
      b: [],
      c:
        [
          {
            header: 'submit.progressbar.describe.keyinformation',
            id: 'keyinformation',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
            mandatory: true,
            sectionType: 'submission-form',
            data: {},
            errors: []
          },
          {
            header: 'submit.progressbar.describe.indexing',
            id: 'indexing',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/indexing',
            mandatory: false,
            sectionType: 'submission-form',
            data: {},
            errors: []
          },
          {
            header: 'submit.progressbar.describe.publicationchannel',
            id: 'publicationchannel',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/publicationchannel',
            mandatory: true,
            sectionType: 'submission-form',
            data: {},
            errors: []
          },
          {
            header: 'submit.progressbar.describe.acknowledgement',
            id: 'acknowledgement',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/acknowledgement',
            mandatory: false,
            sectionType: 'submission-form',
            data: {},
            errors: []
          },
          {
            header: 'submit.progressbar.describe.identifiers',
            id: 'identifiers',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/identifiers',
            mandatory: false,
            sectionType: 'submission-form',
            data: {},
            errors: []
          },
          {
            header: 'submit.progressbar.describe.references',
            id: 'references',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/references',
            mandatory: false,
            sectionType: 'submission-form',
            data: {},
            errors: []
          },
          {
            header: 'submit.progressbar.upload',
            id: 'upload',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
            mandatory: true,
            sectionType: 'upload',
            data: {},
            errors: []
          },
          {
            header: 'submit.progressbar.license',
            id: 'license',
            config: '',
            mandatory: true,
            sectionType: 'license',
            data: {},
            errors: []
          }
        ]
    });

    expect(result).toBeObservable(expected);
  });

  it('should return list of submission disabled sections', () => {
    spyOn((service as any).store, 'select').and.returnValue(hot('-a|', {
      a: subState.objects[826]
    }));

    const result = service.getDisabledSectionsList('826');
    const expected = cold('bc|', {
      b: [],
      c:
        [
          {
            header: 'submit.progressbar.describe.indexing',
            id: 'indexing',
          },
          {
            header: 'submit.progressbar.describe.acknowledgement',
            id: 'acknowledgement',
          },
          {
            header: 'submit.progressbar.describe.identifiers',
            id: 'identifiers',
          },
          {
            header: 'submit.progressbar.describe.references',
            id: 'references',
          }
        ]
    });

    expect(result).toBeObservable(expected);
  });

  it('should return true/false when section is hidden/visible', () => {
    let section: any = {
      config: '',
      header: '',
      mandatory: true,
      sectionType: 'collection' as any,
      visibility: {
        main: 'HIDDEN',
        other: 'HIDDEN'
      },
      collapsed: false,
      enabled: true,
      data: {},
      errors: [],
      isLoading: false,
      isValid: false
    };
    expect(service.isSectionHidden(section)).toBeTruthy();

    section = {
      header: 'submit.progressbar.describe.keyinformation',
      config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
      mandatory: true,
      sectionType: 'submission-form',
      collapsed: false,
      enabled: true,
      data: {},
      errors: [],
      isLoading: false,
      isValid: false
    };
    expect(service.isSectionHidden(section)).toBeFalsy();
  });

  it('should return properly submission link name', () => {
    let expected = 'workspaceitems';
    router.setRoute('/workspaceitems/826/edit');
    expect(service.getSubmissionObjectLinkName()).toBe(expected);

    expected = 'workspaceitems';
    router.setRoute('/submit');
    expect(service.getSubmissionObjectLinkName()).toBe(expected);

    expected = 'workflowitems';
    router.setRoute('/workflowitems/826/edit');
    expect(service.getSubmissionObjectLinkName()).toBe(expected);

    expected = 'edititems';
    router.setRoute('/items/9e79b1f2-ae0f-4737-9a4b-990952a8857c/edit');
    expect(service.getSubmissionObjectLinkName()).toBe(expected);
  });

  it('should return properly submission scope', () => {
    let expected = SubmissionScopeType.WorkspaceItem;
    ;
    router.setRoute('/workspaceitems/826/edit');
    expect(service.getSubmissionScope()).toBe(expected);

    router.setRoute('/submit');
    expect(service.getSubmissionScope()).toBe(expected);

    expected = SubmissionScopeType.WorkflowItem;
    router.setRoute('/workflowitems/826/edit');
    expect(service.getSubmissionScope()).toBe(expected);

    expected = SubmissionScopeType.EditItem;
    router.setRoute('/items/9e79b1f2-ae0f-4737-9a4b-990952a8857c/edit');
    expect(service.getSubmissionScope()).toBe(expected);
  });

  it('should return properly submission status', () => {
    spyOn((service as any).store, 'select').and.returnValue(hot('-a-b', {
      a: subState,
      b: validSubState
    }));
    const result = service.getSubmissionStatus('826');
    const expected = cold('cc-d', {
      c: false,
      d: true
    });

    expect(result).toBeObservable(expected);
  });

  it('should return submission save processing status', () => {
    spyOn((service as any).store, 'select').and.returnValue(hot('-a', {
      a: subState.objects[826]
    }));

    const result = service.getSubmissionSaveProcessingStatus('826');
    const expected = cold('bb', {
      b: false
    });

    expect(result).toBeObservable(expected);
  });

  it('should return submission deposit processing status', () => {
    spyOn((service as any).store, 'select').and.returnValue(hot('-a', {
      a: subState.objects[826]
    }));

    const result = service.getSubmissionDepositProcessingStatus('826');
    const expected = cold('bb', {
      b: false
    });

    expect(result).toBeObservable(expected);
  });

  it('should redirect to MyDspace page', () => {
    const spy = spyOn((service as any).routeService, 'getPreviousUrl');

    spy.and.returnValue('/mydspace?configuration=workflow');
    service.redirectToMyDSpace();

    expect((service as any).router.navigateByUrl).toHaveBeenCalledWith('/mydspace?configuration=workflow');

    spy.and.returnValue('');
    service.redirectToMyDSpace();

    expect((service as any).router.navigate).toHaveBeenCalledWith(['/mydspace']);
  });

  it('should retrieve submission from REST endpoint', () => {
    (service as any).restService.getDataById.and.returnValue(hot('a|', {
      a: submissionRestREsponse
    }));

    const result = service.retrieveSubmission('826');
    const expected = cold('(b|)', {
      b: submissionRestREsponse[0]
    });

    expect(result).toBeObservable(expected);
  });

  it('should start Auto Save', () => {
    spyOn((service as any).store, 'dispatch');

    const duration = config.submission.autosave.timer * (1000 * 60);
    const expected = Observable.timer(duration, duration);

    service.startAutoSave('826');

    expect((service as any).timerObs).toEqual(expected);
  });

  it('should stop Auto Save', () => {
    service.startAutoSave('826');
    service.stopAutoSave();

    expect((service as any).autoSaveSub).toBeNull();
  });
});
