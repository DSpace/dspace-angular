import { ItemEditBitstreamComponent } from './item-edit-bitstream.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { of as observableOf } from 'rxjs';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { ResponsiveTableSizes } from '../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { ResponsiveColumnSizes } from '../../../../shared/responsive-table-sizes/responsive-column-sizes';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { getBitstreamDownloadRoute } from '../../../../app-routing-paths';
import { By } from '@angular/platform-browser';
import { BrowserOnlyMockPipe } from '../../../../shared/testing/browser-only-mock.pipe';
import { RouterLinkDirectiveStub } from '../../../../shared/testing/router-link-directive.stub';
import { BitstreamChecksum } from '../../../../core/shared/bitstream-checksum.model';

let comp: ItemEditBitstreamComponent;
let fixture: ComponentFixture<ItemEditBitstreamComponent>;

const columnSizes = new ResponsiveTableSizes([
  new ResponsiveColumnSizes(2, 2, 3, 4, 4),
  new ResponsiveColumnSizes(2, 3, 3, 3, 3),
  new ResponsiveColumnSizes(1, 1, 1, 1, 1),
  new ResponsiveColumnSizes(5, 4, 3, 2, 2),
  new ResponsiveColumnSizes(2, 2, 2, 2, 2)
]);

const format = Object.assign(new BitstreamFormat(), {
  shortDescription: 'PDF'
});

const checksum = Object.assign(new BitstreamChecksum(), {
  activeStore: {
    checkSumAlgorithm: 'MD5',
    value: '123'
  },
  synchronizedStore: {
    checkSumAlgorithm: 'MD5',
    value: '456'
  },
  databaseChecksum: {
    checkSumAlgorithm: 'MD5',
    value: '789'
  }
});

const bitstream = Object.assign(new Bitstream(), {
  uuid: 'bitstreamUUID',
  name: 'Fake Bitstream',
  bundleName: 'ORIGINAL',
  description: 'Description',
  _links: {
    content: { href: 'content-link' }
  },

  format: createSuccessfulRemoteDataObject$(format),
  checksum: createSuccessfulRemoteDataObject$(checksum)
});
const fieldUpdate = {
  field: bitstream,
  changeType: undefined
};
const date = new Date();
const url = 'thisUrl';

let objectUpdatesService: ObjectUpdatesService;

describe('ItemEditBitstreamComponent', () => {
  beforeEach(waitForAsync(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [bitstream.uuid]: fieldUpdate,
        }),
        getFieldUpdatesExclusive: observableOf({
          [bitstream.uuid]: fieldUpdate,
        }),
        saveRemoveFieldUpdate: {},
        removeSingleFieldUpdate: {},
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        reinstateFieldUpdates: observableOf(true),
        initialize: {},
        getUpdatedFields: observableOf([bitstream]),
        getLastModified: observableOf(date),
        hasUpdates: observableOf(true),
        isReinstatable: observableOf(false),
        isValidPage: observableOf(true)
      }
    );

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        ItemEditBitstreamComponent,
        VarDirective,
        BrowserOnlyMockPipe,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditBitstreamComponent);
    comp = fixture.componentInstance;
    comp.fieldUpdate = fieldUpdate;
    comp.bundleUrl = url;
    comp.columnSizes = columnSizes;
    comp.ngOnChanges(undefined);
    fixture.detectChanges();
  });

  describe('when remove is called', () => {
    beforeEach(() => {
      comp.remove();
    });

    it('should call saveRemoveFieldUpdate on objectUpdatesService', () => {
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(url, bitstream);
    });
  });

  describe('when undo is called', () => {
    beforeEach(() => {
      comp.undo();
    });

    it('should call removeSingleFieldUpdate on objectUpdatesService', () => {
      expect(objectUpdatesService.removeSingleFieldUpdate).toHaveBeenCalledWith(url, bitstream.uuid);
    });
  });

  describe('when canRemove is called', () => {
    it('should return true', () => {
      expect(comp.canRemove()).toEqual(true);
    });
  });

  describe('when canUndo is called', () => {
    it('should return false', () => {
      expect(comp.canUndo()).toEqual(false);
    });
  });

  describe('when the component loads', () => {
    it('should contain download button with a valid link to the bitstreams download page', () => {
      fixture.detectChanges();
      const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
      const routerLinkQuery = linkDes.map((de) => de.injector.get(RouterLinkDirectiveStub));

      expect(routerLinkQuery.length).toBe(2);
      expect(routerLinkQuery[0].routerLink).toBe(comp.bitstreamDownloadUrl);
    });
  });

  describe('when the bitstreamDownloadUrl property gets populated', () => {
    it('should contain the bitstream download page route', () => {
      expect(comp.bitstreamDownloadUrl).not.toEqual(bitstream._links.content.href);
      expect(comp.bitstreamDownloadUrl).toEqual(getBitstreamDownloadRoute(bitstream));
    });
  });
});
