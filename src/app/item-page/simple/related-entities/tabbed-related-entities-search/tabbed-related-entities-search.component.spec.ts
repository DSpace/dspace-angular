import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Item } from '@dspace/core/shared/item.model';
import { RouterMock } from '@dspace/core/testing/router.mock';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { VarDirective } from '../../../../shared/utils/var.directive';
import { RelatedEntitiesSearchComponent } from '../related-entities-search/related-entities-search.component';
import { TabbedRelatedEntitiesSearchComponent } from './tabbed-related-entities-search.component';

describe('TabbedRelatedEntitiesSearchComponent', () => {
  let comp: TabbedRelatedEntitiesSearchComponent;
  let fixture: ComponentFixture<TabbedRelatedEntitiesSearchComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'id1',
  });
  const mockRelationType = 'publications';
  const relationTypes = [
    {
      label: mockRelationType,
      filter: mockRelationType,
    },
  ];

  const router = new RouterMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, NgbModule, TabbedRelatedEntitiesSearchComponent, VarDirective],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ tab: mockRelationType }),
            snapshot: {
              queryParams: {
                scope: 'collection-uuid',
                query: 'test',
              },
            },
          },
        },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TabbedRelatedEntitiesSearchComponent, {
        remove: {
          imports: [
            RelatedEntitiesSearchComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbedRelatedEntitiesSearchComponent);
    comp = fixture.componentInstance;
    comp.item = mockItem;
    comp.relationTypes = relationTypes;
    fixture.detectChanges();
  });

  it('should initialize the activeTab depending on the current query parameters', () => {
    comp.activeTab$.subscribe((activeTab) => {
      expect(activeTab).toEqual(mockRelationType);
    });
  });

  describe('onTabChange', () => {
    const event = {
      currentId: mockRelationType,
      nextId: 'nextTab',
    };

    beforeEach(() => {
      comp.onTabChange(event);
    });

    it('should call router natigate with the correct arguments', () => {
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: (comp as any).route,
        queryParams: {
          tab: event.nextId,
          query: 'test',
          scope: 'collection-uuid',
          'spc.page': 1,
        },
      });
    });
  });

});
