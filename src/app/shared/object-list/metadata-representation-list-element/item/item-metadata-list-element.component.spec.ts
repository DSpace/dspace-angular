import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ITEM } from '../../../items/switcher/item-type-switcher.component';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemMetadataListElementComponent } from './item-metadata-list-element.component';
import { By } from '@angular/platform-browser';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';

const mockItemMetadataRepresentation = new ItemMetadataRepresentation();

describe('ItemMetadataListElementComponent', () => {
  let comp: ItemMetadataListElementComponent;
  let fixture: ComponentFixture<ItemMetadataListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ItemMetadataListElementComponent],
      providers: [
        { provide: ITEM, useValue: mockItemMetadataRepresentation }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemMetadataListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemMetadataListElementComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should call an item-type-switcher component and pass the item-metadata-representation', () => {
    const itemTypeSwitcher = fixture.debugElement.query(By.css('ds-item-type-switcher')).nativeElement;
    expect(itemTypeSwitcher.object).toBe(mockItemMetadataRepresentation);
  });

});
