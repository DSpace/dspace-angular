import { Component, Inject } from '@angular/core';
import ensureArray from 'rollup/dist/typings/utils/ensureArray';
import { Observable } from 'rxjs/Observable';
import { filter, flatMap, map } from 'rxjs/operators';
import { relationship } from '../../../../core/cache/builders/build-decorators';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { RelationshipType } from '../../../../core/shared/entities/relationship-type.model';
import { Relationship } from '../../../../core/shared/entities/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { getRemoteDataPayload } from '../../../../core/shared/operators';
import { ensureArrayHasValue, hasValue } from '../../../../shared/empty.util';
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../switcher/entity-type-switcher.component';

@rendersEntityType('Person', ElementViewMode.Full)
@Component({
  selector: 'ds-person-page-fields',
  styleUrls: ['./person-page-fields.component.scss'],
  templateUrl: './person-page-fields.component.html'
})
export class PersonPageFieldsComponent {
  publications$: Observable<Item[]>;
  isProjectOfPersonRels$: Observable<Relationship[]>;
  isOrgUnitOfPersonRels$: Observable<Relationship[]>;

  constructor(
    @Inject(ITEM) public item: Item,
    private ids: ItemDataService
  ) {
    const relsCurrentPage$ = item.relationships.pipe(
      filter((rd: RemoteData<PaginatedList<Relationship>>) => rd.hasSucceeded),
      getRemoteDataPayload(),
      map((pl: PaginatedList<Relationship>) => pl.page),
      ensureArrayHasValue(),
    );

    const relTypesCurrentPage$ = relsCurrentPage$.pipe(
      flatMap((rels: Relationship[]) =>
        Observable.combineLatest(
          ...rels.map((rel: Relationship) => rel.relationshipType),
          (...arr: Array<RemoteData<RelationshipType>>) =>
            arr.map((d: RemoteData<RelationshipType>) => d.payload)
        )
      )
    );

    const resolvedRelsAndTypes$ = Observable.combineLatest(
      relsCurrentPage$,
      relTypesCurrentPage$
    );

    this.publications$ = resolvedRelsAndTypes$.pipe(
      map(([relsCurrentPage, relTypesCurrentPage]) =>
        relsCurrentPage.filter((rel: Relationship, idx: number) =>
          hasValue(relTypesCurrentPage[idx]) && (relTypesCurrentPage[idx].leftLabel === 'isPublicationOfAuthor' ||
            relTypesCurrentPage[idx].rightLabel === 'isPublicationOfAuthor')
        )
      ),
      flatMap((rels: Relationship[]) =>
        Observable.combineLatest(
          ...rels.map((rel: Relationship) => {
            let queryId = rel.leftId;
            if (rel.leftId === this.item.id) {
              queryId = rel.rightId;
            }
            return this.ids.findById(queryId);
          }),
          (...arr: Array<RemoteData<Item>>) =>
            arr
              .filter((d: RemoteData<Item>) => d.hasSucceeded)
              .map((d: RemoteData<Item>) => d.payload)
        )
      )
    );

    //TODO status het lijkt te werken maar duurt minuten om te laden: too much recursion?

    this.isProjectOfPersonRels$ = resolvedRelsAndTypes$.pipe(
      map(([relsCurrentPage, relTypesCurrentPage]) =>
        relsCurrentPage.filter((rel: Relationship, idx: number) =>
          hasValue(relTypesCurrentPage[idx]) && (relTypesCurrentPage[idx].leftLabel === 'isProjectOfPerson' ||
            relTypesCurrentPage[idx].rightLabel === 'isProjectOfPerson')
        )
      )
    );

    this.isOrgUnitOfPersonRels$ = resolvedRelsAndTypes$.pipe(
      map(([relsCurrentPage, relTypesCurrentPage]) =>
        relsCurrentPage.filter((rel: Relationship, idx: number) =>
          hasValue(relTypesCurrentPage[idx]) && (relTypesCurrentPage[idx].leftLabel === 'isOrgUnitOfPerson' ||
            relTypesCurrentPage[idx].rightLabel === 'isOrgUnitOfPerson')
        )
      )
    );

  }

}
