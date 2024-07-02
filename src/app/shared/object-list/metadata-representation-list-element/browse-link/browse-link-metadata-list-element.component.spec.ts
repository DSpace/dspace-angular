import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { ValueListBrowseDefinition } from '../../../../core/shared/value-list-browse-definition.model';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { BrowseLinkMetadataListElementComponent } from './browse-link-metadata-list-element.component';

const mockMetadataRepresentation = Object.assign(new MetadatumRepresentation('type'), {
  key: 'dc.contributor.author',
  value: 'Test Author',
  browseDefinition: Object.assign(new ValueListBrowseDefinition(), {
    id: 'author',
  }),
} as Partial<MetadatumRepresentation>);

const mockMetadataRepresentationWithUrl = Object.assign(new MetadatumRepresentation('type'), {
  key: 'dc.subject',
  value: 'https://purl.org/test/subject',
  browseDefinition: Object.assign(new ValueListBrowseDefinition(), {
    id: 'subject',
  }),
} as Partial<MetadatumRepresentation>);

describe('BrowseLinkMetadataListElementComponent', () => {
  let comp: BrowseLinkMetadataListElementComponent;
  let fixture: ComponentFixture<BrowseLinkMetadataListElementComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [BrowseLinkMetadataListElementComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).overrideComponent(BrowseLinkMetadataListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseLinkMetadataListElementComponent);
    comp = fixture.componentInstance;
  });

  describe('with normal metadata', () => {
    beforeEach(() => {
      comp.mdRepresentation = mockMetadataRepresentation;
      spyOnProperty(comp.mdRepresentation, 'representationType', 'get').and.returnValue(MetadataRepresentationType.BrowseLink);
      fixture.detectChanges();
    });

    it('should contain the value as a browse link', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(mockMetadataRepresentation.value);
    });

    it('should NOT match isLink', () => {
      expect(comp.isLink()).toBe(false);
    });
  });

  describe('with metadata wit an url', () => {
    beforeEach(() => {
      comp.mdRepresentation = mockMetadataRepresentationWithUrl;
      spyOnProperty(comp.mdRepresentation, 'representationType', 'get').and.returnValue(MetadataRepresentationType.BrowseLink);
      fixture.detectChanges();
    });

    it('should contain the value expected', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(mockMetadataRepresentationWithUrl.value);
    });

    it('should match isLink', () => {
      expect(comp.isLink()).toBe(true);
    });
  });

});
