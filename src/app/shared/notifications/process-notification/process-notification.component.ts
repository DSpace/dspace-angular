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
import { getFirstCompletedRemoteData, getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

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
  public process: Process;

  /**
   * If process checking is finished.
   */
  public finished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Files generated from process end.
   */
  public files: Bitstream[];

  /**
   * Type of the notification visualisation.
   */
  public notificationType = 'alert-info';

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
    this.initCheckProcess();
    this.html = this.notification.html;
    this.contentType(this.notification.title, 'title');
  }

  /**
   * Initialization of timer.
   */
  initCheckProcess() {
    const source = timer(0, this.notification.checkTime);
    this.sub = source.subscribe(val => {
      this.checkProcess();
    });
  }

  /**
   * Send request to get the updated process information.
   */
  checkProcess() {
    this.processService.getProcess(this.notification.processId)
    .pipe(getFirstCompletedRemoteData())
    .subscribe( (res) => {
      this.process = res.payload;
      console.log(this.process);
      this.zone.run(() => this.cdr.detectChanges());
      if (this.process.processStatus.toString() === 'COMPLETED' || this.process.processStatus.toString() === 'FAILED') {
        this.sub.unsubscribe();
        if (this.process.processStatus.toString() === 'COMPLETED') {
          this.notificationType = 'alert-success';
          this.getFiles();
        } else {
          this.notificationType = 'alert-danger';
          this.zone.run(() => this.cdr.detectChanges());
        }
        this.finished.next(true);
      }
    });
  }

  /**
   * When the process is completed get the files output.
   */
  getFiles() {
    this.processService.getFiles(this.notification.processId)
    .pipe(
      getFirstSucceededRemoteListPayload(),
     )
    .subscribe( (files: Bitstream[]) => {
      this.files = files.filter( (file) => !this.getFileName(file).includes('.log'));
      this.zone.run(() => this.cdr.detectChanges());
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
