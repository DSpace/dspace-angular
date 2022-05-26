import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, from as observableFrom, Observable, Subscription } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  reduce,
  scan,
  startWith,
  take
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ResourcePolicyService } from '../../core/resource-policy/resource-policy.service';
import {
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteDataWithNotEmptyPayload,
  getAllSucceededRemoteData
} from '../../core/shared/operators';
import { ResourcePolicy } from '../../core/resource-policy/models/resource-policy.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Group } from '../../core/eperson/models/group.model';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { hasValue, isEmpty, isNotEmpty } from '../empty.util';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { RequestService } from '../../core/data/request.service';
import { NotificationsService } from '../notifications/notifications.service';
import { dateToString, stringToNgbDateStruct } from '../date.util';
import { followLink } from '../utils/follow-link-config.model';
import { ACCESS_CONTROL_MODULE_PATH } from '../../app-routing-paths';
import { GROUP_EDIT_PATH } from '../../access-control/access-control-routing-paths';

interface ResourcePolicyCheckboxEntry {
  id: string;
  policy: ResourcePolicy;
  checked: boolean;
}

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
   * A boolean representing if a submission delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  private processingDelete$ = new BehaviorSubject<boolean>(false);

  /**
   * The list of policies for given resource
   * @type {BehaviorSubject<ResourcePolicyCheckboxEntry[]>}
   */
  private resourcePoliciesEntries$: BehaviorSubject<ResourcePolicyCheckboxEntry[]> =
    new BehaviorSubject<ResourcePolicyCheckboxEntry[]>([]);

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
   * @param {NotificationsService} notificationsService
   * @param {RequestService} requestService
   * @param {ResourcePolicyService} resourcePolicyService
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {TranslateService} translate
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private dsoNameService: DSONameService,
    private ePersonService: EPersonDataService,
    private groupService: GroupDataService,
    private notificationsService: NotificationsService,
    private requestService: RequestService,
    private resourcePolicyService: ResourcePolicyService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
  }

  /**
   * Initialize the component, setting up the resource's policies
   */
  ngOnInit(): void {
    this.isActive = true;
    this.initResourcePolicyLIst();
  }

  /**
   * Check if there are any selected resource's policies to be deleted
   *
   * @return {Observable<boolean>}
   */
  canDelete(): Observable<boolean> {
    return observableFrom(this.resourcePoliciesEntries$.value).pipe(
      filter((entry: ResourcePolicyCheckboxEntry) => entry.checked),
      reduce((acc: any, value: any) => [...acc, value], []),
      map((entries: ResourcePolicyCheckboxEntry[]) => isNotEmpty(entries)),
      distinctUntilChanged()
    );
  }

  /**
   * Delete the selected resource's policies
   */
  deleteSelectedResourcePolicies(): void {
    this.processingDelete$.next(true);
    const policiesToDelete: ResourcePolicyCheckboxEntry[] = this.resourcePoliciesEntries$.value
      .filter((entry: ResourcePolicyCheckboxEntry) => entry.checked);
    this.subs.push(
      observableFrom(policiesToDelete).pipe(
        concatMap((entry: ResourcePolicyCheckboxEntry) => this.resourcePolicyService.delete(entry.policy.id)),
        scan((acc: any, value: any) => [...acc, value], []),
        filter((results: boolean[]) => results.length === policiesToDelete.length),
        take(1),
      ).subscribe((results: boolean[]) => {
        const failureResults = results.filter((result: boolean) => !result);
        if (isEmpty(failureResults)) {
          this.notificationsService.success(null, this.translate.get('resource-policies.delete.success.content'));
        } else {
          this.notificationsService.error(null, this.translate.get('resource-policies.delete.failure.content'));
        }
        this.processingDelete$.next(false);
      })
    );
  }

  /**
   * Returns a date in simplified format (YYYY-MM-DD).
   *
   * @param date
   * @return a string with formatted date
   */
  formatDate(date: string): string {
    return isNotEmpty(date) ? dateToString(stringToNgbDateStruct(date)) : '';
  }

  /**
   * Return the ePerson's name which the given policy is linked to
   *
   * @param policy The resource policy
   */
  getEPersonName(policy: ResourcePolicy): Observable<string> {
    // TODO to be reviewed when https://github.com/DSpace/dspace-angular/issues/644 will be resolved
    // return this.ePersonService.findByHref(policy._links.eperson.href).pipe(
    return policy.eperson.pipe(
      filter(() => this.isActive),
      getFirstSucceededRemoteDataWithNotEmptyPayload(),
      map((eperson: EPerson) => this.dsoNameService.getName(eperson)),
      startWith('')
    );
  }

  /**
   * Return the group's name which the given policy is linked to
   *
   * @param policy The resource policy
   */
  getGroupName(policy: ResourcePolicy): Observable<string> {
    // TODO to be reviewed when https://github.com/DSpace/dspace-angular/issues/644 will be resolved
    // return this.groupService.findByHref(policy._links.group.href).pipe(
    return policy.group.pipe(
      filter(() => this.isActive),
      getFirstSucceededRemoteDataWithNotEmptyPayload(),
      map((group: Group) => this.dsoNameService.getName(group)),
      startWith('')
    );
  }

  /**
   * Return all resource's policies
   *
   * @return an observable that emits all resource's policies
   */
  getResourcePolicies(): Observable<ResourcePolicyCheckboxEntry[]> {
    return this.resourcePoliciesEntries$.asObservable();
  }

  /**
   * Check whether the given policy is linked to a ePerson
   *
   * @param policy The resource policy
   * @return an observable that emits true when the policy is linked to a ePerson, false otherwise
   */
  hasEPerson(policy): Observable<boolean> {
    // TODO to be reviewed when https://github.com/DSpace/dspace-angular/issues/644 will be resolved
    // return this.ePersonService.findByHref(policy._links.eperson.href).pipe(
    return policy.eperson.pipe(
      filter(() => this.isActive),
      getFirstSucceededRemoteDataPayload(),
      map((eperson: EPerson) => isNotEmpty(eperson)),
      startWith(false)
    );
  }

  /**
   * Check whether the given policy is linked to a group
   *
   * @param policy The resource policy
   * @return an observable that emits true when the policy is linked to a group, false otherwise
   */
  hasGroup(policy): Observable<boolean> {
    // TODO to be reviewed when https://github.com/DSpace/dspace-angular/issues/644 will be resolved
    // return this.groupService.findByHref(policy._links.group.href).pipe(
    return policy.group.pipe(
      filter(() => this.isActive),
      getFirstSucceededRemoteDataPayload(),
      map((group: Group) => isNotEmpty(group)),
      startWith(false)
    );
  }

  /**
   * Initialize the resource's policies list
   */
  initResourcePolicyLIst() {
    this.subs.push(this.resourcePolicyService.searchByResource(this.resourceUUID, null, false, true,
      followLink('eperson'), followLink('group')).pipe(
      filter(() => this.isActive),
      getAllSucceededRemoteData()
    ).subscribe((result) => {
      const entries = result.payload.page.map((policy: ResourcePolicy) => ({
        id: policy.id,
        policy: policy,
        checked: false
      }));
      this.resourcePoliciesEntries$.next(entries);
      // TODO detectChanges still needed?
      this.cdr.detectChanges();
    }));
  }

  /**
   * Return a boolean representing if a delete operation is pending
   *
   * @return {Observable<boolean>}
   */
  isProcessingDelete(): Observable<boolean> {
    return this.processingDelete$.asObservable();
  }

  /**
   * Redirect to resource policy creation page
   */
  redirectToResourcePolicyCreatePage(): void {
    this.router.navigate([`./create`], {
      relativeTo: this.route,
      queryParams: {
        policyTargetId: this.resourceUUID,
        targetType: this.resourceType
      }
    });
  }

  /**
   * Redirect to resource policy editing page
   *
   * @param policy The resource policy
   */
  redirectToResourcePolicyEditPage(policy: ResourcePolicy): void {
    this.router.navigate([`./edit`], {
      relativeTo: this.route,
      queryParams: {
        policyId: policy.id
      }
    });
  }

  /**
   * Redirect to group edit page
   *
   * @param policy The resource policy
   */
  redirectToGroupEditPage(policy: ResourcePolicy): void {
    this.subs.push(
      this.groupService.findByHref(policy._links.group.href, false).pipe(
        filter(() => this.isActive),
        getFirstSucceededRemoteDataPayload(),
        map((group: Group) => group.id)
      ).subscribe((groupUUID) => {
        this.router.navigate([ACCESS_CONTROL_MODULE_PATH, GROUP_EDIT_PATH, groupUUID]);
      })
    );
  }

  /**
   * Select/unselect all checkbox in the list
   */
  selectAllCheckbox(event: any): void {
    const checked = event.target.checked;
    this.resourcePoliciesEntries$.value.forEach((entry: ResourcePolicyCheckboxEntry) => entry.checked = checked);
  }

  /**
   * Select/unselect checkbox
   */
  selectCheckbox(policyEntry: ResourcePolicyCheckboxEntry, checked: boolean) {
    policyEntry.checked = checked;
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.isActive = false;
    this.resourcePoliciesEntries$ = null;
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
