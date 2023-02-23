import {Component, Input, OnInit} from '@angular/core';
import {DSpaceObject} from '../../core/shared/dspace-object.model';
import {Observable} from 'rxjs';
import {AuthorizationDataService} from '../../core/data/feature-authorization/authorization-data.service';
import {FeatureID} from '../../core/data/feature-authorization/feature-id';

@Component({
  selector: 'ds-clarin-statistics-button',
  templateUrl: './clarin-statistics-button.component.html',
  styleUrls: ['./clarin-statistics-button.component.scss']
})
export class ClarinStatisticsButtonComponent implements OnInit {

  /**
   * The DSpaceObject to display a button to the edit page for
   */
  @Input() dso: DSpaceObject;

  /**
   * The prefix of the route to the edit page (before the object's UUID, e.g. "items")
   */
  @Input() pageRoute: string;

  /**
   * A message for the tooltip on the button
   * Supports i18n keys
   */
  @Input() tooltipMsg: string;

  /**
   * Whether or not the current user is authorized to edit the DSpaceObject
   */
  isAuthorized$: Observable<boolean>;

  constructor(protected authorizationService: AuthorizationDataService) { }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanEditMetadata, this.dso.self);
  }

}
