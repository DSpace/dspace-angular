// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick, } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { SectionContainerComponent } from './section-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { createTestComponent } from '../../../shared/testing/utils';
import { SectionsType } from '../sections-type';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SectionsDirective } from '../sections.directive';
import { ActionsSubject, Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { SubmissionService } from '../../submission.service';
import { GLOBAL_CONFIG } from '../../../../config';
import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionRestServiceStub } from '../../../shared/testing/submission-rest-service-stub';
import { ActivatedRoute, Router } from '@angular/router';
import { MockRouter } from '../../../shared/mocks/mock-router';
import { RouteService } from '../../../shared/services/route.service';
import { MockActivatedRoute } from '../../../shared/mocks/mock-active-router';
import { SectionsService } from '../sections.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

describe('SectionContainerComponent test suite', () => {

  let testComp: TestComponent;
  let sectionContainerComponent: SectionContainerComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let sectionContainerComponentComponentFixture: ComponentFixture<SectionContainerComponent>;
  let html;

  const config = {
    autosave: {
      metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
        timer: 5
    },
    metadata: {
      icons: [
        {
          name: 'dc.contributor.author',
          config: {
            withAuthority:{
              style: 'fa-user'
            }
          }
        },
        {
          name: 'local.contributor.affiliation',
          config: {
            withAuthority:{
              style: 'fa-university'
            },
            withoutAuthority:{
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
  } as any;
  const restService = new SubmissionRestServiceStub();
  const router = new MockRouter();
  const store = new Store<SubmissionState>(Observable.of({}), new ActionsSubject(), undefined);

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [
        SectionContainerComponent,
        SectionsDirective,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        NotificationsService,
        RouteService,
        ScrollToService,
        SectionContainerComponent,
        SectionsService,
        SubmissionService,
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: Router, useValue: router },
        { provide: SubmissionRestService, useValue: restService },
        { provide: GLOBAL_CONFIG, useValue: config },
        { provide: Store, useValue: store }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
      <ds-submission-form-section-container [collectionId]="collectionId"
                                            [submissionId]="submissionId"
                                            [sectionData]="object"></ds-submission-form-section-container>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    it('should create Chips Component', inject([SectionContainerComponent], (app: SectionContainerComponent) => {
      expect(app).toBeDefined();
    }));
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  public collectionId = '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb';
  public submissionId = 1;
  public object = {
    config:	'https://dspace7.4science.it/or2018/api/config/submissionforms/traditionalpageone',
    mandatory:	true,
    data:		{},
    errors:		[],
    header:	'submit.progressbar.describe.stepone',
    id:	'traditionalpageone',
    sectionType:	SectionsType.SubmissionForm
  }
}
