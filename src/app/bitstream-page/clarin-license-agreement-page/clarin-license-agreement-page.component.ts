import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { hasFailed } from '../../core/data/request.reducer';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { ClarinUserRegistration } from '../../core/shared/clarin/clarin-user-registration.model';
import { ClarinUserMetadata } from '../../core/shared/clarin/clarin-user-metadata.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { RequestParam } from '../../core/cache/models/request-param.model';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { FindListOptions, PostRequest } from '../../core/data/request.models';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthService } from '../../core/auth/auth.service';
import { buildPaginatedList, PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { ClarinLicenseResourceMapping } from '../../core/shared/clarin/clarin-license-resource-mapping.model';
import { Item } from '../../core/shared/item.model';
import { ClarinLicense } from '../../core/shared/clarin/clarin-license.model';
import { ClarinLicenseResourceMappingService } from '../../core/data/clarin/clarin-license-resource-mapping-data.service';
import { HELP_DESK_PROPERTY } from '../../item-page/tombstone/tombstone.component';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { BundleDataService } from '../../core/data/bundle-data.service';
import { HttpClient } from '@angular/common/http';
import { ClarinLicenseRequiredInfo } from '../../core/shared/clarin/clarin-license.resource-type';
import { cloneDeep, isEqual } from 'lodash';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ItemDataService } from '../../core/data/item-data.service';
import { ClarinUserRegistrationDataService } from '../../core/data/clarin/clarin-user-registration.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { RequestService } from '../../core/data/request.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { CLARIN_USER_METADATA_MANAGE } from '../../core/shared/clarin/clarin-user-metadata.resource-type';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { HttpOptions } from '../../core/dspace-rest/dspace-rest.service';
import { Router } from '@angular/router';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { getBitstreamDownloadRoute } from '../../app-routing-paths';

/**
 * The component shows the user's filled in user metadata and the user can fill in other required user metadata.
 * The user must to approve his user metadata to download the bitstream.
 */
@Component({
  selector: 'ds-clarin-license-agreement-page',
  templateUrl: './clarin-license-agreement-page.component.html',
  styleUrls: ['./clarin-license-agreement-page.component.scss']
})
export class ClarinLicenseAgreementPageComponent implements OnInit {

  @Input()
  bitstream$: Observable<Bitstream>;

  /**
   * The user IP Address which is loaded from `http://api.ipify.org/?format=json`
   */
  ipAddress$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * The item where is the bitstream attached to.
   */
  item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * The object where are stored the user's e-mail and organization data.
   */
  userRegistration$: BehaviorSubject<ClarinUserRegistration> = new BehaviorSubject<ClarinUserRegistration>(null);

  /**
   * The object where are stored the user's metadata.
   */
  userMetadata$: BehaviorSubject<PaginatedList<ClarinUserMetadata>> = new BehaviorSubject<PaginatedList<ClarinUserMetadata>>(null);

  /**
   * By resourceMapping get the ClarinLicense object.
   */
  resourceMapping$: BehaviorSubject<ClarinLicenseResourceMapping> = new BehaviorSubject<ClarinLicenseResourceMapping>(null);

  /**
   * The Clarin License which is attached to the bitstream.
   */
  clarinLicense$: BehaviorSubject<ClarinLicense> = new BehaviorSubject<ClarinLicense>(null);

  /**
   * The current user object.
   */
  currentUser$: BehaviorSubject<EPerson> = new BehaviorSubject<EPerson>(null);

  /**
   * Required info for downloading the bitstream.
   */
  requiredInfo$: BehaviorSubject<ClarinLicenseRequiredInfo[]> = new BehaviorSubject<ClarinLicenseRequiredInfo[]>(null);

  /**
   * Errors which occurs by loading the data for the user approval.
   */
  error$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  /**
   * The mail for the help desk is loaded from the server.
   */
  helpDesk$: Observable<RemoteData<ConfigurationProperty>>;

  constructor(
    protected clarinLicenseResourceMappingService: ClarinLicenseResourceMappingService,
    protected configurationDataService: ConfigurationDataService,
    protected bundleService: BundleDataService,
    protected userRegistrationService: ClarinUserRegistrationDataService,
    protected notificationService: NotificationsService,
    protected translateService: TranslateService,
    protected itemService: ItemDataService,
    protected auth: AuthService,
    protected http: HttpClient,
    protected router: Router,
    protected halService: HALEndpointService,
    protected rdbService: RemoteDataBuildService,
    private hardRedirectService: HardRedirectService,
    private requestService: RequestService) { }

