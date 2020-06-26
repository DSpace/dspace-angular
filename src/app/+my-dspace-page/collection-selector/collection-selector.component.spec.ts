import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CollectionSelectorComponent } from './collection-selector.component';
import { CollectionDropdownComponent } from 'src/app/shared/collection-dropdown/collection-dropdown.component';
import { Collection } from 'src/app/core/shared/collection.model';
import { of, Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Community } from 'src/app/core/shared/community.model';
import { FindListOptions } from 'src/app/core/data/request.models';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { ChangeDetectorRef, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { hot } from 'jasmine-marbles';
import { By } from '@angular/platform-browser';

describe('CollectionSelectorComponent', () => {
  let component: CollectionSelectorComponent;
  let fixture: ComponentFixture<CollectionSelectorComponent>;
  const modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);

  const community: Community = Object.assign(new Community(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    uuid: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    name: 'Community 1'
  });

  const collections: Collection[] = [
    Object.assign(new Collection(), {
      id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
      name: 'Collection 1',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 1'
        }],
      parentCommunity: of(
        new RemoteData(false, false, true, undefined, community, 200)
      )
    }),
    Object.assign(new Collection(), {
      id: '59ee713b-ee53-4220-8c3f-9860dc84fe33',
      name: 'Collection 2',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 2'
        }],
      parentCommunity: of(
        new RemoteData(false, false, true, undefined, community, 200)
      )
    }),
    Object.assign(new Collection(), {
      id: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
      name: 'Collection 3',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 3'
        }],
      parentCommunity: of(
        new RemoteData(false, false, true, undefined, community, 200)
      )
    }),
    Object.assign(new Collection(), {
      id: '59da2ff0-9bf4-45bf-88be-e35abd33f304',
      name: 'Collection 4',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 4'
        }],
      parentCommunity: of(
        new RemoteData(false, false, true, undefined, community, 200)
      )
    }),
    Object.assign(new Collection(), {
      id: 'a5159760-f362-4659-9e81-e3253ad91ede',
      name: 'Collection 5',
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 5'
        }],
      parentCommunity: of(
        new RemoteData(false, false, true, undefined, community, 200)
      )
    })
  ];

  // tslint:disable-next-line: max-classes-per-file
  const collectionDataServiceMock = {
    getAuthorizedCollection(query: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Collection>>): Observable<RemoteData<PaginatedList<Collection>>> {
      return hot( 'a|', {
        a: createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), collections)
        )
      });
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ CollectionSelectorComponent, CollectionDropdownComponent ],
      providers: [
        {provide: CollectionDataService, useValue: collectionDataServiceMock},
        {provide: ChangeDetectorRef, useValue: {}},
        {provide: ElementRef, userValue: {}},
        {provide: NgbActiveModal, useValue: modal},
        {provide: ActivatedRoute, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectObject', fakeAsync(() => {
    spyOn(component, 'selectObject');
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      const collectionItem = fixture.debugElement.query(By.css('.collection-item:nth-child(2)'));
      collectionItem.triggerEventHandler('click', {
        preventDefault: () => {/**/
        }
      });
      expect(component.selectObject).toHaveBeenCalled();
    });
  }));

  it('should close the dialog', () => {
    component.close();
    expect((component as any).activeModal.close).toHaveBeenCalled();
  });
});
