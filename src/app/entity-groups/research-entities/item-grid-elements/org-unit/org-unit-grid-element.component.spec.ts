import { Item } from '../../../../core/shared/item.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { OrgUnitGridElementComponent } from './org-unit-grid-element.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'organization.foundingDate': [
      {
        language: null,
        value: '2015-06-26'
      }
    ],
    'organization.address.addressCountry': [
      {
        language: 'en_US',
        value: 'Belgium'
      }
    ],
    'organization.address.addressLocality': [
      {
        language: 'en_US',
        value: 'Brussels'
      }
    ]
  }
});

describe('OrgUnitGridElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [OrgUnitGridElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(OrgUnitGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrgUnitGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the org unit is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a OrgUnitGridElementComponent`, () => {
      const orgUnitGridElement = fixture.debugElement.query(By.css(`ds-org-unit-search-result-grid-element`));
      expect(orgUnitGridElement).not.toBeNull();
    });
  });
});
