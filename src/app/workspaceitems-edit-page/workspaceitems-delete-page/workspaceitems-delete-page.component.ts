import {
  CommonModule,
  Location,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Data,
  Params,
  Router,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  map,
  Observable,
  switchMap,
  take,
} from 'rxjs';

import { RemoteData } from '../../core/data/remote-data';
import { RouteService } from '../../core/services/route.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NoContent } from '../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../core/shared/operators';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { ModifyItemOverviewComponent } from '../../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-base-workspaceitems-delete-page',
  templateUrl: './workspaceitems-delete-page.component.html',
  styleUrls: ['./workspaceitems-delete-page.component.scss'],
  imports: [
    ModifyItemOverviewComponent,
    TranslateModule,
    CommonModule,
  ],
  standalone: true,
})
export class WorkspaceItemsDeletePageComponent implements OnInit {

  /**
   * The workspaceitem to delete
   */
  public wsi$: Observable<WorkspaceItem>;

  /**
   * The dspace object
   */
  public dso$: Observable<DSpaceObject>;

  /**
   * The previous query parameters
   */
  private previousQueryParameters?: Params;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeService: RouteService,
    private workspaceItemService: WorkspaceitemDataService,
    private notificationsService: NotificationsService,
    private translationService: TranslateService,
    private location: Location,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.wsi$ = this.activatedRoute.data.pipe(map((data: Data) => data.wsi as RemoteData<WorkspaceItem>), getRemoteDataPayload());
    this.dso$ = this.activatedRoute.data.pipe(map((data: Data) => data.dso as RemoteData<WorkspaceItem>), getRemoteDataPayload());
    this.previousQueryParameters = (this.location.getState() as { [key: string]: any }).previousQueryParams;
  }

  /**
   * Navigates to the previous url
   * If there's not previous url, it continues to the mydspace page instead
   */
  previousPage() {
    this.routeService.getPreviousUrl().pipe(take(1))
      .subscribe((url: string) => {
        let params: Params = {};
        if (!url) {
          url = '/mydspace';
          params = this.previousQueryParameters;
        }
        if (url.split('?').length > 1) {
          for (const param of url.split('?')[1].split('&')) {
            params[param.split('=')[0]] = decodeURIComponent(param.split('=')[1]);
          }
        }
        void this.router.navigate([url.split('?')[0]], { queryParams: params });
      },
      );
  }

  /**
   * Open the modal to confirm the deletion of the workspaceitem
   */
  public async confirmDelete(content) {
    await this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.sendDeleteRequest();
        }
      },
    );
  }

  /**
   * Delete the target workspaceitem object
   */
  sendDeleteRequest() {
    this.wsi$.pipe(
      switchMap((wsi: WorkspaceItem) => this.workspaceItemService.delete(wsi.id).pipe(
        getFirstCompletedRemoteData(),
      )),
    ).subscribe((response: RemoteData<NoContent>) => {
      if (response.hasSucceeded) {
        const title = this.translationService.get('workspace-item.delete.notification.success.title');
        const content = this.translationService.get('workspace-item.delete.title');
        this.notificationsService.success(title, content);
        this.previousPage();
      } else {
        const title = this.translationService.get('workspace-item.delete.notification.error.title');
        const content = this.translationService.get('workspace-item.delete.notification.error.content');
        this.notificationsService.error(title, content);
      }
    });
  }
}
