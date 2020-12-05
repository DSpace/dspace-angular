import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of as observableOf } from 'rxjs';

import { ItemExportComponent } from './item-export.component';
import {
  ItemExportFormatMolteplicity,
  ItemExportFormatService
} from '../../../core/itemexportformat/item-export.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterMock } from '../../mocks/router.mock';
import { Router } from '@angular/router';
import { Item } from '../../../core/shared/item.model';

describe('ItemExportComponent', () => {
  let component: ItemExportComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ItemExportComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test'
        }
      ],
      'relationship.type': [
        {
          language: null,
          value: 'test'
        }
      ]
    }
  });

  const itemExportFormatService: any = jasmine.createSpyObj('ItemExportFormatService', {
    doExport: jasmine.createSpy('doExport'),
    doExportMulti: jasmine.createSpy('doExportMulti'),
    byEntityTypeAndMolteplicity: jasmine.createSpy('byEntityTypeAndMolteplicity')
  });

  const modal: any = jasmine.createSpyObj('NgbActiveModal', {
    close: jasmine.createSpy('close')
  });

  const router = new RouterMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ItemExportComponent],
      providers: [
        { provide: ItemExportFormatService, useValue: itemExportFormatService },
        { provide: NgbActiveModal, useValue: modal },
        { provide: Router, useValue: router }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.item = mockItem;
    component.molteplicity = ItemExportFormatMolteplicity.SINGLE;
    componentAsAny.itemExportFormatService.byEntityTypeAndMolteplicity.and.returnValue(observableOf({}))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
