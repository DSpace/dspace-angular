import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Observable } from 'rxjs';

import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';

@Pipe({
  name: 'dsCanDownloadFile',
  standalone: true,
})
export class CanDownloadFilePipe implements PipeTransform {
  constructor(private authorizationServcie: AuthorizationDataService) {
  }
  transform(href: string): Observable<boolean> {
    return this.authorizationServcie.isAuthorized(FeatureID.CanDownload, href);
  }
}
