import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { RelatedEntitiesComponent } from './related-entities-component';
import { Item } from '../../../core/shared/item.model';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { By } from '@angular/platform-browser';
import { createRelationshipsObservable } from '../entity-types/shared/entity.component.spec';

const mockItem1: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockItem2: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockEntities = [mockItem1, mockItem2];

describe('RelatedEntitiesComponent', () => {
  let comp: RelatedEntitiesComponent;
  let fixture: ComponentFixture<RelatedEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [RelatedEntitiesComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(RelatedEntitiesComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RelatedEntitiesComponent);
    comp = fixture.componentInstance;
    comp.entities = mockEntities;
    fixture.detectChanges();
  }));

  it(`should load ${mockEntities.length} entity-type-switcher components`, () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-entity-type-switcher'));
    expect(fields.length).toBe(mockEntities.length);
  });

});
