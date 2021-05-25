import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { EditItemRelationshipsMenuComponent } from './edit-item-relationships-menu.component';
import { EditItem } from '../../../core/submission/models/edititem.model';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';

describe('EditItemRelationshipsMenuComponent', () => {
  let component: EditItemRelationshipsMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<EditItemRelationshipsMenuComponent>;

  let editItemDataService: any;
  let dso: DSpaceObject;

  const editItemMode: EditItemMode = Object.assign(new EditItemMode(), {
    name: 'test',
    label: 'test'
  });

  const editItem: EditItem = Object.assign(new EditItem(), {
    modes: createSuccessfulRemoteDataObject$(createPaginatedList([editItemMode]))
  });

  const noEditItem: EditItem = Object.assign(new EditItem(), {
    modes: createSuccessfulRemoteDataObject$(createPaginatedList([]))
  });

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
    editItemDataService = jasmine.createSpyObj('EditItemDataService', {
      findById: jasmine.createSpy('findById')
    });

    TestBed.configureTestingModule({
      declarations: [ EditItemRelationshipsMenuComponent ],
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
      ]
    }).compileComponents();
  }));

  describe('when edit modes are available', () => {
    beforeEach(() => {
      editItemDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(editItem));
      fixture = TestBed.createComponent(EditItemRelationshipsMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;
      fixture.detectChanges();
    });

    it('should init edit mode properly', () => {
      expect(componentAsAny.editModes$.value).toEqual([editItemMode]);
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });
  });

  describe('when no edit modes are available', () => {
    beforeEach(() => {
      editItemDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(noEditItem));
      fixture = TestBed.createComponent(EditItemRelationshipsMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;
      fixture.detectChanges();
    });

    it('should init edit mode properly', () => {
      expect(componentAsAny.editModes$.value).toEqual([]);
    });

    it('should render a tag', () => {
      const link = fixture.debugElement.query(By.css('a'));
      expect(link).toBeNull();
    });
  });

});
