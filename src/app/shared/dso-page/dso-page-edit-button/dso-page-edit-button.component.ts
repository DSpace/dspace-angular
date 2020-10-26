import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';

@Component({
  selector: 'ds-dso-page-edit-button',
  templateUrl: './dso-page-edit-button.component.html',
  styleUrls: ['./dso-page-edit-button.component.scss']
})
export class DsoPageEditButtonComponent implements OnInit {

  @Input() dso: DSpaceObject;

  @Input() pageRoutePrefix: string;

  @Input() tooltipMsg: string;

  isAuthorized$: Observable<boolean>;

  constructor(protected authorizationService: AuthorizationDataService) { }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanEditMetadata, this.dso.self);
  }

}
