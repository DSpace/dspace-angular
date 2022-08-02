import { ResourceTypeListElementComponent } from './resource-type-list-element.component';

import { Item } from '../../../core/shared/item.model';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from '../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../shared/truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'resourcetypes.​name': [
      {
        language: null,
        value: 'doctoral thesis'
      }
    ],
    'resourcetypes.definition': [
      {
        language: null,
        value: 'A thesis reporting the research undertaken during a period of graduate study leading to a doctoral degree.'
      }
    ],
    'resourcetypes.preferredLabels': [
      {
        language: 'en',
        value: 'doctoral thesis'
      },
      {
        language: 'es',
        value: 'tesis doctoral'
      },
      {
        language: 'fr',
        value: 'thèse de doctorat'
      },
      {
        language: 'de',
        value: 'Dissertation'
      },
      {
        language: 'it',
        value: 'tesi di dottorato'
      },
    ],
    'resourcetypes.​relatedTerms': [
      {
        language: null,
        value: 'Broad Match: http://purl.org/eprint/type/Thesis'
      }
    ],
    'resourcetypes.uri': [
      {
        language: null,
        value: 'http://purl.org/coar/resource_type/c_db06'
      }
    ]
  }
});

describe('ResourceTypeListElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ResourceTypeListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ResourceTypeListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ResourceTypeListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the resource type is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a ResourceTypeListElementComponent`, () => {
      const resourceTypeListElement = fixture.debugElement.query(By.css(`ds-resource-type-search-result-list-element`));
      expect(resourceTypeListElement).not.toBeNull();
    });
  });
});
