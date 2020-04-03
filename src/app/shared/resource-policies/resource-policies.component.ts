import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, startWith, take } from 'rxjs/operators';

import { ResourcePolicyService } from '../../core/resource-policy/resource-policy.service';
import { PaginatedList } from '../../core/data/paginated-list';
import {
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteDataWithNotEmptyPayload,
  getSucceededRemoteData
} from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { ResourcePolicy } from '../../core/resource-policy/models/resource-policy.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Group } from '../../core/eperson/models/group.model';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { hasValue, isNotEmpty } from '../empty.util';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { followLink } from '../utils/follow-link-config.model';
import { RequestService } from '../../core/data/request.service';

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
  @Input() public resourceType: string;

  /**
   * A boolean representing if component is active
   * @type {boolean}
   */
  private isActive: boolean;

  /**
   * The list of policies for given resource
   * @type {Observable<RemoteData<PaginatedList<ResourcePolicy>>>}
   */
  private resourcePolicies$: BehaviorSubject<RemoteData<PaginatedList<ResourcePolicy>>> =
    new BehaviorSubject<RemoteData<PaginatedList<ResourcePolicy>>>({} as any);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   * @param {DSONameService} dsoNameService
   * @param {EPersonDataService} ePersonService
   * @param {GroupDataService} groupService
   * @param {RequestService} requestService
   * @param {ResourcePolicyService} resourcePolicyService
   * @param {ActivatedRoute} route
   * @param {Router} router
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private dsoNameService: DSONameService,
    private ePersonService: EPersonDataService,
    private groupService: GroupDataService,
    private requestService: RequestService,
    private resourcePolicyService: ResourcePolicyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  /**
   * Initialize the component, setting up the resource's policies
   */
  ngOnInit(): void {
    this.isActive = true;
    this.requestService.removeByHrefSubstring(this.resourceUUID);
    this.resourcePolicyService.searchByResource(this.resourceUUID, null,
      followLink('eperson'), followLink('group')).pipe(
      filter(() => this.isActive),
      getSucceededRemoteData(),
      take(1)
    ).subscribe((result) => {
      this.resourcePolicies$.next(result);
    });

  }

  /**
   * Redirect to resource policy creation page
   */
  createResourcePolicy(): void {
    this.router.navigate([`../create`], {
      relativeTo: this.route,
      queryParams: {
        policyTargetId: this.resourceUUID,
        targetType: this.resourceType
      }
    })
  }

  /**
   * Redirect to resource policy editing page
   *
   * @param policy The resource policy
   */
  editResourcePolicy(policy: ResourcePolicy): void {
    this.router.navigate([`../edit`], {
      relativeTo: this.route,
      queryParams: {
        policyId: policy.id
      }
    })
  }

  /**
   * Return the ePerson's name which the given policy is linked to
   *
   * @param policy The resource policy
   */
  getEPersonName(policy: ResourcePolicy): Observable<string> {
    return policy.eperson.pipe(
      filter(() => this.isActive),
      getFirstSucceededRemoteDataWithNotEmptyPayload(),
      map((eperson: EPerson) => this.dsoNameService.getName(eperson)),
      startWith('')
    )
  }

  /**
   * Return the group's name which the given policy is linked to
   *
   * @param policy The resource policy
   */
  getGroupName(policy: ResourcePolicy): Observable<string> {
    return policy.group.pipe(
      filter(() => this.isActive),
      getFirstSucceededRemoteDataWithNotEmptyPayload(),
      map((group: Group) => this.dsoNameService.getName(group)),
      startWith('')
    )
  }

  /**
   * Return all resource's policies
   *
   * @return an observable that emits all resource's policies
   */
  getResourcePolicies(): Observable<RemoteData<PaginatedList<ResourcePolicy>>> {
    return this.resourcePolicies$.asObservable();
  }

  /**
   * Check whether the given policy is linked to a ePerson
   *
   * @param policy The resource policy
   * @return an observable that emits true when the policy is linked to a ePerson, false otherwise
   */
  hasEPerson(policy): Observable<boolean> {
    return policy.eperson.pipe(
      filter(() => this.isActive),
      getFirstSucceededRemoteDataPayload(),
      map((eperson: EPerson) => isNotEmpty(eperson))
    )
  }

  /**
   * Check whether the given policy is linked to a group
   *
   * @param policy The resource policy
   * @return an observable that emits true when the policy is linked to a group, false otherwise
   */
  hasGroup(policy): Observable<boolean> {
    return policy.group.pipe(
      filter(() => this.isActive),
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
      policy.group.pipe(
        filter(() => this.isActive),
        getFirstSucceededRemoteDataPayload(),
        map((group: Group) => group.id)
      ).subscribe((groupUUID) => this.router.navigate(['groups', groupUUID, 'edit']))
    )
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.isActive = false;
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe())
  }
}
