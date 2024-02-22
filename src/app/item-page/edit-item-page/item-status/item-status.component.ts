import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../shared/animations/fade';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { ItemOperation } from '../item-operation/itemOperation.model';
import {concatMap, distinctUntilChanged, first, map, mergeMap, switchMap, toArray} from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { getItemEditRoute, getItemPageRoute } from '../../item-page-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { hasValue } from '../../../shared/empty.util';
import { getAllSucceededRemoteDataPayload, getFirstCompletedRemoteData, } from '../../../core/shared/operators';
import { IdentifierDataService } from '../../../core/data/identifier-data.service';
import { Identifier } from '../../../shared/object-list/identifier-data/identifier.model';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { IdentifierData } from '../../../shared/object-list/identifier-data/identifier-data.model';
import { OrcidAuthService } from '../../../core/orcid/orcid-auth.service';

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
              private orcidAuthService: OrcidAuthService
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
    ).pipe(
      switchMap((item: Item) => {
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
      let registerConfigEnabled$: Observable<boolean> = this.configurationService.findByPropertyName('identifiers.item-status.register-doi').pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<ConfigurationProperty>) => {
          // Return true if a successful response with a 'true' value was retrieved, otherwise return false
          if (response.hasSucceeded) {
            const payload = response.payload;
            if (payload.values.length > 0 && hasValue(payload.values[0])) {
              return payload.values[0] === 'true';
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
      );

      /**
       * Construct a base list of operations.
       * The key is used to build messages
       * i18n example: 'item.edit.tabs.status.buttons.<key>.label'
       * The value is supposed to be a href for the button
       */
      const currentUrl = this.getCurrentUrl(item);
      const initialOperations: ItemOperation[] = [
        new ItemOperation('authorizations', `${currentUrl}/authorizations`, FeatureID.CanManagePolicies, true),
        new ItemOperation('mappedCollections', `${currentUrl}/mapper`, FeatureID.CanManageMappings, true),
        item.isWithdrawn
         ? new ItemOperation('reinstate', `${currentUrl}/reinstate`, FeatureID.ReinstateItem, true)
         : new ItemOperation('withdraw', `${currentUrl}/withdraw`, FeatureID.WithdrawItem, true),
        item.isDiscoverable
         ? new ItemOperation('private', `${currentUrl}/private`, FeatureID.CanMakePrivate, true)
         : new ItemOperation('public', `${currentUrl}/public`, FeatureID.CanMakePrivate, true),
        new ItemOperation('move', `${currentUrl}/move`, FeatureID.CanMove, true),
        new ItemOperation('delete', `${currentUrl}/delete`, FeatureID.CanDelete, true)
      ];

      this.operations$.next(initialOperations);

        /**
         *  When the identifier data stream changes, determine whether the register DOI button should be shown or not.
         *  This is based on whether the DOI is in the right state (minted or pending, not already queued for registration
         *  or registered) and whether the configuration property identifiers.item-status.register-doi is true
         */
        const ops$ = this.identifierDataService.getIdentifierDataFor(item).pipe(
          getFirstCompletedRemoteData(),
          mergeMap((dataRD: RemoteData<IdentifierData>) => {
            if (dataRD.hasSucceeded) {
              let identifiers = dataRD.payload.identifiers;
              let no_doi = true;
              let pending = false;
              if (identifiers !== undefined && identifiers !== null) {
                identifiers.forEach((identifier: Identifier) => {
                  if (hasValue(identifier) && identifier.identifierType === 'doi') {
                    // The item has some kind of DOI
                    no_doi = false;
                    if (['PENDING', 'MINTED', null].includes(identifier.identifierStatus)) {
                      // The item's DOI is pending, minted or null.
                      // It isn't registered, reserved, queued for registration or reservation or update, deleted
                      // or queued for deletion.
                      pending = true;
                    }
                  }
                });
              }
              // If there is no DOI, or a pending/minted/null DOI, and the config is enabled, return true
              return registerConfigEnabled$.pipe(
                map((enabled: boolean) => {
                    return enabled && (pending || no_doi);
                  }
                ));
            } else {
              return of(false);
            }
          }),
          // Switch map pushes the register DOI operation onto a copy of the base array then returns to the pipe
          switchMap((showDoi: boolean) => {
            const ops = [...initialOperations];
            if (showDoi) {
              const op = new ItemOperation('register-doi', `${currentUrl}/register-doi`, FeatureID.CanRegisterDOI, true);
              ops.splice(ops.length - 1, 0, op); // Add item before last
            }
            return ops;
          }),
          concatMap((op: ItemOperation) => {
            if (hasValue(op.featureID)) {
              return this.authorizationService.isAuthorized(op.featureID, item.self).pipe(
                distinctUntilChanged(),
                map((authorized) => {
                  op.setDisabled(!authorized);
                  op.setAuthorized(authorized);
                  return op;
                })
              );
            }
            return [op];
          }),
          toArray()
        );

        let orcidOps$ = of([]);
        if (this.orcidAuthService.isLinkedToOrcid(item)) {
          orcidOps$ = this.orcidAuthService.onlyAdminCanDisconnectProfileFromOrcid().pipe(
              map((canDisconnect) => {
                if (canDisconnect) {
                  return [new ItemOperation('unlinkOrcid', `${currentUrl}/unlink-orcid`)];
                }
                return [];
              })
            );
        }

        return combineLatest([ops$, orcidOps$]);
      }),
      map(([ops, orcidOps]: [ItemOperation[], ItemOperation[]]) => [...ops, ...orcidOps])
    ).subscribe((ops) => this.operations$.next(ops));

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
