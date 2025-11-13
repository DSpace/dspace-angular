import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { EntityTypeDataService } from '@dspace/core/data/entity-type-data.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { ObjectUpdatesService } from '@dspace/core/data/object-updates/object-updates.service';
import { RelationshipDataService } from '@dspace/core/data/relationship-data.service';
import { RelationshipTypeDataService } from '@dspace/core/data/relationship-type-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Item } from '@dspace/core/shared/item.model';
import { ItemType } from '@dspace/core/shared/item-relationships/item-type.model';
import { Relationship } from '@dspace/core/shared/item-relationships/relationship.model';
import { RelationshipType } from '@dspace/core/shared/item-relationships/relationship-type.model';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DSPACE_OBJECT_DELETION_SCRIPT_NAME,
  ScriptDataService,
} from '../../../core/data/processes/script-data.service';
import { ProcessParameter } from '../../../core/processes/process-parameter.model';
import { getProcessDetailRoute } from '../../../process-page/process-page-routing.paths';
import { ListableObjectComponentLoaderComponent } from '../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { getMockThemeService } from '../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../shared/theme-support/theme.service';
import { VarDirective } from '../../../shared/utils/var.directive';
import { getItemEditRoute } from '../../item-page-routing-paths';
import { ModifyItemOverviewComponent } from '../modify-item-overview/modify-item-overview.component';
import { ItemDeleteComponent } from './item-delete.component';

let comp: ItemDeleteComponent;
let fixture: ComponentFixture<ItemDeleteComponent>;

let mockItem;
let itemType;
let type1;
let type2;
let types;
let relationships;
let itemPageUrl;
let routerStub;
let mockItemDataService: ItemDataService;
let routeStub;
let objectUpdatesServiceStub;
let relationshipService;
let linkService;
let entityTypeService;
let notificationsServiceStub;
let typesSelection;
let scriptDataService;
let router;
let scriptService;

describe('ItemDeleteComponent', () => {
  beforeEach(waitForAsync(() => {
    scriptService = jasmine.createSpyObj('scriptService', {
      invoke: createSuccessfulRemoteDataObject$({ processId: '123' }),
    });
    router = jasmine.createSpyObj('router', ['navigateByUrl', 'navigate']);

    mockItem = Object.assign(new Item(), {
      id: 'fake-id',
      uuid: 'fake-uuid',
      handle: 'fake/handle',
      lastModified: '2018',
      isWithdrawn: true,
      metadata: {
        'dspace.entity.type': [
          { value: 'Person' },
        ],
      },
    });

    itemType = Object.assign(new ItemType(), {
      id: 'itemType',
      uuid: 'itemType',
    });

    type1 = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: 'type-1',
    });

    type2 = Object.assign(new RelationshipType(), {
      id: '2',
      uuid: 'type-2',
    });

    types = [type1, type2];

    relationships = [
      Object.assign(new Relationship(), {
        id: '1',
        uuid: 'relationship-1',
        relationshipType: createSuccessfulRemoteDataObject$(type1),
        leftItem: createSuccessfulRemoteDataObject$(mockItem),
        rightItem: createSuccessfulRemoteDataObject$(new Item()),
      }),
      Object.assign(new Relationship(), {
        id: '2',
        uuid: 'relationship-2',
        relationshipType: createSuccessfulRemoteDataObject$(type2),
        leftItem: createSuccessfulRemoteDataObject$(mockItem),
        rightItem: createSuccessfulRemoteDataObject$(new Item()),
      }),
    ];

    itemPageUrl = `fake-url/${mockItem.id}`;
    routerStub = Object.assign(new RouterStub(), {
      url: `${itemPageUrl}/edit`,
    });

    mockItemDataService = jasmine.createSpyObj('mockItemDataService', {
      delete: createSuccessfulRemoteDataObject$({}),
    });

    routeStub = {
      data: of({
        dso: createSuccessfulRemoteDataObject(mockItem),
      }),
    };

    typesSelection = {
      type1: false,
      type2: true,
    };

    entityTypeService = jasmine.createSpyObj('entityTypeService',
      {
        getEntityTypeByLabel: createSuccessfulRemoteDataObject$(itemType),
        getEntityTypeRelationships: createSuccessfulRemoteDataObject$(createPaginatedList(types)),
      },
    );

    objectUpdatesServiceStub = {
      initialize: () => {
        // do nothing
      },
      isSelectedVirtualMetadata: (type) => of(typesSelection[type]),
    };

    relationshipService = jasmine.createSpyObj('relationshipService',
      {
        getItemRelationshipsArray: of(relationships),
      },
    );

    linkService = jasmine.createSpyObj('linkService',
      {
        resolveLinks: relationships[0],
      },
    );

    notificationsServiceStub = new NotificationsServiceStub();

    scriptDataService = {
      invoke: jasmine.createSpy('invoke').and.returnValue(createSuccessfulRemoteDataObject$({ processId: '123' })),
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, ItemDeleteComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: router },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
        { provide: ObjectUpdatesService, useValue: objectUpdatesServiceStub },
        { provide: RelationshipDataService, useValue: relationshipService },
        { provide: EntityTypeDataService, useValue: entityTypeService },
        { provide: RelationshipTypeDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ScriptDataService, useValue: scriptDataService },
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    })
      .overrideComponent(ItemDeleteComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent, ModifyItemOverviewComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDeleteComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a page with messages based on the \'delete\' messageKey', () => {
    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.innerHTML).toContain('item.edit.delete.header');
    const description = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(description.innerHTML).toContain('item.edit.delete.description');
    const confirmButton = fixture.debugElement.query(By.css('button.perform-action')).nativeElement;
    expect(confirmButton.innerHTML).toContain('item.edit.delete.confirm');
    const cancelButton = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
    expect(cancelButton.innerHTML).toContain('item.edit.delete.cancel');
  });

  describe('performAction', () => {
    it('should invoke the deletion script with correct params, show success notification and redirect on success', (done) => {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '-i', value: mockItem.uuid }),
      ];
      scriptDataService.invoke.and.returnValue(createSuccessfulRemoteDataObject$({ processId: '123' }));
      comp.performAction();
      setTimeout(() => {
        expect(scriptDataService.invoke).toHaveBeenCalledWith(DSPACE_OBJECT_DELETION_SCRIPT_NAME, parameterValues, []);
        expect(notificationsServiceStub.success).toHaveBeenCalled();
        expect(router.navigateByUrl).toHaveBeenCalledWith(getProcessDetailRoute('123'));
        done();
      }, 0);
    });

    it('should show error notification and redirect to item edit page on failure', (done) => {
      scriptDataService.invoke.and.returnValue(createFailedRemoteDataObject$('Error', 500));
      comp.performAction();
      setTimeout(() => {
        expect(notificationsServiceStub.error).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([getItemEditRoute(mockItem)]);
        done();
      }, 0);
    });

  });
});
