import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClarinLicense } from '../../core/shared/clarin/clarin-license.model';
import { ClarinLicenseDataService } from '../../core/data/clarin/clarin-license-data.service';
import { getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { ClarinLicenseRequiredInfo } from '../../core/shared/clarin/clarin-license.resource-type';
import { ClarinLicenseRequiredInfoSerializer } from '../../core/shared/clarin/clarin-license-required-info-serializer';

@Component({
  selector: 'ds-clarin-all-licenses-page',
  templateUrl: './clarin-all-licenses-page.component.html',
  styleUrls: ['./clarin-all-licenses-page.component.scss']
})
export class ClarinAllLicensesPageComponent implements OnInit {

  /**
   * The list of ClarinLicense object as BehaviorSubject object
   */
  licensesRD$: BehaviorSubject<ClarinLicense[]> = new BehaviorSubject<ClarinLicense[]>(null);

  /**
   * If the request isn't processed show to loading bar.
   */
  isLoading = false;

  constructor(private clarinLicenseService: ClarinLicenseDataService) { }

  ngOnInit(): void {
    this.loadAllLicenses();
  }

  loadAllLicenses() {
    this.isLoading = true;

    const options = new FindListOptions();
    options.currentPage = 0;
    // Load all licenses
    options.elementsPerPage = 1000;
    return this.clarinLicenseService.findAll(options, false)
      .pipe(getFirstSucceededRemoteListPayload())
      .subscribe(res => {
        this.licensesRD$.next(this.filterLicensesByLicenseLabel(res));
        this.isLoading = false;
      });
  }

  /**
   * Show PUB licenses at first, then ACA and RES
   * @private
   */
  private filterLicensesByLicenseLabel(clarinLicensesResponse: ClarinLicense[]) {
    // Show PUB licenses as first.
    const pubLicenseArray = [];
    // Then show ACA and RES licenses.
    const acaResLicenseArray = [];

    clarinLicensesResponse?.forEach(clarinLicense => {
      if (clarinLicense?.clarinLicenseLabel?.label === 'PUB') {
        pubLicenseArray.push(clarinLicense);
      } else {
        acaResLicenseArray.push(clarinLicense);
      }
    });

    // Sort acaResLicenseArray by the license label (ACA, RES)
    acaResLicenseArray.sort((a, b) => a.clarinLicenseLabel?.label?.localeCompare(b.clarinLicenseLabel?.label));

    // Concat two array into one.
    return pubLicenseArray.concat(acaResLicenseArray);
  }

  /**
   * ClarinLicense has RequiredInfo stored as string in the database, convert this string value into
   * list of ClarinLicenseRequiredInfo objects.
   */
  public getRequiredInfo(clarinLicense: ClarinLicense): ClarinLicenseRequiredInfo[] {
    let requiredInfo = clarinLicense.requiredInfo;
    if (typeof requiredInfo === 'string') {
      requiredInfo = ClarinLicenseRequiredInfoSerializer.Deserialize(requiredInfo);
    }
    return requiredInfo;
  }

}
