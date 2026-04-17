import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { Item } from 'src/app/core/shared/item.model';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { createPaginatedList } from 'src/app/shared/testing/utils.test';

import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { VarDirective } from '../../../utils/var.directive';
import { AuthorizedItemSelectorComponent } from './authorized-item-selector.component';

describe('AuthorizedItemSelectorComponent', () => {
  let component: AuthorizedItemSelectorComponent;
  let fixture: ComponentFixture<AuthorizedItemSelectorComponent>;

  let itemService;
  let item;

  let notificationsService: NotificationsService;

  beforeEach(waitForAsync(() => {
    item = Object.assign(new Item(), {
      id: 'authorized-item',
    });
    itemService = jasmine.createSpyObj('itemService', {
      findEditAuthorized: createSuccessfulRemoteDataObject$(createPaginatedList([item])),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), AuthorizedItemSelectorComponent, VarDirective],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: ItemDataService, useValue: itemService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AuthorizedItemSelectorComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent, ThemedLoadingComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedItemSelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.ITEM];
    fixture.detectChanges();
  });

  describe('search', () => {
    it('should call findEditAuthorized and return the authorized item in a SearchResult', (done) => {
      component.search('', 1).subscribe((resultRD) => {
        expect(itemService.findEditAuthorized).toHaveBeenCalled();
        expect(resultRD.payload.page.length).toEqual(1);
        expect(resultRD.payload.page[0].indexableObject).toEqual(item);
        done();
      });
    });
  });
});
