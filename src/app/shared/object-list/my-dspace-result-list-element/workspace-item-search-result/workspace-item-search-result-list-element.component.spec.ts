import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG } from '@dspace/config';
import {
  DSONameService,
  LinkService,
  ItemDataService,
  Context,
  Item,
  WorkflowItemSearchResult,
  WorkspaceItem,
  DSONameServiceMock,
  getMockLinkService,
  mockTruncatableService,
  createSuccessfulRemoteDataObject,
} from '@dspace/core'
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import {
  WorkspaceitemActionsComponent,
} from '../../../mydspace-actions/workspaceitem/workspaceitem-actions.component';
import {
  ListableObjectComponentLoaderComponent,
} from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { getMockThemeService } from '../../../theme-support/test/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import {
  WorkspaceItemSearchResultListElementComponent,
} from './workspace-item-search-result-list-element.component';


let component: WorkspaceItemSearchResultListElementComponent;
let fixture: ComponentFixture<WorkspaceItemSearchResultListElementComponent>;

const mockResultObject: WorkflowItemSearchResult = new WorkflowItemSearchResult();
mockResultObject.hitHighlights = {};

const item = Object.assign(new Item(), {
  bundles: of({}),
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

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true,
  },
};

const rd = createSuccessfulRemoteDataObject(item);
mockResultObject.indexableObject = Object.assign(new WorkspaceItem(), { item: of(rd) });
let linkService;

describe('WorkspaceItemSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    linkService = getMockLinkService();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, WorkspaceItemSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: ItemDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(WorkspaceItemSearchResultListElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ListableObjectComponentLoaderComponent, WorkspaceitemActionsComponent, ThemedLoadingComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WorkspaceItemSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.object = mockResultObject;
    fixture.detectChanges();
  });

  it('should init derivedSearchResult$ properly', (done) => {
    component.derivedSearchResult$.pipe(take(1)).subscribe((i) => {
      expect(linkService.resolveLink).toHaveBeenCalled();
      expect(i.indexableObject).toBe(item);
      expect(i.hitHighlights).toBe(mockResultObject.hitHighlights);
      done();
    });
  });

  it('should have correct badge context', () => {
    expect(component.badgeContext).toEqual(Context.MyDSpaceWorkspace);
  });

  it('should forward workspaceitem-actions processCompleted event to the reloadedObject event emitter', fakeAsync(() => {

    spyOn(component.reloadedObject, 'emit').and.callThrough();
    const actionPayload: any = { reloadedObject: {} };

    const actionsComponent = fixture.debugElement.query(By.css('ds-workspaceitem-actions'));
    actionsComponent.triggerEventHandler('processCompleted', actionPayload);
    tick();

    expect(component.reloadedObject.emit).toHaveBeenCalledWith(actionPayload.reloadedObject);

  }));


  it('should add an offset to the actions element', () => {
    const thumbnail = fixture.debugElement.query(By.css('.offset-3'));
    expect(thumbnail).toBeTruthy();
  });
});
