import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { Item } from '../../../core/shared/item.model';
import { switchMap } from 'rxjs/operators';
import { VersionDataService } from '../../../core/data/version-data.service';
import { of } from 'rxjs';

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
   * The item for which display a button to create a new version
   */
  @Input() dso: Item;

  /**
   * A message for the tooltip on the button
   * Supports i18n keys
   */
  @Input() tooltipMsgCreate: string;

  /**
   * A message for the tooltip on the button (when is disabled)
   * Supports i18n keys
   */
  @Input() tooltipMsgHasDraft: string;

  /**
   * Emits an event that triggers the creation of the new version
   */
  @Output() newVersionEvent = new EventEmitter();

  /**
   * Whether or not the current user is authorized to create a new version of the DSpaceObject
   */
  isAuthorized$: Observable<boolean>;

  hasDraftVersion$: Observable<boolean>;

  tooltipMsg$: Observable<string>;

  constructor(
    protected authorizationService: AuthorizationDataService,
    protected versionHistoryService: VersionHistoryDataService,
  ) {
  }

  /**
   * Creates a new version for the current item
   */
  createNewVersion() {
    this.newVersionEvent.emit();
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanCreateVersion, this.dso.self);
    this.hasDraftVersion$ = this.versionHistoryService.hasDraftVersion$(this.dso._links.version.href);
    this.tooltipMsg$ = this.hasDraftVersion$.pipe(
      switchMap((hasDraftVersion) => of(hasDraftVersion ? this.tooltipMsgHasDraft : this.tooltipMsgCreate)),
    );
  }

}
