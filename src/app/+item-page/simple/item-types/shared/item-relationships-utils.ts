import { hasValue } from '../../../../shared/empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { zip as observableZip } from 'rxjs';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';

/**
 * Operator for comparing arrays using a mapping function
 * The mapping function should turn the source array into an array of basic types, so that the array can
 * be compared using these basic types.
 * For example: "(o) => o.id" will compare the two arrays by comparing their content by id.
 * @param mapFn   Function for mapping the arrays
 */
export const compareArraysUsing = <T>(mapFn: (t: T) => any) =>
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
export const compareArraysUsingIds = <T extends { id: string }>() =>
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
        observableZip(
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
