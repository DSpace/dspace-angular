import { Component, EventEmitter, Output } from '@angular/core';
import { isNotEmpty } from '../../shared/empty.util';
import { Location } from '@angular/common';

@Component({
  selector: 'ds-community-form',
  styleUrls: ['./community-form.component.scss'],
  templateUrl: './community-form.component.html'
})
export class CommunityFormComponent {

  name: string;
  description: string;
  introductory: string;
  copyright: string;
  news: string;

  nameRequiredError = false;

  @Output() submitted: EventEmitter<any> = new EventEmitter();

  public constructor(private location: Location) {

  }

  onSubmit(data: any) {
    if (isNotEmpty(data.name)) {
      this.submitted.emit(data);
      this.nameRequiredError = false;
    } else {
      this.nameRequiredError = true;
    }
  }

  cancel() {
    this.location.back();
  }

}
