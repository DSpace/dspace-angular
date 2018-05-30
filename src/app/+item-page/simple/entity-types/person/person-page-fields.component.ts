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
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../switcher/entity-type-switcher.component';

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

const filterRelationsByTypeLabel = (label: string) =>
  (source: Observable<[Relationship[], RelationshipType[]]>): Observable<Relationship[]> =>
    source.pipe(
      map(([relsCurrentPage, relTypesCurrentPage]) =>
        relsCurrentPage.filter((rel: Relationship, idx: number) =>
          hasValue(relTypesCurrentPage[idx]) && (relTypesCurrentPage[idx].leftLabel === label ||
          relTypesCurrentPage[idx].rightLabel === label)
        )
      ),
      distinctUntilChanged(compareArraysUsing((e: Relationship) => hasValue(e) ? e.id : undefined))
    );

const relationsToItems = (thisId: string, ids: ItemDataService) =>
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
      distinctUntilChanged(compareArraysUsing((rdi: Item) => hasValue(rdi) ? rdi.uuid : undefined)),
    );


@rendersEntityType('Person', ElementViewMode.Full)
@Component({
  selector: 'ds-person-page-fields',
  styleUrls: ['./person-page-fields.component.scss'],
  templateUrl: './person-page-fields.component.html'
})
export class PersonPageFieldsComponent implements OnInit {
  publications$: Observable<Item[]>;
  projects$: Observable<Item[]>;
  orgUnits$: Observable<Item[]>;

  constructor(
    @Inject(ITEM) public item: Item,
    private ids: ItemDataService
  ) {}

  ngOnInit(): void {
    const relsCurrentPage$ = this.item.relationships.pipe(
      filter((rd: RemoteData<PaginatedList<Relationship>>) => rd.hasSucceeded),
      getRemoteDataPayload(),
      map((pl: PaginatedList<Relationship>) => pl.page),
      distinctUntilChanged(compareArraysUsing((e: Relationship) => hasValue(e) ? e.id : undefined))
    );

    const relTypesCurrentPage$ = relsCurrentPage$.pipe(
      flatMap((rels: Relationship[]) =>
        Observable.zip(
          ...rels.map((rel: Relationship) => rel.relationshipType),
          (...arr: Array<RemoteData<RelationshipType>>) =>
            arr.map((d: RemoteData<RelationshipType>) => d.payload)
        )
      ),
      distinctUntilChanged(compareArraysUsing((e: RelationshipType) => hasValue(e) ? e.id : undefined))
    );

    const resolvedRelsAndTypes$ = Observable.combineLatest(
      relsCurrentPage$,
      relTypesCurrentPage$
    );

    this.publications$ = resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel('isPublicationOfAuthor'),
      relationsToItems(this.item.id, this.ids)
    );

    this.projects$ = resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel('isProjectOfPerson'),
      relationsToItems(this.item.id, this.ids)
    );

    this.orgUnits$ = resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel('isOrgUnitOfPerson'),
      relationsToItems(this.item.id, this.ids)
    );
  }

}
