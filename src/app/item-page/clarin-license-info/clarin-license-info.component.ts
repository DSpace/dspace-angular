import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { switchMap } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { ClarinLicenseDataService } from '../../core/data/clarin/clarin-license-data.service';
import { ClarinLicense } from '../../core/shared/clarin/clarin-license.model';
import { DomSanitizer } from '@angular/platform-browser';
import { secureImageData } from '../../shared/clarin-shared-util';
import { BehaviorSubject } from 'rxjs';
import { LocaleService } from '../../core/locale/locale.service';

/**
 * This component show clarin license info in the item page and item full page.
 */
@Component({
  selector: 'ds-clarin-license-info',
  templateUrl: './clarin-license-info.component.html',
  styleUrls: ['./clarin-license-info.component.scss']
})
export class ClarinLicenseInfoComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer,
              private clarinLicenseService: ClarinLicenseDataService,
              private localeService: LocaleService) { }

  /**
   * The item to display a version history for
   */
  @Input() item: Item;

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
   * Current License URI e.g. `http://www.awesomelicense.edu`
   */
  licenseURI: string;

  /**
   * Current License Label icon as byte array.
   */
  licenseLabelIcons: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  ngOnInit(): void {
    // load license info from item attributes
    this.licenseLabel = this.item.metadata?.['dc.rights.label']?.[0]?.value;
    this.license = this.item.metadata?.['dc.rights']?.[0]?.value;
    this.licenseURI = this.item.metadata?.['dc.rights.uri']?.[0]?.value;
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
            iconsList.push(extendedCll);
          });
          this.licenseLabelIcons.next(iconsList);
        });
  }

  secureImageData(imageByteArray) {
    return secureImageData(this.sanitizer, imageByteArray);
  }

  /**
   * Check if current english is Czech
   */
  isCsLocale() {
    return this.localeService.getCurrentLanguageCode() === 'cs';
  }
}

export enum LicenseType {
  public = 'PUB',
  restricted = 'RES',
  academic = 'ACA'
}
