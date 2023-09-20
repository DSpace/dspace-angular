import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';

// Import modules
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';
import { ItemDetailPageModalComponent } from './item-detail-page-modal.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Item } from '../core/shared/item.model';
import { ItemDataService } from '../core/data/item-data.service';
import { TabDataService } from '../core/layout/tab-data.service';
import { leadingTabs } from '../shared/testing/layout-tab.mocks';
import { Router } from '@angular/router';
import { RouterStub } from '../shared/testing/router.stub';



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
        'dc.title': [{ value: 'item' }]
      },
      uuid: 'testid123',
    }
  );

  const tabDataServiceMock: any = jasmine.createSpyObj('TabDataService', {
    findByItem: observableOf(leadingTabs)
  });

  describe('when empty subscriptions', () => {

    beforeEach(async () => {

      itemDataService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$(testItem)
      };

      await TestBed.configureTestingModule({
        imports: [
          CommonModule,
          NgbModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          }),
        ],
        declarations: [ItemDetailPageModalComponent],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: ItemDataService, useValue: itemDataService },
          { provide: TabDataService, useValue: tabDataServiceMock },
          { provide: Router, useValue: new RouterStub() },
        ]
      })
        .compileComponents();

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
