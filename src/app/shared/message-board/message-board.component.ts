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
import { hasNoUndefinedValue, hasValue, isNotEmpty } from '../empty.util';
import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { MessageDataResponse } from '../../core/message/message-data-response';

@Component({
  selector: 'ds-message-board',
  styleUrls: ['./message-board.component.scss'],
  templateUrl: './message-board.component.html',
  providers: [
    NgbActiveModal,
  ]
})

export class MessageBoardComponent implements OnDestroy {
  @Input() itemObs: Observable<RemoteData<Item[]>>;
  @Output() public refresh = new EventEmitter<any>();
  @Input() public submitter: Eperson;
  @Input() public user: Eperson;

  public unRead: Bitstream[] = [];
  public modalRef: NgbModalRef;

  public itemUUIDObs: Observable<string>;
  public messagesObs: Observable<Bitstream[]>;
  /**
   * The message form.
   * @type {FormGroup}
   */
  public messageForm: FormGroup;
  public processingMessage = false;
  public showUnread = false;
  private sub: Subscription;
  private readSub: Subscription;

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

    this.messagesObs = this.itemObs
      .filter((rd: RemoteData<Item[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .flatMap((rd: RemoteData<Item[]>) => {
        const item = rd.payload[0];
        return item.getBitstreamsByBundleName('MESSAGE')
          .filter((bitStreams: Bitstream[]) => isNotEmpty(bitStreams))
          .take(1)
          .map((bitStreams: Bitstream[]) => {
            console.log(bitStreams);
            return bitStreams;
          });
      })
      .startWith([])
      .distinctUntilChanged();

    this.messagesObs
      .filter((msgs) => msgs !== null && msgs.length > 0)
      .subscribe((msgs) => {
        this.unRead = [];
        msgs.forEach((m) => {
          if (this.isUnread(m)) {
            this.unRead.push(m);
          }
        });
      });

    this.itemUUIDObs = this.itemObs
      .filter((rd: RemoteData<Item[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .map((rd: RemoteData<Item[]>) => {
        const item = rd.payload[0];
        return item.uuid;
      });

    // this.submitter
    //   // .filter((s) => s !== null && s.uuid !== null)
    //   // .take(1)
    //   .map((s) => {
    //     console.log('Submitter uuid=' + s.uuid);
    //     return s;
    //   });
    //
    // this.user
    //   // .filter((u) => u !== null && u.uuid !== null)
    //   // .take(1)
    //   .map((u) => {
    //     console.log('User uuid=' + u.uuid);
    //     return u;
    //   });
  }

  readMessages() {
    this.readSub = this.messagesObs
      .filter((msgs) => msgs !== null && msgs.length > 0)
      .subscribe((msgs) => {
        const lastMsg = msgs[msgs.length - 1];
        const type = lastMsg.findMetadata('dc.type');
        if (
          // (this.user.sequenceEqual(this.submitter) && type === 'outbound')
          // || (!this.user.sequenceEqual(this.submitter) && type === 'inbound')
        (this.user.uuid === this.submitter.uuid && type === 'outbound')
        || (this.user.uuid !== this.submitter.uuid && type === 'inbound')
        ) {
          const accessioned = lastMsg.findMetadata('dc.date.accessioned');
          if (!accessioned) {
            this.read(); // Set as Read the last message
          }
          this.showUnread = true;
        }
      });
  }

  sendMessage(itemUuid) {
    this.processingMessage = true;
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
      .subscribe((res: MessageDataResponse) => {
        this.processingMessage = false;
        this.modalRef.dismiss('Send Message');
        if (res.hasSucceeded) {
          console.log('After message creation:');
          console.log(res);
          // Refresh event
          this.refresh.emit('read');

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
    this.msgService.markAsUnread(body)
      .subscribe((res: MessageDataResponse) => {
        console.log('After message unRead:');
        console.log(res);
        // Refresh event
        this.refresh.emit('read');
        this.showUnread = false;
    });
  }

  read() {
    this.unRead.forEach((m) => {
      const body = {
        uuid: m.uuid
      };
      this.msgService.markAsRead(body)
        .subscribe((res: MessageDataResponse) => {
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
    // if (this.user.sequenceEqual(this.submitter)
    if (this.user.uuid === this.submitter.uuid
      && !accessioned
      && type === 'outbound') {
      return true;
    // } else if (!this.user.sequenceEqual(this.submitter)
    } else if (this.user.uuid !== this.submitter.uuid
      && !accessioned
      && type === 'inbound') {
      return true;
    }
    return false;
  }

  openMessageBoard(content) {
    this.modalRef = this.modalService.open(content);
    this.readMessages();
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    if (hasValue(this.readSub)) {
      this.readSub.unsubscribe();
    }
  }

}
