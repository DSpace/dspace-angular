import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements OnInit {
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() query: string;

  ngOnInit(): void { }

  onSubmit(form: any, scope?: string) {
    const data: any = Object.assign({}, form, { scope: scope });
    this.formSubmit.emit(data);
  }
}
