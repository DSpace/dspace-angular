import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { combineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  find,
  first,
  flatMap,
  map,
  mergeMap,
  reduce,
  startWith,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Bitstream } from '../../core/shared/bitstream.model';
import { MessageService } from '../../core/message/message.service';
import { NotificationsService } from '../notifications/notifications.service';
import { hasValue, isNotEmpty } from '../empty.util';
import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { MessageDataResponse } from '../../core/message/message-data-response';
import { AppState } from '../../app.reducer';
import { getAuthenticatedUser } from '../../core/auth/selectors';
import { EPerson } from '../../core/eperson/models/eperson.model';

@Component({
  selector: 'ds-message-board',
  styleUrls: ['./message-board.component.scss'],
  templateUrl: './message-board.component.html',
  providers: [
    NgbActiveModal,
  ]
})

export class MessageBoardComponent implements OnDestroy {
  @Input() dso: any;
  @Input() tooltipMessage: string;
  @Output() refresh = new EventEmitter<any>();

  public item$: Observable<Item>;
  public submitter$: Observable<EPerson>;
  public user$: Observable<EPerson>;
  public unreadMessages$: Observable<Bitstream[]> = observableOf([]);
  public modalRef: NgbModalRef;
  public itemUUID$: Observable<string>;
  public messages$: Observable<Bitstream[]> = observableOf([]);
  public isSubmitter$: Observable<boolean>;
  public messageForm: FormGroup;
  public processingMessage = false;

  private subs: Subscription[] = [];
  private rememberEmitUnread = false;
  private rememberEmitRead = false;

  constructor(private formBuilder: FormBuilder,
              public msgService: MessageService,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private store: Store<AppState>,
              private translate: TranslateService) {
  }

  ngOnInit() {
    // set formGroup
    this.messageForm = this.formBuilder.group({
      textSubject: ['', Validators.required],
      textDescription: ['', Validators.required]
    });

    this.user$ = this.store.pipe(
      select(getAuthenticatedUser),
      find((user: EPerson) => isNotEmpty(user)),
      map((user: EPerson) => user),
      tap((u) => console.log(u)));

    this.item$ = this.dso.item.pipe(
      find((rd: RemoteData<Item>) => (rd.hasSucceeded && isNotEmpty(rd.payload))),
      map((rd: RemoteData<Item>) => rd.payload),
      tap((u) => console.log(u)));

    this.submitter$ = (this.dso.submitter as Observable<RemoteData<EPerson[]>>).pipe(
      find((rd: RemoteData<EPerson>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      map((rd: RemoteData<EPerson>) => rd.payload),
      tap((u) => console.log(u)));

    this.isSubmitter$ = combineLatest(this.user$, this.submitter$).pipe(
      filter(([user, submitter]) => isNotEmpty(user) && isNotEmpty(submitter)),
      map(([user, submitter]) => user.uuid === submitter.uuid),
      tap((u) => console.log(u)));

    this.messages$ = this.item$.pipe(
      find((item: Item) => isNotEmpty(item)),
      flatMap((item: Item) => item.getBitstreamsByBundleName('MESSAGE')),
      filter((bitStreams: Bitstream[]) => isNotEmpty(bitStreams)),
      startWith([]),
      distinctUntilChanged(),
      tap((u) => console.log(u)));

    this.unreadMessages$ = this.messages$.pipe(
      filter((messages: Bitstream[]) => isNotEmpty(messages)),
      flatMap((bitStream: Bitstream) =>
        observableOf(bitStream).pipe(
          withLatestFrom(this.isUnread(bitStream))
        )
      ),
      filter(([bitStream, isUnread]) => isUnread),
      map(([bitStream, isUnread]) => bitStream),
      reduce((acc: any, value: any) => [...acc, ...value], []),
      startWith([])
    );

    this.itemUUID$ = this.item$.pipe(
      find((item: Item) => isNotEmpty(item)),
      map((item: Item) => item.uuid),
      tap((u) => console.log(u)));

  }

  sendMessage(itemUUID) {
    this.processingMessage = true;
    const subject: string = this.messageForm.get('textSubject').value;
    const description: string = this.messageForm.get('textDescription').value;
    const body = {
      uuid: itemUUID,
      subject,
      description
    };
    this.subs.push(
      this.msgService.createMessage(body).pipe(
        first()
      ).subscribe((res: MessageDataResponse) => {
        this.processingMessage = false;
        this.modalRef.dismiss('Send Message');
        if (res.hasSucceeded) {
          // Refresh event
          this.refresh.emit('read');
          this.notificationsService.success(null,
            this.translate.get('submission.workflow.tasks.generic.success'));
        } else {
          this.notificationsService.error(null,
            this.translate.get('submission.workflow.tasks.generic.error'));
        }
      })
    );
  }

  markAsUnread(msgUUID: string) {
    if (msgUUID) {
      const body = {
        uuid: msgUUID
      };
      this.subs.push(
        this.msgService.markAsUnread(body).pipe(
          find((res) => res.hasSucceeded)
        ).subscribe((res) => {
          if (!res.error) {
            this.rememberEmitUnread = true;
            this.rememberEmitRead = false;
          } else {
            this.notificationsService.error(null, this.translate.get('submission.workflow.tasks.generic.error'));
          }
        })
      );
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

  markAsRead(msgUUID?: string) {
    let ids$: Observable<string[]>;
    if (msgUUID) {
      ids$ = observableOf([msgUUID]);
    } else {
      ids$ = this.unreadMessages$.pipe(
        filter((messages: Bitstream[]) => isNotEmpty(messages)),
        flatMap((message: Bitstream) => message.uuid),
        reduce((acc: any, value: any) => [...acc, ...value], []),
        startWith([])
      )
    }

    this.subs.push(
      ids$.pipe(
        filter((uuids) => isNotEmpty(uuids)),
        mergeMap((uuid: any) => {
          const body = { uuid };
          return this.msgService.markAsRead(body)
        })
      ).subscribe((res: MessageDataResponse) => {
        if (res.hasSucceeded) {
          this.rememberEmitRead = true;
          this.rememberEmitUnread = false;
        } else {
          this.notificationsService.error(null, this.translate.get('submission.workflow.tasks.generic.error'));
        }
      })
    );

  }

  isUnread(m: Bitstream): Observable<boolean> {
    const accessioned = m.firstMetadataValue('dc.date.accessioned');
    const type = m.firstMetadataValue('dc.type');
    return this.isSubmitter$.pipe(
      filter((isSubmitter) => isNotEmpty(isSubmitter)),
      map((isSubmitter) => (!accessioned &&
        ((isSubmitter && type === 'outbound') || (!isSubmitter && type === 'inbound')))
      ),
      startWith(false));
  }

  openMessageBoard(content) {
    this.rememberEmitUnread = false;
    this.rememberEmitRead = false;
    this.markAsRead();
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.modalRef.result.then((result) => {
      this.emitRefresh();
    }, (reason) => {
      this.emitRefresh();
    });
  }

  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
