import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bitstream} from '../../core/shared/bitstream.model';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

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
  public textMessage: string;
  public isCreator: boolean;
  public creatorUuid: string;

  // constructor(public activeModal: NgbActiveModal) {
  // }

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
