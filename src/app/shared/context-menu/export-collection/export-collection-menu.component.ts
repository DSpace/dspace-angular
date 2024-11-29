import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import {
  COLLECTION_EXPORT_SCRIPT_NAME,
  ScriptDataService,
} from '../../../core/data/processes/script-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { Process } from '../../../process-page/processes/process.model';
import { ProcessParameter } from '../../../process-page/processes/process-parameter.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-export-item',
  templateUrl: './export-collection-menu.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ExportCollectionMenuComponent extends ContextMenuEntryComponent implements OnInit {

  isCollectionAdmin$: Observable<boolean>;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NotificationsService} notificationService
   * @param {RequestService} requestService
   * @param {Router} router
   * @param {ScriptDataService} scriptService
   * @param {TranslateService} translationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private authorizationService: AuthorizationDataService,
    private notificationService: NotificationsService,
    private requestService: RequestService,
    private router: Router,
    private scriptService: ScriptDataService,
    private translationService: TranslateService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ExportCollection);
  }

  ngOnInit() {
    this.isCollectionAdmin$ = this.notificationService.claimedProfile.pipe(
      switchMap(() => this.isCollectionAdmin(false)),
    );
  }

  /**
   * Launch a process to export collection
   */
  exportCollection() {
    const stringParameters: ProcessParameter[] = [
      { name: '-c', value: this.contextMenuObject.id },
    ];

    this.scriptService.invoke(COLLECTION_EXPORT_SCRIPT_NAME, stringParameters, [])
      .pipe(getFirstCompletedRemoteData())
      .subscribe((rd: RemoteData<Process>) => {
        if (rd.isSuccess) {
          this.notificationService.success(this.translationService.get('collection-export.success'));
          this.navigateToProcesses();
        } else {
          this.notificationService.error(this.translationService.get('collection-export.error'));
        }
      });
  }

  /**
   * Check if user is administrator for this collection
   */
  isCollectionAdmin(useCachedVersion = true): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, this.contextMenuObject.self, undefined, useCachedVersion);
  }

  /**
   * Redirect to process list page
   */
  private navigateToProcesses() {
    this.requestService.removeByHrefSubstring('/processes');
    this.router.navigateByUrl('/processes');
  }
}
