import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { ComcolRole } from '../../../shared/comcol-forms/edit-comcol-page/comcol-role/comcol-role';

/**
 * Component for managing a collection's roles
 */
@Component({
  selector: 'ds-collection-roles',
  templateUrl: './collection-roles.component.html',
})
export class CollectionRolesComponent implements OnInit {

  dsoRD$: Observable<RemoteData<Collection>>;

  /**
   * The collection to manage, as an observable.
   */
  get collection$(): Observable<Collection> {
    return this.dsoRD$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
    )
  }

  /**
   * The different roles for the collection, as an observable.
   */
  getComcolRoles(): Observable<ComcolRole[]> {
    return this.collection$.pipe(
      map((collection) =>
        [
          ComcolRole.COLLECTION_ADMIN,
          ComcolRole.SUBMITTERS,
          ComcolRole.ITEM_READ,
          ComcolRole.BITSTREAM_READ,
          ...Object.keys(collection._links)
            .filter((link) => link.startsWith('workflowGroups/'))
            .map((link) => new ComcolRole(link.substr('workflowGroups/'.length), link)),
        ]
      ),
    );
  }

  constructor(
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(
      first(),
      map((data) => data.dso),
    );
  }
}
