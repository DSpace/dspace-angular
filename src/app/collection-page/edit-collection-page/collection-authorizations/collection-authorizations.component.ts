import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Observable } from 'rxjs';
import {
  first,
  map,
} from 'rxjs/operators';

import { ResourcePoliciesComponent } from '../../../shared/resource-policies/resource-policies.component';

@Component({
  selector: 'ds-collection-authorizations',
  templateUrl: './collection-authorizations.component.html',
  imports: [
    AsyncPipe,
    ResourcePoliciesComponent,
  ],
  standalone: true,
})
/**
 * Component that handles the Collection Authorizations
 */
export class CollectionAuthorizationsComponent<TDomain extends DSpaceObject> implements OnInit {

  /**
   * The initial DSO object
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;

  /**
   * Initialize instance variables
   *
   * @param {ActivatedRoute} route
   */
  constructor(
    private route: ActivatedRoute,
  ) {
  }

  /**
   * Initialize the component, setting up the collection
   */
  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.parent.data.pipe(first(), map((data) => data.dso));
  }
}
