import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, waitForAsync } from '@angular/core/testing';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { EditItemRelationshipsMenuComponent } from './edit-item-relationships-menu.component';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { TabDataService } from '../../../core/layout/tab-data.service';
import { cold } from 'jasmine-marbles';
import { CrisLayoutBox } from '../../../core/layout/models/box.model';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { NotificationsService } from '../../notifications/notifications.service';
import { CrisLayoutTab } from '../../../core/layout/models/tab.model';
import { TAB } from '../../../core/layout/models/tab.resource-type';

describe('EditItemRelationshipsMenuComponent', () => {
  let component: EditItemRelationshipsMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<EditItemRelationshipsMenuComponent>;

  let editItemDataService: any;
  let dso: DSpaceObject;

  const notificationService = new NotificationsServiceStub();
  const editItemMode: EditItemMode = Object.assign(new EditItemMode(), {
    name: 'test',
    label: 'test'
  });


  const boxesWithRelations: CrisLayoutBox[] = [
    Object.assign(new CrisLayoutBox(), {
      'id': 627,
      'shortname': 'namecard',
      'header': 'Name Card',
      'entityType': 'Person',
      'collapsed': false,
      'minor': true,
      'style': null,
      'security': 0,
      'boxType': 'METADATA',
      'clear': true,
      'maxColumns': null
    }),
    Object.assign(new CrisLayoutBox(), {
      'id': 623,
      'shortname': 'researchoutputs',
      'header': 'Publications',
      'entityType': 'Person',
      'collapsed': false,
      'minor': false,
      'style': null,
      'security': 0,
      'boxType': 'RELATION',
      'clear': true,
      'maxColumns': null
    })
  ];

  const boxesWithoutRelations: CrisLayoutBox[] = [
    Object.assign(new CrisLayoutBox(), {
      'id': 627,
      'shortname': 'namecard',
      'header': 'Name Card',
      'entityType': 'Person',
      'collapsed': false,
      'minor': true,
      'style': null,
      'security': 0,
      'boxType': 'METADATA',
      'clear': true,
      'maxColumns': null
    })
  ];

  const tabWithRelationBoxes: CrisLayoutTab = {
    type: TAB,
    id: 1,
    shortname: 'person-profile',
    header: 'person-profile-header',
    entityType: 'Person',
    priority: 0,
    security: 0,
    rows: [
      {
        cells: [
          {
            boxes: boxesWithRelations,
            style: ''
          }
        ],
        style: ''
      }
    ],
    uuid: 'person-profile-1',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/tabs/1'
      }
    }
  };

  const tabWithoutRelationBoxes: CrisLayoutTab = {
    type: TAB,
    id: 1,
    shortname: 'person-profile',
    header: 'person-profile-header',
    entityType: 'Person',
    priority: 0,
    security: 0,
    rows: [
      {
        cells: [
          {
            boxes: boxesWithoutRelations,
            style: ''
          }
        ],
        style: ''
      }
    ],
    uuid: 'person-profile-1',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/tabs/1'
      }
    }
  };

  const relationships = [
    Object.assign(new CrisLayoutBox(), {
      'id': 623,
      'shortname': 'researchoutputs',
      'header': 'Publications',
      'entityType': 'Person',
      'collapsed': false,
      'minor': false,
      'style': null,
      'security': 0,
      'boxType': 'RELATION',
      'clear': true,
      'maxColumns': null
    })
  ];

  const tabDataServiceMock: any = jasmine.createSpyObj('TabDataService', {
    findByItem: jasmine.createSpy('findByItem')
  });

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
    editItemDataService = jasmine.createSpyObj('EditItemDataService', {
      searchEditModesById: jasmine.createSpy('searchEditModesById')
    });

    TestBed.configureTestingModule({
      declarations: [EditItemRelationshipsMenuComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: EditItemDataService, useValue: editItemDataService },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: TabDataService, useValue: tabDataServiceMock },
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: NotificationsService, useValue: notificationService },
      ]
    }).compileComponents();
  }));

  describe('when edit modes are available', () => {
    beforeEach(() => {
      editItemDataService.searchEditModesById.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([editItemMode])));
      tabDataServiceMock.findByItem.and.returnValue(cold('a|', {
        a: createSuccessfulRemoteDataObject(createPaginatedList([tabWithRelationBoxes]))
      }));

      fixture = TestBed.createComponent(EditItemRelationshipsMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;
      fixture.detectChanges();
    });

    it('should init edit mode properly', () => {
      expect(componentAsAny.editModes$.value).toEqual([editItemMode]);
    });

    it('should render an anchor', () => {
      component.relationships = relationships;
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('a'));
      expect(link).not.toBeNull();
    });
  });

  describe('when no edit modes are available', () => {
    beforeEach(() => {
      editItemDataService.searchEditModesById.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([])));
      tabDataServiceMock.findByItem.and.returnValue(cold('a|', {
        a: createSuccessfulRemoteDataObject(createPaginatedList([tabWithoutRelationBoxes]))
      }));

      fixture = TestBed.createComponent(EditItemRelationshipsMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;
      fixture.detectChanges();
    });

    it('should init edit mode properly', () => {
      expect(componentAsAny.editModes$.value).toEqual([]);
    });

    it('should not render an anchor', () => {
      const link = fixture.debugElement.query(By.css('a'));
      expect(link).toBeNull();
    });
  });

});
