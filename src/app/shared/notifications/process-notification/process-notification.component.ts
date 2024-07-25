import { BehaviorSubject, Observable, of as observableOf, Subscription, timer } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from '../notifications.service';
import { scaleEnter, scaleInState, scaleLeave, scaleOutState } from '../../animations/scale';
import { rotateEnter, rotateInState, rotateLeave, rotateOutState } from '../../animations/rotate';
import { fromBottomEnter, fromBottomInState, fromBottomLeave, fromBottomOutState } from '../../animations/fromBottom';
import { fromRightEnter, fromRightInState, fromRightLeave, fromRightOutState } from '../../animations/fromRight';
import { fromLeftEnter, fromLeftInState, fromLeftLeave, fromLeftOutState } from '../../animations/fromLeft';
import { fromTopEnter, fromTopInState, fromTopLeave, fromTopOutState } from '../../animations/fromTop';
import { fadeInEnter, fadeInState, fadeOutLeave, fadeOutState } from '../../animations/fade';
import { NotificationAnimationsStatus } from '../models/notification-animations-type';
import { isNotEmpty } from '../../empty.util';
import { IProcessNotification } from '../models/process-notification.model';
import { ProcessDataService } from '../../../core/data/processes/process-data.service';
import { Process } from '../../../process-page/processes/process.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import {
  getAllCompletedRemoteData, getFirstCompletedRemoteData
} from '../../../core/shared/operators';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';

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
      scaleInState, scaleEnter, scaleOutState, scaleLeave
    ])
  ],
  templateUrl: './process-notification.component.html',
  styleUrls: ['./process-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
              private zone: NgZone) {
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
    timer(0, 5000).pipe(
      switchMap(() => this.processService.getProcess(this.notification.processId)),
      getAllCompletedRemoteData(),
      filter((res: RemoteData<Process>) => res?.payload?.processStatus.toString() === 'COMPLETED' || res?.payload?.processStatus.toString() === 'FAILED'),
      take(1),
    ).subscribe((res: RemoteData<Process>) => {
      this.pollingFinishedFor(res.payload);
    });
  }

  /**
   * Handle process results
   *
   * @param process The process finished
   */
  pollingFinishedFor(process: Process) {
    const processStatus = process.processStatus.toString();
    if (processStatus === 'COMPLETED') {
      this.notificationType$.next('alert-success');
      this.processStatus$.next('process.new.notification.process.status.completed');
      this.getFiles();
    } else {
      this.processStatus$.next('process.new.notification.process.status.failed');
      this.notificationType$.next('alert-danger');
    }
    this.finished.next(true);
  }

  /**
   * When the process is completed get the files output.
   */
  getFiles() {
    this.processService.getFiles(this.notification.processId).pipe(
      getFirstCompletedRemoteData(),
      map((response) => response.hasSucceeded ? response.payload.page : [])
    ).subscribe( (files: Bitstream[]) => {
      const logFiles = files.filter( (file) => !this.getFileName(file).includes('.log'));
      this.files$.next(logFiles);
    });
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
    if (!!this.sub) {
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

    if (!!this.sub) {
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
          value = observableOf(item);
        } else if (item instanceof Observable) {
          value = item;
        } else if (typeof item === 'object' && isNotEmpty(item.value)) {
          // when notifications state is transferred from SSR to CSR,
          // Observables Object loses the instance type and become simply object,
          // so converts it again to Observable
          value = observableOf(item.value);
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
