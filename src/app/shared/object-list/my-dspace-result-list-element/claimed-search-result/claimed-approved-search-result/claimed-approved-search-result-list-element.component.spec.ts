import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  APP_CONFIG,
  ClaimedApprovedTaskSearchResult,
  ClaimedTask,
  Context,
  createSuccessfulRemoteDataObject,
  DSONameService,
  getMockLinkService,
  Item,
  LinkService,
  WorkflowItem,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { environment } from '../../../../../../environments/environment';
import { DSONameServiceMock } from '../../../../mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../../../mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../../mocks/theme-service.mock';
import { ThemeService } from '../../../../theme-support/theme.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { VarDirective } from '../../../../utils/var.directive';
import { ClaimedApprovedSearchResultListElementComponent } from './claimed-approved-search-result-list-element.component';

let component: ClaimedApprovedSearchResultListElementComponent;
let fixture: ComponentFixture<ClaimedApprovedSearchResultListElementComponent>;

const mockResultObject: ClaimedApprovedTaskSearchResult = new ClaimedApprovedTaskSearchResult();
mockResultObject.hitHighlights = {};

const item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article',
      },
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
  },
});
const rdItem = createSuccessfulRemoteDataObject(item);
const workflowitem = Object.assign(new WorkflowItem(), { item: observableOf(rdItem) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockResultObject.indexableObject = Object.assign(new ClaimedTask(), { workflowitem: observableOf(rdWorkflowitem) });
const linkService = getMockLinkService();

describe('ClaimedApprovedSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        VarDirective,
        ClaimedApprovedSearchResultListElementComponent,
      ],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedApprovedSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ClaimedApprovedSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init workflowitem properly', (done) => {
    component.workflowitemRD$.subscribe((workflowitemRD) => {
      expect(linkService.resolveLinks).toHaveBeenCalledWith(
        component.dso,
        jasmine.objectContaining({ name: 'workflowitem' }),
        jasmine.objectContaining({ name: 'action' }),
      );
      expect(workflowitemRD.payload).toEqual(workflowitem);
      done();
    });
  });

  it('should have the correct badge context', () => {
    expect(component.badgeContext).toEqual(Context.MyDSpaceApproved);
  });

});
