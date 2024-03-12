import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  first,
  map,
} from 'rxjs/operators';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { ComColDataService } from '../../../../core/data/comcol-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { Collection } from '../../../../core/shared/collection.model';
import { Community } from '../../../../core/shared/community.model';
import { NoContent } from '../../../../core/shared/NoContent.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { NotificationsService } from '../../../notifications/notifications.service';

/**
 * Component representing the delete page for communities and collections
 */
@Component({
  selector: 'ds-delete-comcol',
  template: '',
  standalone: true,
})
export class DeleteComColPageComponent<TDomain extends Community | Collection> implements OnInit {
  /**
   * Frontend endpoint for this type of DSO
   */
  protected frontendURL: string;
  /**
   * The initial DSO object
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;

  /**
   * A boolean representing if a delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public constructor(
    protected dsoDataService: ComColDataService<TDomain>,
    public dsoNameService: DSONameService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifications: NotificationsService,
    protected translate: TranslateService,
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
    this.processing$.next(true);
    this.dsoDataService.delete(dso.id)
      .pipe(getFirstCompletedRemoteData())
      .subscribe((response: RemoteData<NoContent>) => {
        if (response.hasSucceeded) {
          const successMessage = this.translate.instant((dso as any).type + '.delete.notification.success');
          this.notifications.success(successMessage);
        } else {
          const errorMessage = this.translate.instant((dso as any).type + '.delete.notification.fail');
          this.notifications.error(errorMessage);
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
