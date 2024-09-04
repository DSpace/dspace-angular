import { ItemEditBitstreamBundleComponent } from './item-edit-bitstream-bundle.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { Bundle } from '../../../../core/shared/bundle.model';
import { ResponsiveTableSizes } from '../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { ResponsiveColumnSizes } from '../../../../shared/responsive-table-sizes/responsive-column-sizes';
import { BundleDataService } from '../../../../core/data/bundle-data.service';
import { of as observableOf } from 'rxjs';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { RequestService } from '../../../../core/data/request.service';
import { getMockRequestService } from '../../../../shared/mocks/request.service.mock';
import { ItemBitstreamsService } from '../item-bitstreams.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';

describe('ItemEditBitstreamBundleComponent', () => {
  let comp: ItemEditBitstreamBundleComponent;
  let fixture: ComponentFixture<ItemEditBitstreamBundleComponent>;
  let viewContainerRef: ViewContainerRef;

  const columnSizes = new ResponsiveTableSizes([
    new ResponsiveColumnSizes(2, 2, 3, 4, 4),
    new ResponsiveColumnSizes(2, 3, 3, 3, 3),
    new ResponsiveColumnSizes(2, 2, 2, 2, 2),
    new ResponsiveColumnSizes(6, 5, 4, 3, 3)
  ]);

  const item = Object.assign(new Item(), {
    id: 'item-1',
    uuid: 'item-1'
  });
  const bundle = Object.assign(new Bundle(), {
    id: 'bundle-1',
    uuid: 'bundle-1',
    _links: {
      self: { href: 'bundle-1-selflink' }
    }
  });

  const restEndpoint = 'fake-rest-endpoint';
  const bundleService = jasmine.createSpyObj('bundleService', {
    getBitstreamsEndpoint: observableOf(restEndpoint),
    getBitstreams: null,
  });

  const objectUpdatesService = {
    initialize: () => {
      // do nothing
    },
  };

  const itemBitstreamsService = jasmine.createSpyObj('itemBitstreamsService', {
    getInitialBitstreamsPaginationOptions: Object.assign(new PaginationComponentOptions(), {
      id: 'bundles-pagination-options',
      currentPage: 1,
      pageSize: 9999
    }),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemEditBitstreamBundleComponent],
      providers: [
        { provide: BundleDataService, useValue: bundleService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: RequestService, useValue: getMockRequestService() },
        { provide: ItemBitstreamsService, useValue: itemBitstreamsService },
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditBitstreamBundleComponent);
    comp = fixture.componentInstance;
    comp.item = item;
    comp.bundle = bundle;
    comp.columnSizes = columnSizes;
    viewContainerRef = (comp as any).viewContainerRef;
    spyOn(viewContainerRef, 'createEmbeddedView');
    fixture.detectChanges();
  });

  it('should create an embedded view of the component', () => {
    expect(viewContainerRef.createEmbeddedView).toHaveBeenCalled();
  });
});
