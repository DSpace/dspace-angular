import { ItemEditBitstreamComponent } from './item-edit-bitstream.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { createMockRDObs } from '../item-bitstreams.component.spec';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { By } from '@angular/platform-browser';

let comp: ItemEditBitstreamComponent;
let fixture: ComponentFixture<ItemEditBitstreamComponent>;

const format = Object.assign(new BitstreamFormat(), {
  shortDescription: 'PDF'
});
const bitstream = Object.assign(new Bitstream(), {
  uuid: 'bitstreamUUID',
  name: 'Fake Bitstream',
  bundleName: 'ORIGINAL',
  description: 'Description',
  format: createMockRDObs(format)
});
const fieldUpdate = {
  field: bitstream,
  changeType: undefined
};
const date = new Date();
const url = 'thisUrl';

let objectUpdatesService: ObjectUpdatesService;

describe('ItemEditBitstreamComponent', () => {
  let tdElements: DebugElement[];

  beforeEach(async(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [bitstream.uuid]: fieldUpdate,
        }),
        getFieldUpdatesExclusive: observableOf({
          [bitstream.uuid]: fieldUpdate,
        }),
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
      declarations: [ItemEditBitstreamComponent, VarDirective],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService }
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditBitstreamComponent);
    comp = fixture.componentInstance;
    comp.fieldUpdate = fieldUpdate;
    comp.url = url;
    comp.ngOnChanges(undefined);
    fixture.detectChanges();

    tdElements = fixture.debugElement.queryAll(By.css('td'));
  });

  it('should display the bitstream\'s name in the first table cell', () => {
    expect(tdElements[0].nativeElement.textContent.trim()).toEqual(bitstream.name);
  });

  it('should display the bitstream\'s bundle in the second table cell', () => {
    expect(tdElements[1].nativeElement.textContent.trim()).toEqual(bitstream.bundleName);
  });

  it('should display the bitstream\'s description in the third table cell', () => {
    expect(tdElements[2].nativeElement.textContent.trim()).toEqual(bitstream.description);
  });

  it('should display the bitstream\'s format in the fourth table cell', () => {
    expect(tdElements[3].nativeElement.textContent.trim()).toEqual(format.shortDescription);
  });
});
