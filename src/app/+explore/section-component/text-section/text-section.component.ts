import { Observable, of } from 'rxjs';
import { TextBoxSection, TextRowSection } from './../../../core/layout/models/section.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ds-text-section',
  templateUrl: './text-section.component.html'
})
export class TextSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  textBoxSection: TextBoxSection;

  textRows$: Observable<TextRowSection[]>;

  ngOnInit() {
    this.textRows$ = of(this.textBoxSection.textRows);
  }

}
