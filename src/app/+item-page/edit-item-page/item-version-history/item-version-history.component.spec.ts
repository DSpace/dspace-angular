import { ItemVersionHistoryComponent } from './item-version-history.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VarDirective } from '../../../shared/utils/var.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';

describe('ItemVersionHistoryComponent', () => {
  let component: ItemVersionHistoryComponent;
  let fixture: ComponentFixture<ItemVersionHistoryComponent>;

  const item = Object.assign(new Item(), {
    uuid: 'item-identifier-1',
    handle: '123456789/1',
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemVersionHistoryComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: { parent: { data: observableOf({ item: createSuccessfulRemoteDataObject(item) }) } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the itemRD$ from the route\'s data', (done) => {
    component.itemRD$.subscribe((itemRD) => {
      expect(itemRD.payload).toBe(item);
      done();
    });
  });
});
