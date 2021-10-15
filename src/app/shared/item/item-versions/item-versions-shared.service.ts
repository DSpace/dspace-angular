import { Injectable } from '@angular/core';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Item } from '../../../core/shared/item.model';
import { switchMap } from 'rxjs/operators';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { Observable, of } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { Version } from '../../../core/shared/version.model';

@Injectable({
  providedIn: 'root'
})
export class ItemVersionsSharedService {

  constructor(
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private versionHistoryService: VersionHistoryDataService,
  ) {
  }

  private static msg(key: string): string {
    const translationPrefix = 'item.version.create.notification';
    return translationPrefix + '.' + key;
  }

  /**
   * Create a new version, notify success/failure and return new version number
   *
   * @param item the item from which a new version will be created
   * @param summary the optional summary for the new version
   */
  createNewVersionAndNotify(item: Item, summary: string): Observable<RemoteData<Version>> {
    return this.versionHistoryService.createVersion(item._links.self.href, summary).pipe(
      switchMap((postResult: RemoteData<Version>) => {
        const newVersionNumber = postResult?.payload?.version;
        this.notifyCreateNewVersionBak(postResult.hasSucceeded, postResult.statusCode, newVersionNumber);
        return of(postResult);
      })
    );
  }

  public notifyCreateNewVersion(newVersionRD: RemoteData<Version>) {
    const newVersionNumber = newVersionRD?.payload?.version;
    newVersionRD.hasSucceeded ?
      this.notificationsService.success(null, this.translateService.get(ItemVersionsSharedService.msg('success'), {version: newVersionNumber})) :
      this.notificationsService.error(null, this.translateService.get(ItemVersionsSharedService.msg(newVersionRD?.statusCode === 422 ? 'inProgress' : 'failure')));
  }

  private notifyCreateNewVersionBak(success: boolean, statusCode: number, newVersionNumber: number) { // TODO delete this
    success ?
      this.notificationsService.success(null, this.translateService.get(ItemVersionsSharedService.msg('success'), {version: newVersionNumber})) :
      this.notificationsService.error(null, this.translateService.get(ItemVersionsSharedService.msg(statusCode === 422 ? 'inProgress' : 'failure')));
  }

}
