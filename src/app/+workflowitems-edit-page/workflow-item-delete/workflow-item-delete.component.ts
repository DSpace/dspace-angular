import { Component, OnInit } from '@angular/core';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { Item } from '../../core/shared/item.model';
import { Observable } from 'rxjs';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RouteService } from '../../core/services/route.service';

@Component({
  selector: 'ds-workflow-item-delete',
  templateUrl: './workflow-item-delete.component.html',
  styleUrls: ['./workflow-item-delete.component.scss']
})
export class WorkflowItemDeleteComponent implements OnInit {
  public wfi$: Observable<WorkflowItem>;
  public item$: Observable<Item>;

  constructor(private route: ActivatedRoute,
              private workflowItemService: WorkflowItemDataService,
              private router: Router,
              private routeService: RouteService,
              private notificationsService: NotificationsService,
              private translationService: TranslateService) {
  }

  ngOnInit() {
    this.route.data.subscribe((t) => console.log(t));
    this.wfi$ = this.route.data.pipe(map((data: Data) => data.wfi as RemoteData<WorkflowItem>), getRemoteDataPayload());
    this.item$ = this.wfi$.pipe(switchMap((wfi: WorkflowItem) => (wfi.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));
  }

  delete() {
    this.wfi$.pipe(
      take(1),
      switchMap((wfi: WorkflowItem) => this.workflowItemService.delete(wfi.id))
    ).subscribe((successful: boolean) => {
      if (successful) {
        const title = this.translationService.get('workflowitem.delete.notification.success.title');
        const content = this.translationService.get('workflowitem.delete.notification.success.content');
        this.notificationsService.success(title, content)
      } else {
        const title = this.translationService.get('workflowitem.delete.notification.error.title');
        const content = this.translationService.get('workflowitem.delete.notification.error.content');
        this.notificationsService.error(title, content)
      }
      this.previousPage();
    })
  }

  previousPage() {
    this.routeService.getPreviousUrl();
  }
}
