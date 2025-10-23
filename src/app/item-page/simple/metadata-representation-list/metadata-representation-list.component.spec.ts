import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { BrowseDefinitionDataService } from '../../../core/browse/browse-definition-data.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { MetadatumRepresentation } from '../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { MetadataRepresentationLoaderComponent } from '../../../shared/metadata-representation/metadata-representation-loader.component';
import { BrowseDefinitionDataServiceStub } from '../../../shared/testing/browse-definition-data-service.stub';
import { VarDirective } from '../../../shared/utils/var.directive';
import { MetadataRepresentationListComponent } from './metadata-representation-list.component';

const itemType = 'Person';
const metadataFields = ['dc.contributor.author', 'dc.creator'];
const parentItem: Item = Object.assign(new Item(), {
  id: 'parent-item',
  metadata: {
    'dc.contributor.author': [
      {
        language: null,
        value: 'Related Author with authority',
        authority: 'virtual::related-author',
        place: 2,
      },
      {
        language: null,
        value: 'Author without authority',
        place: 1,
      },
    ],
    'dc.creator': [
      {
        language: null,
        value: 'Related Creator with authority',
        authority: 'virtual::related-creator',
        place: 3,
      },
      {
        language: null,
        value: 'Related Creator with authority - unauthorized',
        authority: 'virtual::related-creator-unauthorized',
        place: 4,
      },
    ],
    'dc.title': [
      {
        language: null,
        value: 'Parent Item',
      },
    ],
  },
});
const relatedAuthor: Item = Object.assign(new Item(), {
  id: 'related-author',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'Related Author',
      },
    ],
  },
});
const relatedCreator: Item = Object.assign(new Item(), {
  id: 'related-creator',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'Related Creator',
      },
    ],
    'dspace.entity.type': 'Person',
  },
});

describe('MetadataRepresentationListComponent', () => {
  let comp: MetadataRepresentationListComponent;
  let fixture: ComponentFixture<MetadataRepresentationListComponent>;

  let relationshipService;

  beforeEach(waitForAsync(() => {
    relationshipService = {
      resolveMetadataRepresentation: (metadatum: MetadataValue, parent: DSpaceObject, type: string) => {
        if (metadatum.value === 'Related Author with authority') {
          return of(Object.assign(new ItemMetadataRepresentation(metadatum), relatedAuthor));
        }
        if (metadatum.value === 'Author without authority') {
          return of(Object.assign(new MetadatumRepresentation(type), metadatum));
        }
        if (metadatum.value === 'Related Creator with authority') {
          return of(Object.assign(new ItemMetadataRepresentation(metadatum), relatedCreator));
        }
        if (metadatum.value === 'Related Creator with authority - unauthorized') {
          return of(Object.assign(new MetadatumRepresentation(type), metadatum));
        }
      },
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MetadataRepresentationListComponent, VarDirective],
      providers: [
        { provide: RelationshipDataService, useValue: relationshipService },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MetadataRepresentationListComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: { imports: [MetadataFieldWrapperComponent, MetadataRepresentationLoaderComponent, ThemedLoadingComponent] },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MetadataRepresentationListComponent);
    comp = fixture.componentInstance;
    comp.parentItem = parentItem;
    comp.itemType = itemType;
    comp.metadataFields = metadataFields;
    fixture.detectChanges();
  }));

  it('should load 4 ds-metadata-representation-loader components', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-metadata-representation-loader'));
    expect(fields.length).toBe(4);
  });

  it('should contain one page of items', () => {
    expect(comp.objects.length).toEqual(1);
  });

  describe('when increase is called', () => {
    beforeEach(() => {
      comp.increase();
    });

    it('should add a new page to the list', () => {
      expect(comp.objects.length).toEqual(2);
    });
  });

  describe('when decrease is called', () => {
    beforeEach(() => {
      // Add a second page
      comp.objects.push(of(undefined));
      comp.decrease();
    });

    it('should decrease the list of pages', () => {
      expect(comp.objects.length).toEqual(1);
    });
  });

});
