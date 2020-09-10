import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { HALLink } from '../../../core/shared/hal-link.model';

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
  getComcolRoles(): Observable<HALLink[]> {
    return this.collection$.pipe(
      map((collection) => [
        {
          name: 'collection-admin',
          href: collection._links.adminGroup.href,
        },
        {
          name: 'submitters',
          href: collection._links.submittersGroup.href,
        },
        {
          name: 'item_read',
          href: collection._links.itemReadGroup.href,
        },
        {
          name: 'bitstream_read',
          href: collection._links.bitstreamReadGroup.href,
        },
        ...collection._links.workflowGroups,
      ]),
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
