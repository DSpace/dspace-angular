// eslint-disable-next-line max-classes-per-file
import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload
} from '../../core/shared/operators';
import { Collection } from '../../core/shared/collection.model';
import { isNull } from '../empty.util';
import { followLink } from '../utils/follow-link-config.model';
import { Community } from '../../core/shared/community.model';
import { BehaviorSubject } from 'rxjs';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { switchMap } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { ClarinLicense } from '../../core/shared/clarin/clarin-license.model';
import { ClarinLicenseDataService } from '../../core/data/clarin/clarin-license-data.service';
import { getBaseUrl, secureImageData } from '../clarin-shared-util';
import { DomSanitizer } from '@angular/platform-browser';
import { BundleDataService } from '../../core/data/bundle-data.service';
import { Bundle } from '../../core/shared/bundle.model';
import { Bitstream } from '../../core/shared/bitstream.model';
import { LicenseType } from '../../item-page/clarin-license-info/clarin-license-info.component';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { ItemSearchResult } from '../object-collection/shared/item-search-result.model';

/**
 * Show item on the Home/Search page in the customized box with Item's information.
 */
@Component({
  selector: 'ds-clarin-item-box-view',
  templateUrl: './clarin-item-box-view.component.html',
  styleUrls: ['./clarin-item-box-view.component.scss']
})
export class ClarinItemBoxViewComponent implements OnInit {

  /**
   * Show information of this item.
   */
  @Input() object: Item|ListableObject = null;

  item: Item = null;

  /**
   * UI URL loaded from the server.
   */
  baseUrl = '';
  /**
   * Item's description text.
   */
  itemDescription = '';
  /**
   * Items's handle redirection URI.
   */
  itemUri = '';
  /**
   * The subject of the Item e.g., `Article,..`
   */
  itemType = '';
  /**
   * The name of the Item.
   */
  itemName = '';
  /**
   * The Item's owning community.
   */
  itemCommunity: BehaviorSubject<Community> = new BehaviorSubject<Community>(null);
  /**
   * URL for the searching Item's owning community.
   */
  communitySearchRedirect: BehaviorSubject<string> = new BehaviorSubject<string>('');
  /**
   * How kb/mb/gb has Item's files.
   */
  itemFilesSizeBytes: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  /**
   * How many files the Item has.
   */
  itemCountOfFiles: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  /**
   * Current License Label e.g. `PUB`
   */
  licenseLabel: string;
  /**
   * Current License name e.g. `Awesome License`
   */
  license: string;
  /**
   * Current License type e.g. `Publicly Available`
   */
  licenseType: string;
  /**
   * Current License Label icon as byte array.
   */
  licenseLabelIcons: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(protected collectionService: CollectionDataService,
              protected bundleService: BundleDataService,
              protected dsoNameService: DSONameService,
              protected configurationService: ConfigurationDataService,
              private clarinLicenseService: ClarinLicenseDataService,
              private sanitizer: DomSanitizer) { }

  async ngOnInit(): Promise<void> {
    if (this.object instanceof Item) {
      this.item = this.object;
    } else if (this.object instanceof ItemSearchResult) {
      this.item = this.object.indexableObject;
    } else {
      return;
    }

    // Load Items metadata
    this.itemType = this.item?.metadata?.['dc.type']?.[0]?.value;
    this.itemName = this.item?.metadata?.['dc.title']?.[0]?.value;
    this.itemUri = this.item?.metadata?.['dc.identifier.uri']?.[0]?.value;
    this.itemDescription = this.item?.metadata?.['dc.description']?.[0]?.value;

    await this.assignBaseUrl();
    this.getItemCommunity();
    this.loadItemLicense();
    this.getItemFilesSize();
  }

  private getItemFilesSize() {
    if (isNull(this.item)) {
      return;
    }
    this.bundleService.findByItemAndName(this.item, 'ORIGINAL', true, true, followLink('bitstreams'))
      .pipe(getFirstSucceededRemoteDataPayload())
      .subscribe((bundle: Bundle) => {
        bundle.bitstreams
          .pipe(getFirstSucceededRemoteListPayload())
          .subscribe((bitstreams: Bitstream[]) => {
            let sizeOfAllBitstreams = -1;
            bitstreams.forEach(bitstream => {
              sizeOfAllBitstreams += bitstream.sizeBytes;
            });
            this.itemFilesSizeBytes.next(sizeOfAllBitstreams);
            this.itemCountOfFiles.next(bitstreams.length);
          });
      });
  }

  private getItemCommunity() {
    if (isNull(this.item)) {
      return;
    }
    this.collectionService.findByHref(this.item?._links?.owningCollection?.href, true, true, followLink('parentCommunity'))
      .pipe(getFirstSucceededRemoteDataPayload())
      .subscribe((collection: Collection) => {
        collection.parentCommunity
          .pipe(getFirstSucceededRemoteDataPayload())
          .subscribe((community: Community) => {
            this.itemCommunity.next(community);
            this.communitySearchRedirect.next(this.baseUrl + '/search?f.items_owning_community=' +
              this.dsoNameService.getName(community) + ',equals');
          });
      });
  }
  async assignBaseUrl() {
    this.baseUrl = await getBaseUrl(this.configurationService)
      .then((baseUrlResponse: ConfigurationProperty) => {
        return baseUrlResponse?.values?.[0];
      });
  }

  private loadItemLicense() {
    // load license info from item attributes
    this.licenseLabel = this.item?.metadata?.['dc.rights.label']?.[0]?.value;
    this.license = this.item?.metadata?.['dc.rights']?.[0]?.value;
    switch (this.licenseLabel) {
      case LicenseType.public:
        this.licenseType = 'Publicly Available';
        break;
      case LicenseType.restricted:
        this.licenseType = 'Restricted Use';
        break;
      case LicenseType.academic:
        this.licenseType = 'Academic Use';
        break;
    }

    // load license label icons
    const options = {
      searchParams: [
        {
          fieldName: 'name',
          fieldValue: this.license
        }
      ]
    };
    this.clarinLicenseService.searchBy('byName', options, false)
      .pipe(
        getFirstCompletedRemoteData(),
        switchMap((clList: RemoteData<PaginatedList<ClarinLicense>>) => clList?.payload?.page))
      .subscribe(clarinLicense => {
        let iconsList = [];
        clarinLicense.extendedClarinLicenseLabels.forEach(extendedCll => {
          iconsList.push(extendedCll?.icon);
        });
        this.licenseLabelIcons.next(iconsList);
      });
  }

  secureImageData(imageByteArray) {
    return secureImageData(this.sanitizer, imageByteArray);
  }
}

/**
 * Redirect the user after clicking on the `Author`.
 */
// tslint:disable-next-line:max-classes-per-file
export class AuthorNameLink {
  name: string;
  url: string;
}
