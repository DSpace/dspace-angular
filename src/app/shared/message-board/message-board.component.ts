import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../core/message/message.service';
import { Eperson } from '../../core/eperson/models/eperson.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationOptions } from '../notifications/models/notification-options.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../empty.util';

@Component({
  selector: 'ds-message-board',
  styleUrls: ['./message-board.component.scss'],
  templateUrl: './message-board.component.html',
  providers: [
    NgbActiveModal,
  ]
})

export class MessageBoardComponent implements OnDestroy {
  @Input()
  public messages: Observable<Bitstream[]>;
  @Input()
  public submitter: Observable<Eperson>;
  @Input()
  public user: Observable<Eperson>;
  @Input()
  public itemUUID: Observable<string>;
  public unRead: Bitstream[] = [];
  public modalRef: NgbModalRef;
  @Output()
  public refresh = new EventEmitter<any>();

  /**
   * The message form.
   * @type {FormGroup}
   */
  public messageForm: FormGroup;
  public showUnread = false;
  private sub: Subscription;

  constructor(private formBuilder: FormBuilder,
              public msgService: MessageService,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private translate: TranslateService,) {
  }

  ngOnInit() {
    // set formGroup
    this.messageForm = this.formBuilder.group({
      textSubject: ['', Validators.required],
      textDescription: ['', Validators.required]
    });

    this.messages
      .filter((msgs) => msgs !== null && msgs.length > 0)
      .subscribe((msgs) => {
        this.unRead = [];
        msgs.forEach((m) => {
          if (this.isUnread(m)) {
            this.unRead.push(m);
          }
        });

        if (this.isLastMsgForMe(msgs)) {
          const lastMsg = msgs[msgs.length - 1];
          const accessioned = lastMsg.findMetadata('dc.date.accessioned');
          if (!accessioned) {
            this.read(); // Set as Read the last message
          }
          this.showUnread = true;

          // TODO REMOVE... Use only for test the Set as Unread
          // this.unRead();
        }

      });
  }

  isLastMsgForMe(msgs): boolean {
    if (msgs && msgs.length > 0) {
      const lastMsg = msgs[msgs.length - 1];
      if (this.user.sequenceEqual(this.submitter)) {
        if (lastMsg.findMetadata('dc.type') === 'outbound') {
          return true;
        }
      } else {
        if (lastMsg.findMetadata('dc.type') === 'inbound') {
          return true;
        }
      }
    }
    return false;
  }

  sendMessage(itemUuid) {
    // get subject and description values
    const subject: string = this.messageForm.get('textSubject').value;
    const description: string = this.messageForm.get('textDescription').value;
    const body = {
      uuid: itemUuid,
      subject,
      description
    };
    this.sub = this.msgService.createMessage(body)
      .take(1)
      .subscribe((res) => {
        if (res.isSuccessful) {
          console.log('After message creation:');
          console.log(res);
          // Refresh event
          this.refresh.emit('read');
          this.modalRef.dismiss('Send Message');
          this.notificationsService.success(null,
            this.translate.get('submission.workflow.tasks.generic.success'),
            new NotificationOptions(5000, false));
        } else {
          this.notificationsService.error(null,
            this.translate.get('submission.workflow.tasks.generic.error'),
            new NotificationOptions(20000, true));
        }
      });
  }

  unReadLastMsg(msgUuid) {
    const body = {
      uuid: msgUuid
    };
    const req = this.msgService.markAsUnread(body).subscribe((res) => {
      console.log('After message unRead:');
      console.log(res);
      // Refresh event
      this.refresh.emit('read');
      this.showUnread = false;
    });
  }

  read() {
    this.unRead.forEach((uuid) => {
      const body = {
        uuid
      };
      const req = this.msgService.markAsRead(body).subscribe((res) => {
        console.log('After message read:');
        console.log(res);
        // Refresh event
        this.refresh.emit('read');
      });
    });
  }

  isUnread(m: Bitstream): boolean {
    const accessioned = m.findMetadata('dc.date.accessioned');
    const type = m.findMetadata('dc.type');
    if (this.user.sequenceEqual(this.submitter)
      && !accessioned
      && type === 'outbound') {
      return true;
    } else if (!this.user.sequenceEqual(this.submitter)
      && !accessioned
      && type === 'inbound') {
      return true;
    }
    return false;
  }

  openMessageBoard(content) {
    this.modalRef = this.modalService.open(content);
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
