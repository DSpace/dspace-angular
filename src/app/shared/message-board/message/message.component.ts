import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { first, flatMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { Bitstream } from '../../../core/shared/bitstream.model';
import { MessageService } from '../../../core/message/message.service';
import { isNull } from '../../empty.util';

@Component({
  selector: 'ds-message',
  styleUrls: ['./message.component.scss'],
  templateUrl: './message.component.html'
})

export class MessageComponent implements OnInit {
  @Input() m: Bitstream;
  @Input() isLast: boolean;
  @Input() isSubmitter: boolean;

  @Output() emitUnread = new EventEmitter<any>();
  @Output() emitRead = new EventEmitter<any>();

  public showUnread: boolean;
  public showRead: boolean;
  public showMessage = false;

  private _messageContent: Observable<string> = null;
  private loadingDescription = false;

  constructor(private cdr: ChangeDetectorRef,
              private msgService: MessageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    const type = this.m.firstMetadataValue('dc.type');

    if (this.isLast) {
      if ((this.isSubmitter && type === 'outbound')
        || (!this.isSubmitter && type === 'inbound')) {
        this.showUnread = true;
        this.showRead = false;
      }
    } else {
      this.showUnread = false;
      this.showRead = false;
    }
  }

  toggleDescription() {
    this.showMessage = !this.showMessage;
    this.cdr.detectChanges();
  }

  get messageContent(): Observable<string> {
    if (isNull(this._messageContent) && !this.loadingDescription) {
      this.loadingDescription = true;
      this._messageContent = this.msgService.getMessageContent(this.m.content).pipe(
        first(),
        flatMap((res) => {
          this._messageContent = res.payload ? observableOf(res.payload) : this.translate.get('mydspace.messages.no-content');
          this.loadingDescription = false;
          return this._messageContent;
        }));
    }
    return this._messageContent;
  }

  markAsRead() {
    this.emitRead.emit(true);
    this.showUnread = true;
    this.showRead = false;
  }

  markAsUnread() {
    this.emitUnread.emit(true);
    this.showUnread = false;
    this.showRead = true;
  }

}
