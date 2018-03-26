import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
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
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser } from '../../core/auth/selectors';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Subject } from 'rxjs/Subject';

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
  dso: any;
  @Output()
  refresh = new EventEmitter<any>();
  item: Observable<Item>;
  submitter: Observable<Eperson>;
  user: Observable<Eperson>;

  public unRead: Bitstream[] = [];
  public modalRef: NgbModalRef;

  public itemUUIDObs: Observable<string>;
  public messagesObs: Observable<Bitstream[]>;

  isSubmitter: Observable<boolean>;
  public messageForm: FormGroup;
  public processingMessage = false;
  private sub: Subscription;

  private rememberEmitUnread = false;
  private rememberEmitRead = false;

  constructor(private formBuilder: FormBuilder,
              public msgService: MessageService,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private store: Store<AppState>,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    // set formGroup
    this.messageForm = this.formBuilder.group({
      textSubject: ['', Validators.required],
      textDescription: ['', Validators.required]
    });

    this.user = this.store.select(getAuthenticatedUser)
      .filter((user: Eperson) => isNotEmpty(user))
      .take(1)
      .map((user: Eperson) => user);

    this.item = this.dso.item
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .map((rd: RemoteData<Eperson[]>) => rd.payload[0]);

    this.submitter = (this.dso.submitter as Observable<RemoteData<Eperson[]>>)
      .filter((rd: RemoteData<Eperson[]>) => rd.hasSucceeded && isNotEmpty(rd.payload))
      .take(1)
      .map((rd: RemoteData<Eperson[]>) => rd.payload[0]);

    this.isSubmitter = Observable.combineLatest(this.user, this.submitter)
      .filter(([user, submitter]) =>
        isNotEmpty(user) && isNotEmpty(submitter))
      .map(([user, submitter]) => {
        return user.uuid === submitter.uuid;
      }) as Observable<boolean>;

    this.messagesObs = this.item
      .filter((item: Item) => isNotEmpty(item))
      .take(1)
      .flatMap((item: Item) =>
        item.getBitstreamsByBundleName('MESSAGE')
          .filter((bitStreams: Bitstream[]) => isNotEmpty(bitStreams))
          .take(1)
          .map((bitStreams: Bitstream[]) => {
            this.unRead = [];
            bitStreams.forEach((m) => {
              this.isUnread(m)
                .take(1)
                .filter((isUnread) => isUnread)
                .subscribe((isUnread) => {
                  this.unRead.push(m);
                });
            });
            return bitStreams;
          })
      )
      .startWith([])
      .distinctUntilChanged();

    this.itemUUIDObs = this.item
      .filter((item: Item) => isNotEmpty(item))
      .take(1)
      .map((item: Item) => {
        return item.uuid;
      });

  }

  sendMessage(itemUuid) {
    this.processingMessage = true;
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
    if (msgUuid) {
      const body = {
        uuid: msgUuid
      };
      this.msgService.markAsUnread(body)
        .filter( (res) => res.hasSucceeded)
        .take(1)
        .subscribe((res) => {
          if (!res.error) {
            this.rememberEmitUnread = true;
            this.notificationsService.success(null, 'Message marked as not read');
          } else {
            this.notificationsService.warning(null, 'Impossible mark the message as not read');
          }
        });
    }
  }

  emitRefresh() {
    if (this.rememberEmitUnread && !this.rememberEmitRead) {
      // Refresh event for Unread
      this.refresh.emit('unread');
    } else if (!this.rememberEmitUnread && this.rememberEmitRead) {
      // Refresh event for Read
      this.refresh.emit('read');
    }
  }

  read() {
    this.unRead.forEach((m, i) => {
      const body = {
        uuid: m.uuid
      };
      if (i === 0) {
        this.rememberEmitRead = true;
      }
      this.msgService.markAsRead(body)
        .subscribe((res: MessageDataResponse) => {
          if (res.hasSucceeded) {
          } else {
            this.notificationsService.warning(null, 'Cannot mark messages as read...');
          }
        });
    });
  }

  isUnread(m: Bitstream): Observable<boolean> {
    const accessioned = m.findMetadata('dc.date.accessioned');
    const type = m.findMetadata('dc.type');
    return this.isSubmitter
      .filter((isSubmitter) => isNotEmpty(isSubmitter))
      .map((isSubmitter) => {
        if (!accessioned &&
          ((isSubmitter && type === 'outbound') || (!isSubmitter && type === 'inbound'))
        ) {
          return true;
        }
        return false;
      });
  }

  openMessageBoard(content) {
    this.rememberEmitUnread = false;
    this.rememberEmitRead = false;
    this.read();
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
      this.emitRefresh();
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.emitRefresh();
    });
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
