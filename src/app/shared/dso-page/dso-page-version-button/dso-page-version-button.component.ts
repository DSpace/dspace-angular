import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';

@Component({
  selector: 'ds-dso-page-version-button',
  templateUrl: './dso-page-version-button.component.html',
  styleUrls: ['./dso-page-version-button.component.scss']
})
/**
 * Display a button linking to the edit page of a DSpaceObject
 */
export class DsoPageVersionButtonComponent implements OnInit {
  /**
   * The DSpaceObject to display a button to the edit page for
   */
  @Input() dso: DSpaceObject;

  /**
   * A message for the tooltip on the button
   * Supports i18n keys
   */
  @Input() tooltipMsg: string;

  /**
   * Emits an event that triggers the creation of the new version
   */
  @Output() newVersionEvent = new EventEmitter();

  /**
   * Whether or not the current user is authorized to create a new version of the DSpaceObject
   */
  isAuthorized$: Observable<boolean>;

  constructor(protected authorizationService: AuthorizationDataService) {
  }

  /**
   * Creates a new version for the current item
   */
  createNewVersion() {
    this.newVersionEvent.emit();
  }

  ngOnInit() {
    // TODO show if user can view history
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanEditMetadata, this.dso.self);
  }

}
