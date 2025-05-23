import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../core/shared/item.model';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { JournalVolumeSearchResultListElementComponent } from '../search-result-list-elements/journal-volume/journal-volume-search-result-list-element.component';
import { JournalVolumeListElementComponent } from './journal-volume-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: of({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'journal.title': [
      {
        language: 'en_US',
        value: 'This is just another journal title',
      },
    ],
    'publicationvolume.volumeNumber': [
      {
        language: 'en_US',
        value: '1234',
      },
    ],
  },
});

describe('JournalVolumeListElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => of(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, JournalVolumeListElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalVolumeListElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: { imports: [JournalVolumeSearchResultListElementComponent] },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalVolumeListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the journal volume is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a JournalVolumeListElementComponent`, () => {
      const journalVolumeListElement = fixture.debugElement.query(By.css(`ds-journal-volume-search-result-list-element`));
      expect(journalVolumeListElement).not.toBeNull();
    });
  });
});
