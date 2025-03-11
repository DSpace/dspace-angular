import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { Item } from '../../../../core/shared/item.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { PersonSearchResultGridElementComponent } from '../search-result-grid-elements/person/person-search-result-grid-element.component';
import { PersonGridElementComponent } from './person-grid-element.component';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'person.email': [
      {
        language: 'en_US',
        value: 'Smith-Donald@gmail.com',
      },
    ],
    'person.jobTitle': [
      {
        language: 'en_US',
        value: 'Web Developer',
      },
    ],
  },
});

describe('PersonGridElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TruncatePipe, PersonGridElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PersonGridElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: { imports: [PersonSearchResultGridElementComponent] },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PersonGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the person is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a PersonGridElementComponent`, () => {
      const personGridElement = fixture.debugElement.query(By.css(`ds-person-search-result-grid-element`));
      expect(personGridElement).not.toBeNull();
    });
  });
});
