import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { ItemOperation } from '../item-operation/itemOperation.model';
import {distinctUntilChanged, first, map, mergeMap, startWith, switchMap, toArray} from 'rxjs/operators';
import {BehaviorSubject, Observable, from as observableFrom, Subscription, combineLatest, of} from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { getItemEditRoute, getItemPageRoute } from '../../item-page-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { hasValue } from '../../../shared/empty.util';
import {
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData, getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload
} from '../../../core/shared/operators';
import {IdentifierDataService} from '../../../core/data/identifier-data.service';
import {IdentifierData} from '../../../shared/object-list/identifier-data/identifier-data.model';
import {Identifier} from '../../../shared/object-list/identifier-data/identifier.model';
import {ConfigurationProperty} from '../../../core/shared/configuration-property.model';
import {ConfigurationDataService} from '../../../core/data/configuration-data.service';

@Component({
  selector: 'ds-item-status',
  templateUrl: './item-status.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Component for displaying an item's status
 */
export class ItemStatusComponent implements OnInit {

  /**
   * The item to display the status for
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The data to show in the status
   */
  statusData: any;
  /**
   * The keys of the data (to loop over)
   */
  statusDataKeys;

  /**
   * The possible actions that can be performed on the item
   *  key: id   value: url to action's component
   */
  operations$: BehaviorSubject<ItemOperation[]> = new BehaviorSubject<ItemOperation[]>([]);

  /**
   * The keys of the actions (to loop over)
   */
  actionsKeys;

  /**
   * Identifiers (handles, DOIs)
   */
  identifiers$: Observable<Identifier[]>;

  /**
   * Configuration and state variables regarding DOIs
   */

  public subs: Subscription[] = [];

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;

  constructor(private route: ActivatedRoute,
              private authorizationService: AuthorizationDataService,
              private identifierDataService: IdentifierDataService,
              private configurationService: ConfigurationDataService,
  ) {
  }

  /**
   * Initialise component
   */
  ngOnInit(): void {
    this.itemRD$ = this.route.parent.data.pipe(map((data) => data.dso));
    this.itemRD$.pipe(
      first(),
      map((data: RemoteData<Item>) => data.payload)
    ).subscribe((item: Item) => {
      this.statusData = Object.assign({
        id: item.id,
        handle: item.handle,
        lastModified: item.lastModified
      });
      this.statusDataKeys = Object.keys(this.statusData);

      // Observable for item identifiers (retrieved from embedded link)
      this.identifiers$ = this.identifierDataService.getIdentifierDataFor(item).pipe(
        map((identifierRD) => {
          if (identifierRD.statusCode !== 401 && hasValue(identifierRD.payload)) {
            return identifierRD.payload.identifiers;
          } else {
            return null;
          }
        }),
      );

      // Observable for configuration determining whether the Register DOI feature is enabled
      let registerConfigEnabled$: Observable<boolean> = this.configurationService.findByPropertyName('identifiers.item-status.register').pipe(
        map((enabled: RemoteData<ConfigurationProperty>) => {
          let show = false;
          if (enabled.hasSucceeded) {
            if (enabled.payload !== undefined && enabled.payload !== null) {
              if (enabled.payload.values !== undefined) {
                enabled.payload.values.forEach((value) => {
                  show = true;
                });
              }
            }
          }
          return show;
        })
      );

      /*
        The key is used to build messages
          i18n example: 'item.edit.tabs.status.buttons.<key>.label'
        The value is supposed to be a href for the button
      */
      const operations = [];
      operations.push(new ItemOperation('authorizations', this.getCurrentUrl(item) + '/authorizations', FeatureID.CanManagePolicies, true));
      operations.push(new ItemOperation('mappedCollections', this.getCurrentUrl(item) + '/mapper', FeatureID.CanManageMappings, true));
      if (item.isWithdrawn) {
        operations.push(new ItemOperation('reinstate', this.getCurrentUrl(item) + '/reinstate', FeatureID.ReinstateItem, true));
      } else {
        operations.push(new ItemOperation('withdraw', this.getCurrentUrl(item) + '/withdraw', FeatureID.WithdrawItem, true));
      }
      if (item.isDiscoverable) {
        operations.push(new ItemOperation('private', this.getCurrentUrl(item) + '/private', FeatureID.CanMakePrivate, true));
      } else {
        operations.push(new ItemOperation('public', this.getCurrentUrl(item) + '/public', FeatureID.CanMakePrivate, true));
      }
      operations.push(new ItemOperation('delete', this.getCurrentUrl(item) + '/delete', FeatureID.CanDelete, true));
      operations.push(new ItemOperation('move', this.getCurrentUrl(item) + '/move', FeatureID.CanMove, true));
      this.operations$.next(operations);

      // Observable that reads identifiers and their status and, and config properties, and decides
      // if we're allowed to show a Register DOI feature
      let showRegister$: Observable<boolean> = combineLatest([this.identifiers$, registerConfigEnabled$]).pipe(
        distinctUntilChanged(),
        map(([identifiers, enabled]) => {
          let no_doi = true;
          let pending = false;
          if (identifiers !== undefined && identifiers !== null) {
            identifiers.forEach((identifier: Identifier) => {
              if (hasValue(identifier) && identifier.identifierType === 'doi') {
                // The item has some kind of DOI
                no_doi = false;
                if (identifier.identifierStatus === '10' || identifier.identifierStatus === '11'
                  || identifier.identifierStatus == null) {
                  // The item's DOI is pending, minted or null.
                  // It isn't registered, reserved, queued for registration or reservation or update, deleted
                  // or queued for deletion.
                  pending = true;
                }
              }
            });
          }
          // If there is no DOI, or a pending/minted/null DOI, and the config is enabled, return true
          return ((pending || no_doi) && enabled);
        })
      );

      // Subscribe to changes from the showRegister check and rebuild operations list accordingly
      this.subs.push(showRegister$.subscribe((show) => {
        // Copy the static array first so we don't keep appending to it
        let tmp_operations = [...operations];
        if (show) {
          // Push the new Register DOI item operation
          tmp_operations.push(new ItemOperation('registerDOI', this.getCurrentUrl(item) + '/registerdoi', FeatureID.CanRegisterDOI));
        }
        // Check authorisations and merge into new operations list
        observableFrom(tmp_operations).pipe(
          mergeMap((operation) => {
            if (hasValue(operation.featureID)) {
              return this.authorizationService.isAuthorized(operation.featureID, item.self).pipe(
                distinctUntilChanged(),
                map((authorized) => new ItemOperation(operation.operationKey, operation.operationUrl, operation.featureID, !authorized, authorized))
              );
            } else {
              return [operation];
            }
          }),
          toArray()
        ).subscribe((ops) => this.operations$.next(ops));
      }));

    });

    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item))
    );

  }

  /**
   * Get the current url without query params
   * @returns {string}  url
   */
  getCurrentUrl(item: Item): string {
    return getItemEditRoute(item);
  }

  trackOperation(index: number, operation: ItemOperation) {
    return hasValue(operation) ? operation.operationKey : undefined;
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
