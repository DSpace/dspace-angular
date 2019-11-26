import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'name-variant-modal',
  templateUrl: './name-variant-modal.component.html',
  styleUrls: ['./name-variant-modal.component.scss']
})
export class NameVariantModalComponent implements OnInit {
  @Input() value: string;

  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit() {

  }

}
