import {Component, Input, OnInit} from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { AlertType } from '../../shared/alert/alert-type';
import {Observable} from 'rxjs';
import {FeatureID} from '../../core/data/feature-authorization/feature-id';
import {AuthorizationDataService} from '../../core/data/feature-authorization/authorization-data.service';

@Component({
  selector: 'ds-item-alerts',
  templateUrl: './item-alerts.component.html',
  styleUrls: ['./item-alerts.component.scss']
})
/**
 * Component displaying alerts for an item
 */
export class ItemAlertsComponent implements OnInit {
  /**
   * The Item to display alerts for
   */
  @Input() item: Item;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  isAdministrator$: Observable<boolean>;

  constructor(private authorizationService: AuthorizationDataService) {
  }

  ngOnInit() {
    this.isAdministrator$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }
}
