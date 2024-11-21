// Import modules
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ItemDataService } from '../core/data/item-data.service';
import { TabDataService } from '../core/layout/tab-data.service';
import { Item } from '../core/shared/item.model';
import { CrisLayoutComponent } from '../cris-layout/cris-layout.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { leadingTabs } from '../shared/testing/layout-tab.mocks';
import { RouterStub } from '../shared/testing/router.stub';
import { ItemDetailPageModalComponent } from './item-detail-page-modal.component';



describe('ItemDetailPageModalComponent', () => {
  let component: ItemDetailPageModalComponent;
  let fixture: ComponentFixture<ItemDetailPageModalComponent>;
  let de: DebugElement;


  let itemDataService: any;
  let testItem;

  testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.title': [{ value: 'item' }],
      },
      uuid: 'testid123',
    },
  );

  const tabDataServiceMock: any = jasmine.createSpyObj('TabDataService', {
    findByItem: observableOf(leadingTabs),
  });

  describe('when empty subscriptions', () => {

    beforeEach(async () => {

      itemDataService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$(testItem),
      };

      await TestBed.configureTestingModule({
        imports: [
          CommonModule,
          NgbModule,
          ItemDetailPageModalComponent,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: ItemDataService, useValue: itemDataService },
          { provide: TabDataService, useValue: tabDataServiceMock },
          { provide: Router, useValue: new RouterStub() },
        ],
      })
        .overrideComponent(ItemDetailPageModalComponent, { remove: { imports: [CrisLayoutComponent] } }).compileComponents();

      fixture = TestBed.createComponent(ItemDetailPageModalComponent);
      component = fixture.componentInstance;
      component.uuid = 'testid123';
      de = fixture.debugElement;

      fixture.detectChanges();

    });

    it('should be no table', () => {
      expect(component).toBeTruthy();
    });

    it('findById should have been called', () => {
      const serviceSpy = spyOn(itemDataService, 'findById').and.returnValue(createSuccessfulRemoteDataObject$(testItem));
      component.ngOnInit();
      fixture.detectChanges();
      expect(serviceSpy).toHaveBeenCalled();
    });

    it('getTabsFromItemId should have been called', () => {
      const getTabsFromItemIdSpy = spyOn(component, 'getTabsFromItemId');
      component.ngOnInit();
      fixture.detectChanges();
      expect(getTabsFromItemIdSpy).toHaveBeenCalled();
    });

    it('should have cris-layout', () => {
      expect(de.query(By.css('ds-cris-layout'))).toBeTruthy();
    });

  });

});
