import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { MetadataRepresentationType } from '@dspace/core/shared/metadata-representation/metadata-representation.model';
import { MetadatumRepresentation } from '@dspace/core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { ValueListBrowseDefinition } from '@dspace/core/shared/value-list-browse-definition.model';

import { MetadataLinkViewComponent } from '../../../metadata-link-view/metadata-link-view.component';
import { AuthorityLinkMetadataListElementComponent } from './authority-link-metadata-list-element.component';


const mockMetadataRepresentation = Object.assign(new MetadatumRepresentation('type'), {
  key: 'dc.contributor.author',
  value: 'Test Author',
  browseDefinition: Object.assign(new ValueListBrowseDefinition(), {
    id: 'author',
  }),
} as Partial<MetadatumRepresentation>);

const itemService = jasmine.createSpyObj('ItemDataService', {
  findByIdWithProjections: jasmine.createSpy('findByIdWithProjections'),
});

describe('AuthorityLinkMetadataListElementComponent', () => {
  let comp: AuthorityLinkMetadataListElementComponent;
  let fixture: ComponentFixture<AuthorityLinkMetadataListElementComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [AuthorityLinkMetadataListElementComponent, MetadataLinkViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ItemDataService, useValue: itemService },
      ],
    }).overrideComponent(AuthorityLinkMetadataListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityLinkMetadataListElementComponent);
    comp = fixture.componentInstance;
  });

  describe('with authorithy controlled metadata', () => {
    beforeEach(() => {
      comp.mdRepresentation = mockMetadataRepresentation;
      spyOnProperty(comp.mdRepresentation, 'representationType', 'get').and.returnValue(MetadataRepresentationType.AuthorityControlled);
      fixture.detectChanges();
    });

    it('should contain the value', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(mockMetadataRepresentation.value);
    });

  });

});
