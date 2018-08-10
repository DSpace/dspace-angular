import { Component, EventEmitter, Output } from '@angular/core';
import { isNotEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-collection-form',
  styleUrls: ['./collection-form.component.scss'],
  templateUrl: './collection-form.component.html'
})
export class CollectionFormComponent {

  name: string;
  description: string;
  introductory: string;
  copyright: string;
  news: string;
  license: string;
  provenance: string;

  nameRequiredError = false;

  @Output() submitted: EventEmitter<any> = new EventEmitter();

  onSubmit(data: any) {
    if (isNotEmpty(data.name)) {
      this.submitted.emit(data);
      this.nameRequiredError = false;
    } else {
      this.nameRequiredError = true;
    }
  }

}
