import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { PlainTextMetadataListElementComponent } from './plain-text-metadata-list-element.component';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';

const mockMetadataRepresentation = Object.assign(new MetadatumRepresentation('type'), {
  key: 'dc.contributor.author',
  value: 'Test Author'
});

describe('PlainTextMetadataListElementComponent', () => {
  let comp: PlainTextMetadataListElementComponent;
  let fixture: ComponentFixture<PlainTextMetadataListElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [PlainTextMetadataListElementComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PlainTextMetadataListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PlainTextMetadataListElementComponent);
    comp = fixture.componentInstance;
    comp.metadataRepresentation = mockMetadataRepresentation;
    fixture.detectChanges();
  }));

  it('should contain the value as plain text', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(mockMetadataRepresentation.value);
  });

});
