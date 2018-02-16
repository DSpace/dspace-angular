import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bitstream} from '../../core/shared/bitstream.model';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MessageService} from "../../core/message/message.service";
import {Observable} from "rxjs/Observable";
import {Eperson} from "../../core/eperson/models/eperson.model";
import {getAuthenticatedUser} from "../../core/auth/selectors";
import {AppState} from "../../app.reducer";
import {Store} from "@ngrx/store";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNotEmpty} from '../empty.util';

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
  public submitter: Eperson;
  @Input()
  public modalRef: NgbModalRef;
  @Input()
  public itemUUID: string;
  @Output()
  public close = new EventEmitter<any>();
  public show = [];

  /**
   * The message form.
   * @type {FormGroup}
   */
  public messageForm: FormGroup;

  public isCreator: boolean;
  public creatorUuid: string;
  public user: Eperson;
  public showUnread = false;

  constructor(private formBuilder: FormBuilder,
              private msgService: MessageService,
              private store: Store<AppState>,) {
  }

  ngOnInit() {
    // set formGroup
    this.messageForm = this.formBuilder.group({
      textSubject: ['', Validators.required],
      textDescription: ['', Validators.required]
    });

    this.messages.forEach((m: Bitstream) => {
      this.show.push(false);
      // if (m._links.content.href) {
      //
      // }

    });

    this.store.select(getAuthenticatedUser)
      .filter((user: Eperson) => isNotEmpty(user))
      .take(1)
      .subscribe((user: Eperson) => {
        this.user = user;
      });

    if (this.isLastMsgForMe()) {
      const lastMsg = this.messages[this.messages.length - 1];
      const accessioned = lastMsg.findMetadata('dc.date.accessioned');
      if (!accessioned) {
        this.read(); // Set as Read the last message
        this.showUnread = true;
      }
    }

  }

  isLastMsgForMe(): boolean {
    if (this.messages && this.messages.length > 0) {
      const lastMsg = this.messages[this.messages.length - 1];
      if (this.user.uuid === this.submitter.uuid) {
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

  toggleDescription(i: number) {
    this.show[i] = !this.show[i];
  }

  sendMessage() {
    // get subject and description values
    const subject: string = this.messageForm.get('textSubject').value;
    const description: string = this.messageForm.get('textDescription').value;
    const body = {
      uuid: this.itemUUID,
      subject,
      description
    };
    this.msgService.createMessage(body).subscribe((res) => {
      console.log('After message creation:');
      console.log(res);
    });
    this.modalRef.dismiss('Send Message');
  }

  unRead() {
    const uuid = this.messages[this.messages.length - 1].uuid;
    const body = {
      uuid: uuid
    }
    const req = this.msgService.markAsUnread(body).subscribe((res) => {
      console.log('After message unRead:');
      console.log(res);
    });
  }

  read() {
    const uuid = this.messages[this.messages.length - 1].uuid;
    const body = {
      uuid: uuid
    }
    const req = this.msgService.markAsRead(body).subscribe((res) => {
      console.log('After message read:');
      console.log(res);
    });
  }


}

// CREAZIONE messaggio
// - POST /api/messages
// argomenti
// - uuid item
// - subject
// - description
//
// PRESA visione
// - POST /api/messages/read
// argomenti
// - uuid bitsream
//
// CANCELLA visione
// - POST /api/messages/unread
// argomenti
// - uuid bitsream
