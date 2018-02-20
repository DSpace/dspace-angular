import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { MessageService } from '../../core/message/message.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-message',
  styleUrls: ['./message.component.scss'],
  templateUrl: './message.component.html'
})

export class MessageComponent {
  @Input()
  public m: Bitstream;
  @Input()
  public showUnread: boolean;
  @Output()
  private unRead = new EventEmitter<any>();
  public show = false;
  private _description = '';
  private loadingDescription = false;

  constructor(public msgService: MessageService) {
  }

  toggleDescription() {
    this.show = !this.show;
  }

  get description(): Observable<string> {
    if (this._description === '' && !this.loadingDescription) {
      this.loadingDescription = true;
      this.msgService.getMessageContent(this.m.content).subscribe((res) => {
        this._description = res.payload || 'No content.';
        console.log('description=', this._description);
        this.loadingDescription = false;
      });
    }

    return Observable.of(this._description);
  }

  unReadLastMsg() {
    this.unRead.emit('unRead');
    this.showUnread = false;
  }

}
