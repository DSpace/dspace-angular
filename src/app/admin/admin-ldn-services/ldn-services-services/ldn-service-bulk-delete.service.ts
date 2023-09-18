import { Injectable } from '@angular/core';
import { BehaviorSubject, count, from } from 'rxjs';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { isNotEmpty } from '../../../shared/empty.util';
import { concatMap, filter, tap } from 'rxjs/operators';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { LdnService } from '../ldn-services-model/ldn-services.model';
@Injectable({
  providedIn: 'root'
})
/**
 * Service to facilitate removing ldn services in bulk.
 */
export class LdnServicesBulkDeleteService {

  /**
   * Array to track the services to be deleted
   */
  ldnServicesToDelete: string[] = [];

  /**
   * Behavior subject to track whether the delete is processing
   * @protected
   */
  protected isProcessingBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected processLdnService: LdnServicesService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService
  ) {
  }

  /**
   * Add or remove a process id to/from the list
   * If the id is already present it will be removed, otherwise it will be added.
   *
   * @param notifyServiceName - The process id to add or remove
   */
  toggleDelete(notifyServiceName: string) {
    if (this.isToBeDeleted(notifyServiceName)) {
      this.ldnServicesToDelete.splice(this.ldnServicesToDelete.indexOf(notifyServiceName), 1);
    } else {
      this.ldnServicesToDelete.push(notifyServiceName);
    }
  }

  /**
   * Checks if the provided service id is present in the to be deleted list
   * @param notifyServiceName
   */
  isToBeDeleted(notifyServiceName: string) {
    return this.ldnServicesToDelete.includes(notifyServiceName);
  }

  /**
   * Clear the list of services to be deleted
   */
  clearAllServices() {
    this.ldnServicesToDelete.splice(0);
  }

  /**
   * Get the amount of processes selected for deletion
   */
  getAmountOfSelectedServices() {
    return this.ldnServicesToDelete.length;
  }

  /**
   * Returns a behavior subject to indicate whether the bulk delete is processing
   */
  isProcessing$() {
    return this.isProcessingBehaviorSubject;
  }

  /**
   * Returns whether there currently are values selected for deletion
   */
  hasSelected(): boolean {
    return isNotEmpty(this.ldnServicesToDelete);
  }

  /**
   * Delete all selected processes one by one
   * When the deletion for a process fails, an error notification will be shown with the process id,
   * but it will continue deleting the other processes.
   * At the end it will show a notification stating the amount of successful deletes
   * The successfully deleted processes will be removed from the list of selected values, the failed ones will be retained.
   */
 deleteSelectedLdnServices() {
    this.isProcessingBehaviorSubject.next(true);

    from([...this.ldnServicesToDelete]).pipe(
      concatMap((notifyServiceName) => {
        return this.processLdnService.delete(notifyServiceName).pipe(
          getFirstCompletedRemoteData(),
          tap((rd: RemoteData<LdnService>) => {
            if (rd.hasFailed) {
              this.notificationsService.error(this.translateService.get('process.bulk.delete.error.head'), this.translateService.get('process.bulk.delete.error.body', {processId: notifyServiceName}));
            } else {
              this.toggleDelete(notifyServiceName);
            }
          })
        );
      }),
      filter((rd: RemoteData<LdnService>) => rd.hasSucceeded),
      count(),
    ).subscribe((value) => {
      this.notificationsService.success(this.translateService.get('process.bulk.delete.success', {count: value}));
      this.isProcessingBehaviorSubject.next(false);
    });
  }
}
