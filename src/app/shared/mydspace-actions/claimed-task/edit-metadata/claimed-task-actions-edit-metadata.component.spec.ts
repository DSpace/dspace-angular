import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RequestService,
  NotificationsService,
  ClaimedTaskDataService,
  ClaimedTask,
  PoolTaskDataService,
  ActivatedRouteStub,
  NotificationsServiceStub,
  getMockRequestService,
  RouterStub,
  getMockSearchService,
  TranslateLoaderMock,
} from '@dspace/core'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SearchService } from '../../../search/search.service';
import {
  ClaimedTaskActionsEditMetadataComponent,
} from './claimed-task-actions-edit-metadata.component';

let component: ClaimedTaskActionsEditMetadataComponent;
let fixture: ComponentFixture<ClaimedTaskActionsEditMetadataComponent>;

const searchService = getMockSearchService();

const requestService = getMockRequestService();

let mockPoolTaskDataService: PoolTaskDataService;

describe('ClaimedTaskActionsEditMetadataComponent', () => {
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });
  mockPoolTaskDataService = new PoolTaskDataService(null, null, null, null);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ClaimedTaskActionsEditMetadataComponent,
      ],
      providers: [
        { provide: ClaimedTaskDataService, useValue: {} },
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestService },
        { provide: PoolTaskDataService, useValue: mockPoolTaskDataService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedTaskActionsEditMetadataComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsEditMetadataComponent);
    component = fixture.componentInstance;
    component.object = object;
    spyOn(component, 'initReloadAnchor').and.returnValue(undefined);
    fixture.detectChanges();
  });

  it('should display edit button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-primary'));

    expect(btn).not.toBeNull();
  });

});
