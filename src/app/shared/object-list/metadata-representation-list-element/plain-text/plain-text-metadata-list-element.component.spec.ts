import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { PlainTextMetadataListElementComponent } from './plain-text-metadata-list-element.component';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { ITEM } from '../../../items/switcher/item-type-switcher.component';

const mockMetadataRepresentation = Object.assign(new MetadatumRepresentation('type'), {
  key: 'dc.contributor.author',
  value: 'Test Author'
});

describe('PlainTextMetadataListElementComponent', () => {
  let comp: PlainTextMetadataListElementComponent;
  let fixture: ComponentFixture<PlainTextMetadataListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [PlainTextMetadataListElementComponent],
      providers: [
        { provide: ITEM, useValue: mockMetadataRepresentation }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PlainTextMetadataListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlainTextMetadataListElementComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should contain the value as plain text', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(mockMetadataRepresentation.value);
  });

});
