import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ItemTemplateDataService } from '../../../../modules/core/src/lib/core/data/item-template-data.service';
import { NotificationsService } from '../../../../modules/core/src/lib/core/notifications/notifications.service';
import { Collection } from '../../../../modules/core/src/lib/core/shared/collection.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { NotificationsServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/notifications-service.stub';
import { ThemedDsoEditMetadataComponent } from '../../dso-shared/dso-edit-metadata/themed-dso-edit-metadata.component';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { getCollectionEditRoute } from '../collection-page-routing-paths';
import { EditItemTemplatePageComponent } from './edit-item-template-page.component';

describe('EditItemTemplatePageComponent', () => {
  let comp: EditItemTemplatePageComponent;
  let fixture: ComponentFixture<EditItemTemplatePageComponent>;
  let itemTemplateService: ItemTemplateDataService;
  let collection: Collection;

  beforeEach(waitForAsync(() => {
    collection = Object.assign(new Collection(), {
      uuid: 'collection-id',
      id: 'collection-id',
      name: 'Fake Collection',
    });
    itemTemplateService = jasmine.createSpyObj('itemTemplateService', {
      findByCollectionID: createSuccessfulRemoteDataObject$({}),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, EditItemTemplatePageComponent],
      providers: [
        { provide: ItemTemplateDataService, useValue: itemTemplateService },
        { provide: ActivatedRoute, useValue: { parent: { data: observableOf({ dso: createSuccessfulRemoteDataObject(collection) }) } } },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(EditItemTemplatePageComponent, {
      remove: {
        imports: [ThemedDsoEditMetadataComponent],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemTemplatePageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getCollectionEditUrl', () => {
    it('should return the collection\'s edit url', () => {
      const url = comp.getCollectionEditUrl(collection);
      expect(url).toEqual(getCollectionEditRoute(collection.uuid));
    });
  });
});
