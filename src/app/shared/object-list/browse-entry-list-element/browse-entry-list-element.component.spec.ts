import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { BrowseEntryListElementComponent } from './browse-entry-list-element.component';
import { BrowseEntry } from '../../../core/shared/browse-entry.model';

let browseEntryListElementComponent: BrowseEntryListElementComponent;
let fixture: ComponentFixture<BrowseEntryListElementComponent>;

const mockValue: BrowseEntry = Object.assign(new BrowseEntry(), {
  type: 'browseEntry',
  value: 'De Langhe Kristof'
});

describe('MetadataListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseEntryListElementComponent, TruncatePipe],
      providers: [
        { provide: 'objectElementProvider', useValue: { mockValue } }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(BrowseEntryListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(BrowseEntryListElementComponent);
    browseEntryListElementComponent = fixture.componentInstance;
  }));

  describe('When the metadata is loaded', () => {
    beforeEach(() => {
      browseEntryListElementComponent.object = mockValue;
      fixture.detectChanges();
    });

    it('should show the value as a link', () => {
      const browseEntryLink = fixture.debugElement.query(By.css('a.lead'));
      expect(browseEntryLink.nativeElement.textContent.trim()).toBe(mockValue.value);
    });
  });
});
