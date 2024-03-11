import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../core/shared/item.model';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { JournalIssueListElementComponent } from './journal-issue-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'publicationvolume.volumeNumber': [
      {
        language: 'en_US',
        value: '1234',
      },
    ],
    'publicationissue.issueNumber': [
      {
        language: 'en_US',
        value: '5678',
      },
    ],
  },
});

describe('JournalIssueListElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JournalIssueListElementComponent, TruncatePipe],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalIssueListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalIssueListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the journal issue is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a JournalIssueListElementComponent`, () => {
      const journalIssueListElement = fixture.debugElement.query(By.css(`ds-journal-issue-search-result-list-element`));
      expect(journalIssueListElement).not.toBeNull();
    });
  });

});
