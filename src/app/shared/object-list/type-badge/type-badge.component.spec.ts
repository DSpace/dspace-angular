import { ItemSearchResult } from '../../object-collection/shared/item-search-result.model';
import { Item } from '../../../core/shared/item.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TypeBadgeComponent } from './type-badge.component';

let comp: TypeBadgeComponent;
let fixture: ComponentFixture<TypeBadgeComponent>;

const type = 'authorOfPublication';

const mockItemWithRelationshipType = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'relationship.type': [
      {
        language: 'en_US',
        value: type
      }
    ]
  }
});

const mockItemWithoutRelationshipType = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('ItemTypeBadgeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TypeBadgeComponent, TruncatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TypeBadgeComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TypeBadgeComponent);
    comp = fixture.componentInstance;
  }));

  describe('When the item has a relationship type', () => {
    beforeEach(() => {
      comp.object = mockItemWithRelationshipType;
      fixture.detectChanges();
    });

    it('should show the relationship type badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge.nativeElement.textContent).toContain(type.toLowerCase());
    });
  });

  describe('When the item has no relationship type', () => {
    beforeEach(() => {
      comp.object = mockItemWithoutRelationshipType;
      fixture.detectChanges();
    });

    it('should show an item badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge.nativeElement.textContent).toContain('item');
    });
  });
});
