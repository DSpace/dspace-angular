import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisItemPageComponent } from './cris-item-page.component';
import { Item } from '../core/shared/item.model';
import { createSuccessfulRemoteDataObject$, createSuccessfulRemoteDataObject, createPendingRemoteDataObject$ } from '../shared/remote-data.utils';
import { PaginatedList } from '../core/data/paginated-list';
import { PageInfo } from '../core/shared/page-info.model';
import { createRelationshipsObservable } from '../+item-page/simple/item-types/shared/item.component.spec';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from '../core/data/item-data.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VarDirective } from '../shared/utils/var.directive';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: [],
  relationships: createRelationshipsObservable()
});

describe('CrisItemPageComponent', () => {
  let component: CrisItemPageComponent;
  let fixture: ComponentFixture<CrisItemPageComponent>;

  const mockRoute = Object.assign(new ActivatedRouteStub(), {
    data: of({ item: createSuccessfulRemoteDataObject(mockItem) })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [ CrisItemPageComponent, VarDirective ],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: ItemDataService, useValue: {}},
        {provide: Router, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the item is loading', () => {
    beforeEach(() => {
      component.itemRD$ = createPendingRemoteDataObject$(undefined);
      fixture.detectChanges();
    });

    it('should display a loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading.nativeElement).toBeDefined();
    });
  });
});
