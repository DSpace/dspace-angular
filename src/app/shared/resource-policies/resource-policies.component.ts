import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourcePolicyService } from '../../core/resource-policy/resource-policy.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { getFirstSucceededRemoteDataPayload, getSucceededRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { ResourcePolicy } from '../../core/resource-policy/models/resource-policy.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Group } from '../../core/eperson/models/group.model';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { hasValue, isNotEmpty } from '../empty.util';

@Component({
  selector: 'ds-resource-policies',
  styleUrls: ['./resource-policies.component.scss'],
  templateUrl: './resource-policies.component.html'
})
/**
 * Component that shows the policies for given resource
 */
export class ResourcePoliciesComponent implements OnInit, OnDestroy {

  /**
   * The resource UUID
   * @type {string}
   */
  @Input() public resourceUUID: string;

  /**
   * The resource type (e.g. 'item', 'bundle' etc) used as key to build automatically translation label
   * @type {string}
   */
  @Input() public resourceKey: string;

  /**
   * The list of policies for given resource
   * @type {Observable<RemoteData<PaginatedList<ResourcePolicy>>>}
   */
  private resourcePolicies$: Observable<RemoteData<PaginatedList<ResourcePolicy>>>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {DSONameService} dsoNameService
   * @param {GroupDataService} groupService
   * @param {ResourcePolicyService} resourcePolicyService
   * @param {Router} router
   */
  constructor(
    private dsoNameService: DSONameService,
    private groupService: GroupDataService,
    private resourcePolicyService: ResourcePolicyService,
    private router: Router
  ) {
  }

  /**
   * Initialize the component, setting up the resource's policies
   */
  ngOnInit(): void {
    this.resourcePolicies$ = this.resourcePolicyService.searchByResource(this.resourceUUID).pipe(
      getSucceededRemoteData()
    );

  }

  /**
   * Return the group's name which the given policy is linked to
   *
   * @param policy The resource policy
   */
  getGroupName(policy: ResourcePolicy): Observable<string> {
    return this.groupService.findByHref(policy._links.group.href).pipe(
      getFirstSucceededRemoteDataPayload(),
      // A group has not dc.title metadata so is not possible to use DSONameService to retrieve name
      map((group: Group) => group.name)
    )
  }

  /**
   * Return all resource's policies
   *
   * @return an observable that emits all resource's policies
   */
  getResourcePolicies(): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    return this.resourcePolicies$;
  }

  /**
   * Check whether the given policy is linked to a group
   *
   * @param policy The resource policy
   * @return an observable that emits true when the policy is linked to a group, false otherwise
   */
  hasGroup(policy): Observable<boolean> {
    return this.groupService.findByHref(policy._links.group.href).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((group: Group) => isNotEmpty(group))
    )
  }

  /**
   * Redirect to group edit page
   *
   * @param policy The resource policy
   */
  redirectToGroupEditPage(policy: ResourcePolicy): void {
    this.subs.push(
      this.groupService.findByHref(policy._links.group.href).pipe(
        getFirstSucceededRemoteDataPayload(),
        map((group: Group) => group.id)
      ).subscribe((groupUUID) => this.router.navigate(['groups', groupUUID, 'edit']))
    )
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe())
  }
}
