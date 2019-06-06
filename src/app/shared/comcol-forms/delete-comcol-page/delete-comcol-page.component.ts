import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../core/data/remote-data';
import { first, map } from 'rxjs/operators';
import { DataService } from '../../../core/data/data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component representing the delete page for communities and collections
 */
@Component({
  selector: 'ds-delete-comcol',
  template: ''
})
export class DeleteComColPageComponent<TDomain extends DSpaceObject> implements OnInit {
  /**
   * Frontend endpoint for this type of DSO
   */
  protected frontendURL: string;
  /**
   * The initial DSO object
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;

  public constructor(
    protected dsoDataService: DataService<TDomain>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifications: NotificationsService,
    protected translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.data.pipe(first(), map((data) => data.dso));
  }

  /**
   * @param {TDomain} dso The DSO to delete
   * Deletes an existing DSO and redirects to the home page afterwards, showing a notification that states whether or not the deletion was successful
   */
  onConfirm(dso: TDomain) {
    this.dsoDataService.delete(dso)
      .pipe(first())
      .subscribe((success: boolean) => {
        if (success) {
          const successMessage = this.translate.instant(dso.type + '.delete.notification.success');
          this.notifications.success(successMessage)
        } else {
          const errorMessage = this.translate.instant(dso.type + '.delete.notification.fail');
          this.notifications.error(errorMessage)
        }
        this.router.navigate(['/']);
      });
  }

  /**
   * @param {TDomain} dso The DSO for which the delete action was canceled
   * When a delete is canceled, the user is redirected to the DSO's edit page
   */
  onCancel(dso: TDomain) {
    this.router.navigate([this.frontendURL + '/' + dso.uuid + '/edit']);
  }
}
