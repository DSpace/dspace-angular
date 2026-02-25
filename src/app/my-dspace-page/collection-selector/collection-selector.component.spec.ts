/* eslint-disable max-classes-per-file */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Collection } from '@dspace/core/shared/collection.model';
import { Community } from '@dspace/core/shared/community.model';
import { FollowLinkConfig } from '@dspace/core/shared/follow-link-config.model';
import { MockElementRef } from '@dspace/core/testing/element-ref.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  getTestScheduler,
  hot,
} from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { CollectionDropdownComponent } from '../../shared/collection-dropdown/collection-dropdown.component';
import { CollectionSelectorComponent } from './collection-selector.component';

describe('CollectionSelectorComponent', () => {
  let component: CollectionSelectorComponent;
  let fixture: ComponentFixture<CollectionSelectorComponent>;
  let scheduler: TestScheduler;
  const modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);

  const community: Community = Object.assign(new Community(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    uuid: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    name: 'Community 1',
  });

  const collections: Collection[] = [
    Object.assign(new Collection(), {
      id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
      name: 'Collection 1',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 1',
        }],
      parentCommunity: createSuccessfulRemoteDataObject$(community),
    }),
    Object.assign(new Collection(), {
      id: '59ee713b-ee53-4220-8c3f-9860dc84fe33',
      name: 'Collection 2',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 2',
        }],
      parentCommunity: createSuccessfulRemoteDataObject$(community),
    }),
    Object.assign(new Collection(), {
      id: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
      name: 'Collection 3',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 3',
        }],
      parentCommunity: createSuccessfulRemoteDataObject$(community),
    }),
    Object.assign(new Collection(), {
      id: '59da2ff0-9bf4-45bf-88be-e35abd33f304',
      name: 'Collection 4',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 4',
        }],
      parentCommunity: createSuccessfulRemoteDataObject$(community),
    }),
    Object.assign(new Collection(), {
      id: 'a5159760-f362-4659-9e81-e3253ad91ede',
      name: 'Collection 5',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 5',
        }],
      parentCommunity: createSuccessfulRemoteDataObject$(community),
    }),
  ];

  const collectionDataServiceMock = {
    getAuthorizedCollection(query: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<Collection>[]): Observable<RemoteData<PaginatedList<Collection>>> {
      return hot( 'a|', {
        a: createSuccessfulRemoteDataObject(createPaginatedList(collections)),
      });
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        CollectionSelectorComponent,
        CollectionDropdownComponent,
      ],
      providers: [
        { provide: CollectionDataService, useValue: collectionDataServiceMock },
        { provide: ElementRef, useClass: MockElementRef },
        { provide: NgbActiveModal, useValue: modal },
        { provide: ActivatedRoute, useValue: {} },
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CollectionSelectorComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.overrideComponent(CollectionSelectorComponent, {
      set: {
        template: '<ds-base-collection-dropdown (selectionChange)="selectObject($event)"></ds-base-collection-dropdown>',
      },
    }).createComponent(CollectionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectObject', () => {
    spyOn(component, 'selectObject').and.callThrough();
    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    fixture.detectChanges();

    component.selectObject({ collection: { name: 'test', id: 'test', uuid: 'test' }, communities: [] });

    expect(component.selectObject).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    component.close();
    expect((component as any).activeModal.close).toHaveBeenCalled();
  });
});
