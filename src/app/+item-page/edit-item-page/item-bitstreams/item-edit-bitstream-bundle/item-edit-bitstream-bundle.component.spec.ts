import { ItemEditBitstreamBundleComponent } from './item-edit-bitstream-bundle.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { createMockRDObs } from '../item-bitstreams.component.spec';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { BundleDataService } from '../../../../core/data/bundle-data.service';
import { createPaginatedList, createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';
import { ObjectValuesPipe } from '../../../../shared/utils/object-values-pipe';
import { Item } from '../../../../core/shared/item.model';
import { Bundle } from '../../../../core/shared/bundle.model';

describe('ItemEditBitstreamBundleComponent', () => {
  let comp: ItemEditBitstreamBundleComponent;
  let fixture: ComponentFixture<ItemEditBitstreamBundleComponent>;

  let objectUpdatesService: ObjectUpdatesService;
  let bundleService: BundleDataService;

  const item = Object.assign(new Item(), {
    id: 'item-1',
    uuid: 'item-1'
  });
  const bundle = Object.assign(new Bundle(), {
    id: 'bundle-1',
    uuid: 'bundle-1',
    self: 'bundle-1-selflink'
  });
  const date = new Date();
  const format = Object.assign(new BitstreamFormat(), {
    shortDescription: 'PDF'
  });
  const bitstream1 = Object.assign(new Bitstream(), {
    uuid: 'bitstreamUUID1',
    name: 'Fake Bitstream 1',
    bundleName: 'ORIGINAL',
    description: 'Description',
    format: createMockRDObs(format)
  });
  const fieldUpdate1 = {
    field: bitstream1,
    changeType: undefined
  };
  const bitstream2 = Object.assign(new Bitstream(), {
    uuid: 'bitstreamUUID2',
    name: 'Fake Bitstream 2',
    bundleName: 'ORIGINAL',
    description: 'Description',
    format: createMockRDObs(format)
  });
  const fieldUpdate2 = {
    field: bitstream2,
    changeType: undefined
  };
  const batchSize = 10;

  beforeEach(async(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        getFieldUpdatesExclusive: observableOf({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        getFieldUpdatesByCustomOrder: observableOf({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        saveMoveFieldUpdate: {},
        saveRemoveFieldUpdate: {},
        removeSingleFieldUpdate: {},
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        reinstateFieldUpdates: observableOf(true),
        initialize: {},
        getUpdatedFields: observableOf([bitstream1, bitstream2]),
        getLastModified: observableOf(date),
        hasUpdates: observableOf(true),
        isReinstatable: observableOf(false),
        isValidPage: observableOf(true)
      }
    );

    bundleService = jasmine.createSpyObj('bundleService', {
      getBitstreams: createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1, bitstream2]))
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemEditBitstreamBundleComponent, VarDirective, ObjectValuesPipe],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: BundleDataService, useValue: bundleService }
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditBitstreamBundleComponent);
    comp = fixture.componentInstance;
    comp.item = item;
    comp.bundle = bundle;
    comp.batchSize = batchSize;
    fixture.detectChanges();
  });

  describe('A drag-and-drop event', () => {
    it('should send a move update to the objectUpdatesService', () => {
      const event = {
        previousIndex: 0,
        currentIndex: 1
      };
      comp.drop(event as any);
      expect(objectUpdatesService.saveMoveFieldUpdate).toHaveBeenCalledWith(bundle.self, event.previousIndex, event.currentIndex);
    });
  });

  describe('loadMore', () => {
    it('should increase the current size by ' + batchSize, () => {
      const initialSize = comp.currentSize$.value;
      comp.loadMore();
      const newSize = comp.currentSize$.value;
      expect(initialSize + batchSize).toEqual(newSize);
    });
  });

  describe('loadAll', () => {
    it('should increase the current size by a lot', () => {
      comp.loadAll();
      const newSize = comp.currentSize$.value;
      expect(newSize).toBeGreaterThanOrEqual(999);
    });
  });
});
