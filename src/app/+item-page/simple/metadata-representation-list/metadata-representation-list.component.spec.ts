import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MetadataRepresentationListComponent } from './metadata-representation-list.component';
import { RelationshipService } from '../../../core/data/relationship.service';
import { Item } from '../../../core/shared/item.model';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';
import { TranslateModule } from '@ngx-translate/core';

const itemType = 'Person';
const metadataField = 'dc.contributor.author';
const parentItem: Item = Object.assign(new Item(), {
  id: 'parent-item',
  metadata: {
    'dc.contributor.author': [
      {
        language: null,
        value: 'Related Author with authority',
        authority: 'virtual::related-author',
        place: 2
      },
      {
        language: null,
        value: 'Author without authority',
        place: 1
      }
    ],
    'dc.title': [
      {
        language: null,
        value: 'Parent Item'
      }
    ]
  }
});
const relatedAuthor: Item = Object.assign(new Item(), {
  id: 'related-author',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'Related Author'
      }
    ]
  }
});
const relation: Relationship = Object.assign(new Relationship(), {
  leftItem: createSuccessfulRemoteDataObject$(parentItem),
  rightItem: createSuccessfulRemoteDataObject$(relatedAuthor)
});
let relationshipService: RelationshipService;

describe('MetadataRepresentationListComponent', () => {
  let comp: MetadataRepresentationListComponent;
  let fixture: ComponentFixture<MetadataRepresentationListComponent>;

  relationshipService = jasmine.createSpyObj('relationshipService',
    {
      findById: createSuccessfulRemoteDataObject$(relation)
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MetadataRepresentationListComponent],
      providers: [
        { provide: RelationshipService, useValue: relationshipService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MetadataRepresentationListComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MetadataRepresentationListComponent);
    comp = fixture.componentInstance;
    comp.parentItem = parentItem;
    comp.itemType = itemType;
    comp.metadataField = metadataField;
    fixture.detectChanges();
  }));

  it('should load 2 ds-metadata-representation-loader components', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-metadata-representation-loader'));
    expect(fields.length).toBe(2);
  });

  it('should initialize the original limit', () => {
    expect(comp.originalLimit).toEqual(comp.limit);
  });

  describe('when viewMore is called', () => {
    beforeEach(() => {
      comp.viewMore();
    });

    it('should set the limit to a high number in order to retrieve all metadata representations', () => {
      expect(comp.limit).toBeGreaterThanOrEqual(999);
    });
  });

  describe('when viewLess is called', () => {
    let originalLimit;

    beforeEach(() => {
      // Store the original value of limit
      originalLimit = comp.limit;
      // Set limit to a random number
      comp.limit = 458;
      comp.viewLess();
    });

    it('should reset the limit to the original value', () => {
      expect(comp.limit).toEqual(originalLimit);
    });
  });

});
