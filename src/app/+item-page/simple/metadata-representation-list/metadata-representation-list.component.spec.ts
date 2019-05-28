import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MetadataRepresentationListComponent } from './metadata-representation-list.component';
import { MetadatumRepresentation } from '../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';

const itemType = 'type';
const metadataRepresentation1 = new MetadatumRepresentation(itemType);
const metadataRepresentation2 = new ItemMetadataRepresentation();
const representations = [metadataRepresentation1, metadataRepresentation2];

describe('MetadataRepresentationListComponent', () => {
  let comp: MetadataRepresentationListComponent;
  let fixture: ComponentFixture<MetadataRepresentationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [MetadataRepresentationListComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MetadataRepresentationListComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MetadataRepresentationListComponent);
    comp = fixture.componentInstance;
    comp.representations = representations;
    fixture.detectChanges();
  }));

  it(`should load ${representations.length} item-type-switcher components`, () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-type-switcher'));
    expect(fields.length).toBe(representations.length);
  });

});
