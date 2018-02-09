import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';

@Component({
  selector: 'ds-message-board',
  styleUrls: ['./message-board.component.scss'],
  templateUrl: './message-board.component.html'
})

export class MessageBoardComponent {
  @Input()
  public messages: Bitstream[];
  @Output()
  public close = new EventEmitter<any>();
  public show = [];
  public textMessage: string;
  public isCreator: boolean;
  public creatorUuid: string;

  ngOnInit() {
    this.textMessage = '';
    this.messages.forEach((m) => {
      this.show.push(false);
    });


    // TODO Check if actual user is the creator

    // TODO Mark as read only when other read, not the writer

    // TODO Remove, only for testing


  }

  closeDashboard($event) {
    this.close.emit(event);
  }

  toggleDescription(i: number) {
    this.show[i] = !this.show[i];
  }

  sendMessage() {
    // TODO
  }

}

interface DsMessage {
  uuid: string, // bitstream message id
  title: string,
  description: string,
  sent?: string,
  read?: string, // NULL if not read
  creatorName?: string, // String, not id
  type?: string, // INBOUND, OUTBOUND
}
