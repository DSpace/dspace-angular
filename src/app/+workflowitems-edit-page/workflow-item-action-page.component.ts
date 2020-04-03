import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { WorkflowItem } from '../core/submission/models/workflowitem.model';
import { Item } from '../core/shared/item.model';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';
import { RouteService } from '../core/services/route.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { RemoteData } from '../core/data/remote-data';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../core/shared/operators';
import { isEmpty } from '../shared/empty.util';

export abstract class WorkflowItemActionPageComponent implements OnInit {
  public type;
  public wfi$: Observable<WorkflowItem>;
  public item$: Observable<Item>;

  constructor(protected route: ActivatedRoute,
              protected workflowItemService: WorkflowItemDataService,
              protected router: Router,
              protected routeService: RouteService,
              protected notificationsService: NotificationsService,
              protected translationService: TranslateService) {
  }

  ngOnInit() {
    this.type = this.getType();
    this.wfi$ = this.route.data.pipe(map((data: Data) => data.wfi as RemoteData<WorkflowItem>), getRemoteDataPayload());
    this.item$ = this.wfi$.pipe(switchMap((wfi: WorkflowItem) => (wfi.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload())));
  }

  performAction() {
    this.wfi$.pipe(
      take(1),
      switchMap((wfi: WorkflowItem) => this.sendRequest(wfi.id))
    ).subscribe((successful: boolean) => {
      if (successful) {
        const title = this.translationService.get('workflow-item.' + this.type + '.notification.success.title');
        const content = this.translationService.get('workflow-item.' + this.type + '.notification.success.content');
        this.notificationsService.success(title, content)
      } else {
        const title = this.translationService.get('workflow-item.' + this.type + '.notification.error.title');
        const content = this.translationService.get('workflow-item.' + this.type + '.notification.error.content');
        this.notificationsService.error(title, content)
      }
      this.previousPage();
    })
  }

  previousPage() {
    this.routeService.getPreviousUrl().pipe(take(1))
      .subscribe((url) => {
          if (isEmpty(url)) {
            url = '/mydspace';
          }
          this.router.navigateByUrl(url);

        }
      );
  }
  abstract sendRequest(id: string): Observable<boolean>;
  abstract getType(): string;
}
