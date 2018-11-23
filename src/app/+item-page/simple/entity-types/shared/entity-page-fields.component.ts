import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, filter, flatMap, map } from 'rxjs/operators';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { RelationshipType } from '../../../../core/shared/entities/relationship-type.model';
import { Relationship } from '../../../../core/shared/entities/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { getRemoteDataPayload } from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';

/**
 * Operator for comparing arrays using a mapping function
 * @param mapFn   Function for mapping the arrays
 */
const compareArraysUsing = <T>(mapFn: (t: T) => any) =>
  (a: T[], b: T[]): boolean => {
    if (!Array.isArray(a) || ! Array.isArray(b)) {
      return false
    }

    const aIds = a.map(mapFn);
    const bIds = b.map(mapFn);

    return aIds.length === bIds.length &&
      aIds.every((e) => bIds.includes(e)) &&
      bIds.every((e) => aIds.includes(e));
  };

/**
 * Operator for comparing arrays using the object's ids
 */
const compareArraysUsingIds = <T extends { id: string }>() =>
  compareArraysUsing((t: T) => hasValue(t) ? t.id : undefined);

/**
 * Fetch the relationships which match the type label given
 * @param {string} label      Type label
 * @returns {(source: Observable<[Relationship[] , RelationshipType[]]>) => Observable<Relationship[]>}
 */
export const filterRelationsByTypeLabel = (label: string) =>
  (source: Observable<[Relationship[], RelationshipType[]]>): Observable<Relationship[]> =>
    source.pipe(
      map(([relsCurrentPage, relTypesCurrentPage]) =>
        relsCurrentPage.filter((rel: Relationship, idx: number) =>
          hasValue(relTypesCurrentPage[idx]) && (relTypesCurrentPage[idx].leftLabel === label ||
          relTypesCurrentPage[idx].rightLabel === label)
        )
      ),
      distinctUntilChanged(compareArraysUsingIds())
    );

/**
 * Operator for turning a list of relationships into a list of the relevant items
 * @param {string} thisId           The item's id of which the relations belong to
 * @param {ItemDataService} ids     The ItemDataService to fetch items from the REST API
 * @returns {(source: Observable<Relationship[]>) => Observable<Item[]>}
 */
export const relationsToItems = (thisId: string, ids: ItemDataService) =>
  (source: Observable<Relationship[]>): Observable<Item[]> =>
    source.pipe(
      flatMap((rels: Relationship[]) =>
        Observable.zip(
          ...rels.map((rel: Relationship) => {
            let queryId = rel.leftId;
            if (rel.leftId === thisId) {
              queryId = rel.rightId;
            }
            return ids.findById(queryId);
          })
        )
      ),
      map((arr: Array<RemoteData<Item>>) =>
        arr
          .filter((d: RemoteData<Item>) => d.hasSucceeded)
          .map((d: RemoteData<Item>) => d.payload)),
      distinctUntilChanged(compareArraysUsingIds()),
    );

@Component({
  selector: 'ds-entity-page-fields',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class EntityPageFieldsComponent implements OnInit {
  /**
   * Resolved relationships and types together in one observable
   */
  resolvedRelsAndTypes$: Observable<[Relationship[], RelationshipType[]]>

  constructor(
    @Inject(ITEM) public item: Item
  ) {}

  ngOnInit(): void {
    const relationships$ = this.item.relationships;
    if (relationships$) {
      const relsCurrentPage$ = relationships$.pipe(
        filter((rd: RemoteData<PaginatedList<Relationship>>) => rd.hasSucceeded),
        getRemoteDataPayload(),
        map((pl: PaginatedList<Relationship>) => pl.page),
        distinctUntilChanged(compareArraysUsingIds())
      );

      const relTypesCurrentPage$ = relsCurrentPage$.pipe(
        flatMap((rels: Relationship[]) =>
          Observable.zip(
            ...rels.map((rel: Relationship) => rel.relationshipType),
            (...arr: Array<RemoteData<RelationshipType>>) =>
              arr.map((d: RemoteData<RelationshipType>) => d.payload)
          )
        ),
        distinctUntilChanged(compareArraysUsingIds())
      );

      this.resolvedRelsAndTypes$ = Observable.combineLatest(
        relsCurrentPage$,
        relTypesCurrentPage$
      );
    }
  }

}
