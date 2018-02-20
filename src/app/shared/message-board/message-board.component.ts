import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from "../../core/message/message.service";
import { Observable } from "rxjs/Observable";
import { Eperson } from "../../core/eperson/models/eperson.model";
import { getAuthenticatedUser } from "../../core/auth/selectors";
import { AppState } from "../../app.reducer";
import { Store } from "@ngrx/store";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNotEmpty } from '../empty.util';
import { DSpaceRESTv2Service } from '../../core/dspace-rest-v2/dspace-rest-v2.service';

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
  public user: Eperson;
  @Input()
  public modalRef: NgbModalRef;
  @Input()
  public itemUUID: string;
  @Input()
  public unRead: string[];
  @Output()
  public refresh = new EventEmitter<any>();
  public show = [];

  /**
   * The message form.
   * @type {FormGroup}
   */
  public messageForm: FormGroup
  public showUnread = false;
  public description = [];

  constructor(private formBuilder: FormBuilder,
              private msgService: MessageService) {
  }

  ngOnInit() {
    // set formGroup
    this.messageForm = this.formBuilder.group({
      textSubject: ['', Validators.required],
      textDescription: ['', Validators.required]
    });

    this.messages.forEach((m: Bitstream) => {
      this.show.push(false);
      if (m._links.content) {
        const content = m._links.content;
        // TODO !!! MAKE HTTP REQUEST FOR DESCRIPTION
        // this.msgService.getRequest(content).subscribe( (desc) => {
        //   console.log(desc);
        //   this.description.push(desc);
        // });
      }

    });

    if (this.isLastMsgForMe()) {
      const lastMsg = this.messages[this.messages.length - 1];
      const accessioned = lastMsg.findMetadata('dc.date.accessioned');
      if (!accessioned) {
        this.read(); // Set as Read the last message
        this.showUnread = true;
      }

      // TODO REMOVE... Use only for test the Set as Unread
      // this.unRead();
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

    // Refresh event
    this.refresh.emit('read');

    this.modalRef.dismiss('Send Message');

  }

  unReadLastMsg() {
    const uuid = this.messages[this.messages.length - 1].uuid;
    const body = {
      uuid: uuid
    }
    const req = this.msgService.markAsUnread(body).subscribe((res) => {
      console.log('After message unRead:');
      console.log(res);
    });
    this.showUnread = false;
    // Refresh event
    this.refresh.emit('read');
  }

  read() {
    this.unRead.forEach( (uuid) => {
      const body = {
        uuid: uuid
      }
      const req = this.msgService.markAsRead(body).subscribe((res) => {
        console.log('After message read:');
        console.log(res);
      });
    });
    // Refresh event
    this.refresh.emit('read');
  }

}