   ngOnInit(): void {
    // Load CurrentItem by bitstreamID to show itemHandle
    this.loadCurrentItem();
    // Load helpDeskEmail from configuration property - BE
    this.loadHelpDeskEmail();
    // Load IPAddress by API to show user IP Address
    this.loadIPAddress();
    // Load License Resource Mapping by bitstreamId and load Clarin License from it
    this.loadResourceMappingAndClarinLicense();
    // Load current user
    this.loadCurrentUser();

    if (isEmpty(this.currentUser$?.value)) {
      // The user is not signed in
      return;
    }

    // The user is signed in and has record in the userRegistration
    // Load userRegistration and userMetadata from userRegistration repository
    this.loadUserRegistrationAndUserMetadata();
  }

  public accept() {
    // Check if were filled in every required info
    if (!this.checkFilledInRequiredInfo()) {
      this.notificationService.error(
        this.translateService.instant('clarin.license.agreement.notification.error.required.info'));
      return;
    }

    const requestId = this.requestService.generateRequestId();
    // Response type must be `text` because it throws response as error byd status code is 200 (Success).
    const requestOptions: HttpOptions = Object.create({
      responseType: 'text'
    });

    // `/core/clarinusermetadatavalues/manage?bitstreamUUID=<BITSTREAM_UUID>`
    const url = this.halService.getRootHref() + '/core/' + ClarinUserMetadata.type.value + '/' + CLARIN_USER_METADATA_MANAGE + '?bitstreamUUID=' + this.getBitstreamUUID();
    const postRequest = new PostRequest(requestId, url, this.userMetadata$.value?.page, requestOptions);
    // Send POST request
    this.requestService.send(postRequest);
    // Get response
    const response = this.rdbService.buildFromRequestUUID(requestId);
    // Process response
    response
      .pipe(getFirstCompletedRemoteData())
      .subscribe(responseRD$ => {
        if (hasFailed(responseRD$.state)) {
          this.notificationService.error(
            this.translateService.instant('clarin.license.agreement.notification.cannot.send.email'));
        }
        if (isEmpty(responseRD$?.payload)) {
          return;
        }
        const responseStringValue = Object.values(responseRD$.payload).join('');
        // The user will get an email with download link - notification
        if (isEqual(responseStringValue, 'checkEmail')) {
          this.notificationService.info(
            this.translateService.instant('clarin.license.agreement.notification.check.email'));
          this.navigateToItemPage();
          return;
        } else {
          // Or just download the bitstream by download token
          const downloadToken = Object.values(responseRD$?.payload).join('');
          this.redirectToDownload(downloadToken);
        }
      });
  }

  private navigateToItemPage() {
    this.router.navigate([getItemPageRoute(this.item$?.value)]);
  }

  private redirectToDownload(downloadToken = null) {
    // 1. Get bitstream
    // 2. Get bitstream download link
    // 3. Get bitstream content download link and check if there is `authorization-token` in to query params
    let bitstream = null;
    this.bitstream$
      .pipe(take(1))
      .subscribe(bitstream$ => {
        bitstream = bitstream$;
      });
    let bitstreamDownloadPath = getBitstreamDownloadRoute(bitstream);
    if (isNotEmpty(downloadToken)) {
      bitstreamDownloadPath = bitstreamDownloadPath + '?dtoken=' + downloadToken;
    }
    this.hardRedirectService.redirect(bitstreamDownloadPath);
  }

  public getMetadataValueByKey(metadataKey: string) {
    let result = '';
    this.userMetadata$.value?.page?.forEach(userMetadata => {
      if (userMetadata.metadataKey === metadataKey) {
        result = userMetadata.metadataValue;
      }
    });
    return result;
  }

  public setMetadataValue(metadataKey: string, newMetadataValue: string) {
    let wasUpdated = false;
    let userMetadataList = cloneDeep(this.userMetadata$?.value?.page);
    if (isEmpty(userMetadataList)) {
      userMetadataList = [];
    }
    userMetadataList.forEach(userMetadata => {
      // Updated the metadataValue for the actual metadataKey
      if (userMetadata.metadataKey === metadataKey) {
        userMetadata.metadataValue = newMetadataValue;
        wasUpdated = true;
      }
    });

    // The metadataValue for the actual metadataKey doesn't exist in the userMetadata$, so add there one
    if (!wasUpdated) {
      userMetadataList.push(Object.assign(new ClarinUserMetadata(), {
        type: ClarinUserMetadata.type,
        metadataKey: metadataKey,
        metadataValue: newMetadataValue
      }));
    }

    // Update userMetadata$ with new List
    this.userMetadata$.next(buildPaginatedList(
      this.userMetadata$?.value?.pageInfo, userMetadataList, false, this.userMetadata$?.value?._links));
  }

  private getBitstreamUUID() {
    let bitstreamUUID = '';
    this.bitstream$.pipe(take(1)).subscribe( bitstream => {
      bitstreamUUID = bitstream.uuid;
    });
    return bitstreamUUID;
  }

