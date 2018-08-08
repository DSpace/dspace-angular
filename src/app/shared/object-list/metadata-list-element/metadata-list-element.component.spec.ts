import { MetadataListElementComponent } from './metadata-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { Item } from '../../../core/shared/item.model';
import { Observable } from 'rxjs/Observable';
import { Metadatum } from '../../../core/shared/metadatum.model';

let metadataListElementComponent: MetadataListElementComponent;
let fixture: ComponentFixture<MetadataListElementComponent>;

const mockValue: Metadatum = Object.assign(new Metadatum(), {
  key: 'dc.contributor.author',
  value: 'De Langhe Kristof'
});

describe('MetadataListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataListElementComponent , TruncatePipe],
      providers: [
        { provide: 'objectElementProvider', useValue: {mockValue}}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(MetadataListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MetadataListElementComponent);
    metadataListElementComponent = fixture.componentInstance;
  }));

  describe('When the metadatum is loaded', () => {
    beforeEach(() => {
      metadataListElementComponent.object = mockValue;
      fixture.detectChanges();
    });

    it('should show the value as a link', () => {
      const metadatumLink = fixture.debugElement.query(By.css('a.lead'));
      expect(metadatumLink.nativeElement.textContent.trim()).toBe(mockValue.value);
    });
  });
});
