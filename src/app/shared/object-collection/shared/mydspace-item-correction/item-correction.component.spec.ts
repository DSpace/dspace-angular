import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ItemCorrectionComponent } from './item-correction.component';
import { TranslateLoaderMock } from '../../../testing/translate-loader.mock';
import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { cold } from 'jasmine-marbles';

let component: ItemCorrectionComponent;
let fixture: ComponentFixture<ItemCorrectionComponent>;
let relationshipService: any;
const mockRelationshipService = jasmine.createSpyObj('relationshipService',
  {
    getItemRelationshipsByLabel: jasmine.createSpy('getItemRelationshipsByLabel')
  }
);

const relationship = Object.assign(new Relationship(), {
  _links: {
    self: {
      href: 'dspacerest/2'
    }
  },
  id: '1',
  uuid: '1',
  leftId: 'author1',
  rightId: 'publication',
});

const relationshipPaginatedList = buildPaginatedList(new PageInfo(), [relationship]);
const relationshipPaginatedListEmpty = buildPaginatedList(new PageInfo(), [relationship]);
const relationshipPaginatedListRD = createSuccessfulRemoteDataObject(relationshipPaginatedList);
const relationshipPaginatedListEmptyRD = createSuccessfulRemoteDataObject(relationshipPaginatedListEmpty);

describe('ItemCorrectionComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ItemCorrectionComponent],
      providers: [
        { provide: RelationshipDataService, useValue: mockRelationshipService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemCorrectionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemCorrectionComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    relationshipService = TestBed.inject(RelationshipDataService);

  });

  it('should show a badge when item is a correction', () => {
    relationshipService.getItemRelationshipsByLabel.and.returnValue(cold('a', {
      a: relationshipPaginatedListRD
    }));
    fixture.detectChanges();
    const badge = fixture.debugElement.query(By.css('.text-muted'));

    expect(badge).toBeDefined();
  });

  it('should not show a badge when item is not a correction', () => {
    relationshipService.getItemRelationshipsByLabel.and.returnValue(cold('a', {
      a: relationshipPaginatedListEmptyRD
    }));
    fixture.detectChanges();
    const badge = fixture.debugElement.query(By.css('.text-muted'));

    expect(badge).toBeNull();
  });
});
