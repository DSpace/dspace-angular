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
import { INotification } from '../models/notification.model';
import { scaleEnter, scaleInState, scaleLeave, scaleOutState } from '../../animations/scale';
import { rotateEnter, rotateInState, rotateLeave, rotateOutState } from '../../animations/rotate';
import { fromBottomEnter, fromBottomInState, fromBottomLeave, fromBottomOutState } from '../../animations/fromBottom';
import { fromRightEnter, fromRightInState, fromRightLeave, fromRightOutState } from '../../animations/fromRight';
import { fromLeftEnter, fromLeftInState, fromLeftLeave, fromLeftOutState } from '../../animations/fromLeft';
import { fromTopEnter, fromTopInState, fromTopLeave, fromTopOutState } from '../../animations/fromTop';
import { fadeEnter, fadeInEnter, fadeInState, fadeLeave, fadeOutLeave, fadeOutState } from '../../animations/fade';
import { NotificationAnimationsStatus } from '../models/notification-animations-type';

@Component({
  selector: 'ds-notification',
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
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NotificationComponent implements OnInit, OnDestroy {

  @Input() public item: INotification;

  // Progress bar variables
  public title: any;
  public content: any;
  public html: any;
  public titleIsTemplate = false;
  public contentIsTemplate = false;
  public htmlIsTemplate = false;

  // public progressWidth = 0;

  private stopTime = false;
  private timer: any;
  private steps: number;
  private speed: number;
  private count = 0;

  private start: any;
  private diff: any;

  // 'fade' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | 'rotate' | 'scale' ;
  public animate: string;

  constructor(private notificationService: NotificationsService,
              private domSanitizer: DomSanitizer,
              private cdr: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    this.animate = this.item.options.animate + NotificationAnimationsStatus.In;

    if (this.item.options.timeOut !== 0) {
      this.startTimeOut();
    }

    this.contentType(this.item.title, 'title');
    this.contentType(this.item.content, 'content');
    this.contentType(this.item.html, 'html');
  }

  startTimeOut(): void {
    this.steps = this.item.options.timeOut / 10;
    this.speed = this.item.options.timeOut / this.steps;
    this.start = new Date().getTime();
    this.zone.runOutsideAngular(() => this.timer = setTimeout(this.instance, this.speed));
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private instance = () => {
    this.diff = (new Date().getTime() - this.start) - (this.count * this.speed);

    if (this.count++ === this.steps) {
      this.remove();
      // this.item.timeoutEnd!.emit();
    } else if (!this.stopTime) {
      // if (this.showProgressBar) {
      //   this.progressWidth += 100 / this.steps;
      // }

      this.timer = setTimeout(this.instance, (this.speed - this.diff));
    }
    this.zone.run(() => this.cdr.detectChanges());
  };

  private remove() {
    if (this.animate) {
      this.setAnimationOut();
      setTimeout(() => {
        this.notificationService.remove(this.item);
      }, 1000);
    } else {
      this.notificationService.remove(this.item);
    }
  }

  private contentType(item: any, key: string) {
    if (item instanceof TemplateRef) {
      this[key] = item;
    } else {
      this[key] = this.domSanitizer.bypassSecurityTrustHtml(item);
    }

    this[key + 'IsTemplate'] = item instanceof TemplateRef;
  }

  setAnimationOut() {
    this.animate = this.item.options.animate + NotificationAnimationsStatus.Out;
    this.cdr.detectChanges();
  }
}