  private loadResourceMappingAndClarinLicense() {
    this.clarinLicenseResourceMappingService.searchBy('byBitstream',
      this.createSearchOptions(this.getBitstreamUUID(), null), false, true,
      followLink('clarinLicense'))
      .pipe(
        getFirstSucceededRemoteListPayload())
      .subscribe(resourceMappingList => {
        // Every bitstream has only one resourceMapping
        const resourceMapping = resourceMappingList?.[0];
        if (isEmpty(resourceMapping)) {
          this.error$.value.push('Cannot load the Resource Mapping');
          return;
        }
        this.resourceMapping$.next(resourceMapping);

        // Load ClarinLicense from resourceMapping
        resourceMapping.clarinLicense
          .pipe(getFirstCompletedRemoteData())
          .subscribe(clarinLicense => {
            if (isEmpty(clarinLicense?.payload)) {
              this.error$.value.push('Cannot load the License');
            }
            this.clarinLicense$.next(clarinLicense?.payload);
            // Load required info from ClarinLicense
            // @ts-ignore
            this.requiredInfo$.next(clarinLicense?.payload?.requiredInfo);
          });
      });
  }

  public shouldSeeSendTokenInfo() {
    let shouldSee = false;
    this.requiredInfo$?.value?.forEach(requiredInfo => {
      if (requiredInfo?.name === 'SEND_TOKEN') {
        shouldSee = true;
      }
    });
    return shouldSee;
  }

  private loadUserRegistrationAndUserMetadata() {
    this.userRegistrationService.searchBy('byEPerson',
      this.createSearchOptions(null, this.currentUser$.value?.uuid), false, true,
      followLink('userMetadata'))
      .pipe(getFirstCompletedRemoteData())
      .subscribe(userRegistrationRD$ => {
        if (isNotEmpty(this.currentUser$.value?.uuid) && isEmpty(userRegistrationRD$?.payload)) {
          this.error$.value.push('Cannot load userRegistration');
          return;
        }
        // Every user has only one userRegistration record
        const userRegistration = userRegistrationRD$?.payload?.page?.[0];
        if (isEmpty(userRegistration)) {
          return;
        }
        this.userRegistration$.next(userRegistration);

        // Load userMetadata from userRegistration
        userRegistration.userMetadata
          .pipe(
            getFirstCompletedRemoteData())
          .subscribe(userMetadata$ => {
            if (hasFailed(userMetadata$.state)) {
              this.error$.value.push('Cannot load userMetadata');
              return;
            }
            this.userMetadata$.next(userMetadata$.payload);
          });
      });
  }

  private loadCurrentUser() {
    this.getCurrentUser().pipe(take(1)).subscribe((user) => {
      this.currentUser$.next(user);
    });
  }

  private checkFilledInRequiredInfo() {
    const areFilledIn = [];
    // Every requiredInfo.name === userMetadata.metadataKey must have the value in the userMetadata.metadataValue
    this.requiredInfo$?.value?.forEach(requiredInfo => {
      let hasMetadataValue = false;
      this.userMetadata$?.value?.page?.forEach(userMetadata => {
        if (userMetadata.metadataKey === requiredInfo.name) {
          if (isNotEmpty(userMetadata.metadataValue)) {
            hasMetadataValue = true;
          }
        }
      });
      areFilledIn.push(hasMetadataValue);
    });

    // Some required info wasn't filled in
    if (areFilledIn.includes(false)) {
      return false;
    }
    return true;
  }

  private createSearchOptions(bitstreamUUID: string, ePersonUUID: string) {
    const params = [];
    if (hasValue(bitstreamUUID)) {
      params.push(new RequestParam('bitstreamUUID', bitstreamUUID));
    }
    if (hasValue(ePersonUUID)) {
      params.push(new RequestParam('userUUID', ePersonUUID));
    }
    return Object.assign(new FindListOptions(), {
      searchParams: [...params]
    });
  }

  /**
   * Retrieve the current user
   */
  private getCurrentUser(): Observable<EPerson> {
    return this.auth.isAuthenticated().pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          return this.auth.getAuthenticatedUserFromStore();
        } else {
          return observableOf(undefined);
        }
      })
    );
  }

  private loadIPAddress() {
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress$.next(res.ip);
    });
  }

  private loadCurrentItem() {
    // Load Item from ItemRestRepository - search method
    this.itemService.searchBy('byBitstream',
      this.createSearchOptions(this.getBitstreamUUID(), null), false, true)
      .pipe(
        getFirstSucceededRemoteListPayload())
      .subscribe(itemList => {
        // The bitstream should be attached only to the one item.
        const item = itemList?.[0];
        if (isEmpty(item)) {
          this.error$.value.push('Cannot load the Item');
          return;
        }
        this.item$.next(item);
      });
  }

  private loadHelpDeskEmail() {
    this.helpDesk$ = this.configurationDataService.findByPropertyName(HELP_DESK_PROPERTY);
  }
}
