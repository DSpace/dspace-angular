import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../shared/mocks/mock-translate-loader';
import { ItemDataService } from '../../core/data/item-data.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemPageComponent } from './item-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { MetadataService } from '../../core/metadata/metadata.service';
import { VarDirective } from '../../shared/utils/var.directive';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { createRelationshipsObservable } from './item-types/shared/item.component.spec';
import { of as observableOf } from 'rxjs';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});

describe('ItemPageComponent', () => {
  let comp: ItemPageComponent;
  let fixture: ComponentFixture<ItemPageComponent>;

  const mockMetadataService = {
    /* tslint:disable:no-empty */
    processRemoteData: () => {}
    /* tslint:enable:no-empty */
  };
  const mockRoute = Object.assign(new ActivatedRouteStub(), {
    data: observableOf({ item: new RemoteData(false, false, true, null, mockItem) })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      }), BrowserAnimationsModule],
      declarations: [ItemPageComponent, VarDirective],
      providers: [
        {provide: ActivatedRoute, useValue: mockRoute},
        {provide: ItemDataService, useValue: {}},
        {provide: MetadataService, useValue: mockMetadataService},
        {provide: Router, useValue: {}}
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('when the item is loading', () => {
    beforeEach(() => {
      comp.itemRD$ = observableOf(new RemoteData(true, true, true, null, undefined));
      fixture.detectChanges();
    });

    it('should display a loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading.nativeElement).toBeDefined();
    });
  });

  describe('when the item failed loading', () => {
    beforeEach(() => {
      comp.itemRD$ = observableOf(new RemoteData(false, false, false, null, undefined));
      fixture.detectChanges();
    });

    it('should display an error component', () => {
      const error = fixture.debugElement.query(By.css('ds-error'));
      expect(error.nativeElement).toBeDefined();
    });
  });

});
