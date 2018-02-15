import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bitstream} from '../../core/shared/bitstream.model';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MessageService} from "../../core/message/message.service";

@Component({
  selector: 'ds-message-board',
  styleUrls: ['./message-board.component.scss'],
  templateUrl: './message-board.component.html',
  providers: [
    NgbActiveModal,
  ]
})

export class MessageBoardComponent {
  @Input()
  public messages: Bitstream[];
  @Input()
  public modalRef: NgbModalRef;
  @Output()
  public close = new EventEmitter<any>();
  public show = [];
  public textSubject: string;
  public textDescription: string;
  public isCreator: boolean;
  public creatorUuid: string;

  constructor(private msgService: MessageService) {
  }

  ngOnInit() {
    this.textSubject = '';
    this.textDescription = '';
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
    const body = {
      uuid: '',
      subject: this.textSubject,
      description: this.textDescription
    };
    this.msgService.createMessage(body);
  }

}
