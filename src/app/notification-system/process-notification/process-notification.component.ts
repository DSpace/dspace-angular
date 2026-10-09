import { trigger } from '@angular/animations';
import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationAnimationsStatus } from '@dspace/config/notifications-config.interfaces';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { ProcessDataService } from '@dspace/core/data/processes/process-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { IProcessNotification } from '@dspace/core/notification-system/models/process-notification.model';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Process } from '@dspace/core/processes/process.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import {
  getAllCompletedRemoteData,
  getFirstCompletedRemoteData,
} from '@dspace/core/shared/operators';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
  timer,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import {
  fadeInEnter,
  fadeInState,
  fadeOutLeave,
  fadeOutState,
} from '../../shared/animations/fade';
import {
  fromBottomEnter,
  fromBottomInState,
  fromBottomLeave,
  fromBottomOutState,
} from '../../shared/animations/fromBottom';
import {
  fromLeftEnter,
  fromLeftInState,
  fromLeftLeave,
  fromLeftOutState,
} from '../../shared/animations/fromLeft';
import {
  fromRightEnter,
  fromRightInState,
  fromRightLeave,
  fromRightOutState,
} from '../../shared/animations/fromRight';
import {
  fromTopEnter,
  fromTopInState,
  fromTopLeave,
  fromTopOutState,
} from '../../shared/animations/fromTop';
import {
  rotateEnter,
  rotateInState,
  rotateLeave,
  rotateOutState,
} from '../../shared/animations/rotate';
import {
  scaleEnter,
  scaleInState,
  scaleLeave,
  scaleOutState,
} from '../../shared/animations/scale';
import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { ThemedFileDownloadLinkComponent } from '../../shared/file-download-link/themed-file-download-link.component';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';

@Component({
  selector: 'ds-process-notification',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('enterLeave', [
      fadeInEnter, fadeInState, fadeOutLeave, fadeOutState,
      fromBottomEnter, fromBottomInState, fromBottomLeave, fromBottomOutState,
      fromRightEnter, fromRightInState, fromRightLeave, fromRightOutState,
      fromLeftEnter, fromLeftInState, fromLeftLeave, fromLeftOutState,
      fromTopEnter, fromTopInState, fromTopLeave, fromTopOutState,
      rotateInState, rotateEnter, rotateOutState, rotateLeave,
      scaleInState, scaleEnter, scaleOutState, scaleLeave,
    ]),
  ],
  templateUrl: './process-notification.component.html',
  styleUrls: ['./process-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FileSizePipe,
    NgTemplateOutlet,
    ThemedFileDownloadLinkComponent,
    TranslateModule,
  ],
})

export class ProcessNotificationComponent implements OnInit, OnDestroy {

  /**
   * Notification that is being processed.
   */
  @Input() public notification: IProcessNotification = null;

  /**
   * Title of the notification.
   */
  public title: Observable<string>;

  /**
   * Is title an html or a simple text.
   */
  public html: any;

  /**
   * Is title an html or a simple text..
   */
  public titleIsTemplate = false;

  /**
   * Animation of the notification.
   */
  public animate: string;

  /**
   * Subscription for timer.
   */
  private sub: Subscription;

  /**
   * The process that is being checked.
   */
  public processStatus$: BehaviorSubject<string> = new BehaviorSubject('');

  /**
   * If process checking is finished.
   */
  public finished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Files generated from process end.
   */
  public files$: BehaviorSubject<Bitstream[]> = new BehaviorSubject<Bitstream[]>([]);

  /**
   * Type of the notification visualisation.
   */
  public notificationType$: BehaviorSubject<string> = new BehaviorSubject('alert-info');

  constructor(private notificationService: NotificationsService,
              private domSanitizer: DomSanitizer,
              protected processService: ProcessDataService,
              protected nameService: DSONameService,
              private cdr: ChangeDetectorRef,
  ) {
  }

  /**
   * On init, start check process, and insert notifications information.
   */
  ngOnInit(): void {
    this.animate = this.notification.options.animate + NotificationAnimationsStatus.In;
    this.pollUntilProcessFinished();
    this.html = this.notification.html;
    this.contentType(this.notification.title, 'title');
  }

  /**
   * Poll process endpoint until it's finished.
   */
  pollUntilProcessFinished() {
    timer(0, this.notification.checkTime).pipe(
      switchMap(() => this.processService.getProcess(this.notification.processId)),
      getAllCompletedRemoteData(),
      filter((res: RemoteData<Process>) => res.hasFailed || res?.payload?.processStatus.toString() === 'COMPLETED' || res?.payload?.processStatus.toString() === 'FAILED'),
      take(1),
      tap((res: RemoteData<Process>) => this.pollingFinishedFor(res)),
      switchMap((res: RemoteData<Process>) => this.getFiles(res)),
    ).subscribe((files: Bitstream[]) => {
      const logFiles = files.filter( (file) => !this.getFileName(file).includes('.log'));
      this.files$.next(logFiles);
      this.finished.next(true);
    });
  }

  /**
   * Handle process results
   *
   * @param processRD The RemoteData object for finished process
   */
  pollingFinishedFor(processRD: RemoteData<Process>) {
    if (processRD.hasSucceeded && processRD.payload.processStatus.toString() === 'COMPLETED') {
      this.notificationType$.next('alert-success');
      this.processStatus$.next('process.new.notification.process.status.completed');
    } else {
      this.processStatus$.next('process.new.notification.process.status.failed');
      this.notificationType$.next('alert-danger');
    }
  }

  /**
   * When the process is completed get the files output.
   */
  getFiles(processRD: RemoteData<Process>): Observable<Bitstream[]> {
    if (processRD.hasSucceeded && processRD.payload.processStatus.toString() === 'COMPLETED') {
      return this.processService.getFiles(processRD.payload.processId).pipe(
        getFirstCompletedRemoteData(),
        map((response) => response.hasSucceeded ? response.payload.page : []),
      );
    } else {
      return of([]);
    }
  }

  /**
   * Get the name of a bitstream
   * @param bitstream
   */
  getFileName(bitstream: Bitstream) {
    return bitstream instanceof DSpaceObject ? this.nameService.getName(bitstream) : 'unknown';
  }

  /**
   * On destroy stop timer.
   */
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  /**
   * Remove notification from view using notification service.
   */
  public remove() {

    if (this.animate) {
      this.setAnimationOut();
      setTimeout(() => {
        this.notificationService.remove(this.notification);
      }, 1000);
    } else {
      this.notificationService.remove(this.notification);
    }

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  /**
   * Checks if content is html or normal text or observable.
   * @param item
   * @param key
   */
  private contentType(item: any, key: string) {
    if (item instanceof TemplateRef) {
      this[key] = item;
    } else if (key === 'title' || (key === 'content' && !this.html)) {
      let value = null;
      if (isNotEmpty(item)) {
        if (typeof item === 'string') {
          value = of(item);
        } else if (item instanceof Observable) {
          value = item;
        } else if (typeof item === 'object' && isNotEmpty(item.value)) {
          // when notifications state is transferred from SSR to CSR,
          // Observables Object loses the instance type and become simply object,
          // so converts it again to Observable
          value = of(item.value);
        }
      }
      this[key] = value;
    } else {
      this[key] = this.domSanitizer.bypassSecurityTrustHtml(item);
    }

    this[key + 'IsTemplate'] = item instanceof TemplateRef;
  }

  /**
   * Animation of notification on close.
   */
  private setAnimationOut() {
    this.animate = this.notification.options.animate + NotificationAnimationsStatus.Out;
    this.cdr.detectChanges();
  }
}
